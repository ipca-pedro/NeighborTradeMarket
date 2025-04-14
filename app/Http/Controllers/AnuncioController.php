<?php

namespace App\Http\Controllers;

use App\Models\Anuncio;
use App\Models\Aprovacao;
use App\Models\Imagem;
use App\Models\ItemImagem;
use App\Models\Categoria;
use App\Models\TipoItem;
use App\Models\StatusAnuncio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AnuncioController extends Controller
{
    /**
     * Listar todos os anúncios aprovados
     */
    public function index()
    {
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
            ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_APROVADO)
            ->where('Status_AnuncioID_Status_Anuncio', '!=', StatusAnuncio::STATUS_REJEITADO)
            ->orderBy('ID_Anuncio', 'desc')
            ->paginate(10);
        
        return response()->json($anuncios);
    }
    
    /**
     * Listar anúncios por categoria
     */
    public function byCategoria($categoriaId)
    {
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
            ->where('CategoriaID_Categoria', $categoriaId)
            ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_APROVADO)
            ->where('Status_AnuncioID_Status_Anuncio', '!=', StatusAnuncio::STATUS_REJEITADO)
            ->orderBy('ID_Anuncio', 'desc')
            ->paginate(10);
        
        return response()->json($anuncios);
    }
    
    /**
     * Listar anúncios pendentes de aprovação (apenas para administradores)
     */
    public function anunciosPendentes()
    {
        // Verificar se o usuário é administrador
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        $anunciosPendentes = Anuncio::with([
            'utilizador', 
            'categorium', 
            'tipo_item', 
            'item_imagems.imagem', 
            'aprovacao'
        ])
        ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_PENDENTE)
        ->orderBy('ID_Anuncio', 'desc')
        ->paginate(10);
        
        return response()->json($anunciosPendentes);
    }
    
    /**
     * Aprovar um anúncio (apenas para administradores)
     */
    public function aprovarAnuncio($id)
    {
        // Verificar se o usuário é administrador
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        try {
            DB::beginTransaction();
            
            $anuncio = Anuncio::findOrFail($id);
            
            // Verificar se o anúncio já foi processado
            if ($anuncio->Status_AnuncioID_Status_Anuncio != StatusAnuncio::STATUS_PENDENTE) {
                return response()->json([
                    'message' => 'Este anúncio já foi processado'
                ], 400);
            }
            
            // Atualizar status do anúncio
            $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_APROVADO;
            $anuncio->save();
            
            // Atualizar status da aprovação
            $aprovacao = Aprovacao::find($anuncio->AprovacaoID_aprovacao);
            
            if ($aprovacao) {
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 2;
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->UtilizadorID_Admin = Auth::id();
                $aprovacao->save();
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Anúncio aprovado com sucesso!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao aprovar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Rejeitar um anúncio (apenas para administradores)
     */
    public function rejeitarAnuncio(Request $request, $id)
    {
        if (!Auth::check() || !Auth::user()->hasRole('admin')) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'motivo' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $anuncio = Anuncio::findOrFail($id);

            if ($anuncio->Status_AnuncioID_Status_Anuncio != StatusAnuncio::STATUS_PENDENTE) {
                return response()->json([
                    'message' => 'Este anúncio já foi processado'
                ], 400);
            }

            $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_REJEITADO;
            $anuncio->save();

            $aprovacao = Aprovacao::find($anuncio->AprovacaoID_aprovacao);

            if ($aprovacao) {
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 3;
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->UtilizadorID_Admin = Auth::id();
                $aprovacao->motivo_rejeicao = $request->motivo;
                $aprovacao->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Anúncio rejeitado com sucesso'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao rejeitar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obter todos os tipos de item disponíveis
     */
    public function getTiposItem()
    {
        $tipos = TipoItem::getAllValidTypes();
        return response()->json($tipos);
    }
    
    /**
     * Obter anúncios do usuário logado
     */
    public function myAds()
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Você precisa estar logado para ver seus anúncios'
            ], 401);
        }

        $anuncios = Anuncio::with([
            'utilizador', 
            'categorium', 
            'tipo_item', 
            'item_imagems.imagem', 
            'aprovacao'
        ])
        ->where('UtilizadorID_User', Auth::id())
        ->orderBy('ID_Anuncio', 'desc')
        ->get();

        return response()->json($anuncios);
    }
    
    /**
     * Criar um novo anúncio
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Titulo' => 'required|string|max:100',
            'Descricao' => 'required|string',
            'Preco' => 'required|numeric|min:0.01|max:9999.99',
            'CategoriaID_Categoria' => 'required|exists:categoria,ID_Categoria',
            'Tipo_ItemID_Tipo' => 'required|exists:tipo_item,ID_Tipo',
            'imagens' => 'nullable|array',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120' // Aumentado para 5MB e adicionado webp
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Criar aprovação (pendente)
            $aprovacao = new Aprovacao();
            $aprovacao->Data_Submissao = now(); // Corrigido: Data_Submissao em vez de Data_Criacao
            $aprovacao->Status_AprovacaoID_Status_Aprovacao = 1;
            $aprovacao->UtilizadorID_Admin = 1; // Usando ID 1 como admin padrão conforme memória
            $aprovacao->save();

            // Criar anúncio
            $anuncio = new Anuncio();
            $anuncio->Titulo = $request->Titulo;
            $anuncio->Descricao = $request->Descricao;
            $anuncio->Preco = $request->Preco;
            $anuncio->CategoriaID_Categoria = $request->CategoriaID_Categoria;
            $anuncio->Tipo_ItemID_Tipo = $request->Tipo_ItemID_Tipo;
            
            // Garantir que UtilizadorID_User seja um inteiro
            $userId = Auth::id();
            if (!is_numeric($userId)) {
                // Se não for numérico, buscar o ID do usuário pelo email
                $user = Auth::user();
                $userId = $user->ID_Utilizador;
                \Log::info('Convertendo email para ID: ' . Auth::id() . ' -> ' . $userId);
            }
            
            $anuncio->UtilizadorID_User = $userId;
            $anuncio->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_PENDENTE; // 1 para pendente
            $anuncio->save();

            // Processar imagens
            if ($request->hasFile('imagens')) {
                $imagens = $request->file('imagens');
                
                // Criar diretório se não existir
                $diretorio = 'anuncios/' . $anuncio->ID_Anuncio;
                if (!Storage::disk('public')->exists($diretorio)) {
                    Storage::disk('public')->makeDirectory($diretorio);
                }
                
                foreach ($imagens as $key => $imagemFile) {
                    try {
                        // Gerar nome único para a imagem
                        $imagemNome = uniqid() . '_' . $key . '.' . $imagemFile->getClientOriginalExtension();
                        $imagemPath = $imagemFile->storeAs($diretorio, $imagemNome, 'public');
                        
                        // Salvar informações da imagem no banco
                        $imagem = new Imagem();
                        $imagem->Caminho = $imagemPath;
                        $imagem->save();
                        
                        // Associar imagem ao anúncio
                        $itemImagem = new ItemImagem();
                        $itemImagem->AnuncioID_Anuncio = $anuncio->ID_Anuncio;
                        $itemImagem->ImagemID_Imagem = $imagem->ID_Imagem;
                        $itemImagem->Principal = ($key == 0) ? 1 : 0; // Primeira imagem como principal
                        $itemImagem->save();
                        
                        \Log::info('Imagem salva com sucesso: ' . $imagemPath);
                    } catch (\Exception $e) {
                        \Log::error('Erro ao salvar imagem: ' . $e->getMessage());
                        // Continuar com as próximas imagens mesmo se uma falhar
                    }
                }
            } else {
                \Log::info('Nenhuma imagem enviada para o anúncio ID: ' . $anuncio->ID_Anuncio);
            }

            DB::commit();

            $anuncio->load([
                'categorium', 
                'tipo_item', 
                'item_imagems.imagem', 
                'utilizador', 
                'aprovacao'
            ]);

            return response()->json([
                'message' => 'Anúncio criado com sucesso e aguardando aprovação',
                'anuncio' => $anuncio
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao criar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Listar anúncios por tipo de item
     */
    public function byTipoItem($tipoItemId)
    {
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
            ->where('TipoItemID_TipoItem', $tipoItemId)
            ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_APROVADO)
            ->where('Status_AnuncioID_Status_Anuncio', '!=', StatusAnuncio::STATUS_REJEITADO)
            ->orderBy('ID_Anuncio', 'desc')
            ->paginate(10);
        
        return response()->json($anuncios);
    }
    
    /**
     * Listar anúncios de um utilizador
     */
    public function byUser($userId)
    {
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
            ->where('UtilizadorID_User', $userId)
            ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_APROVADO)
            ->where('Status_AnuncioID_Status_Anuncio', '!=', StatusAnuncio::STATUS_REJEITADO)
            ->orderBy('ID_Anuncio', 'desc')
            ->paginate(10);
        
        return response()->json($anuncios);
    }
    
    /**
     * Exibir detalhes de um anúncio
     */
    public function show($id)
    {
        $anuncio = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem', 'aprovacao'])
            ->find($id);
        
        if (!$anuncio) {
            return response()->json(['message' => 'Anúncio não encontrado'], 404);
        }
        
        return response()->json($anuncio);
    }
    
    /**
     * Atualizar um anúncio
     */
    public function update(Request $request, $id)
    {
        $anuncio = Anuncio::find($id);
        
        if (!$anuncio) {
            return response()->json(['message' => 'Anúncio não encontrado'], 404);
        }
        
        // Verificar se o usuário é o dono do anúncio
        if ($anuncio->UtilizadorID_User != Auth::id() && !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Você não tem permissão para atualizar este anúncio'], 403);
        }
        
        // Validar dados do anúncio
        $validator = Validator::make($request->all(), [
            'Titulo' => 'sometimes|required|string|max:100',
            'Descricao' => 'sometimes|required|string',
            'Preco' => 'sometimes|required|numeric|min:0.01|max:9999.99',
            'CategoriaID_Categoria' => 'sometimes|required|exists:categoria,ID_Categoria',
            'TipoItemID_TipoItem' => 'sometimes|required|exists:tipo_item,ID_Tipo',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        DB::beginTransaction();
        
        try {
            // Atualizar dados do anúncio
            if ($request->has('Titulo')) {
                $anuncio->Titulo = $request->Titulo;
            }
            
            if ($request->has('Descricao')) {
                $anuncio->Descricao = $request->Descricao;
            }
            
            if ($request->has('Preco')) {
                $anuncio->Preco = $request->Preco;
            }
            
            if ($request->has('CategoriaID_Categoria')) {
                $anuncio->CategoriaID_Categoria = $request->CategoriaID_Categoria;
            }
            
            if ($request->has('TipoItemID_TipoItem')) {
                $anuncio->TipoItemID_TipoItem = $request->TipoItemID_TipoItem;
            }
            
            // Se o anúncio já foi aprovado, voltar para pendente após atualização
            if ($anuncio->Status_AnuncioID_Status_Anuncio == StatusAnuncio::STATUS_APROVADO) {
                $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_PENDENTE;
                
                // Atualizar aprovação
                $aprovacao = Aprovacao::find($anuncio->AprovacaoID_aprovacao);
                
                if ($aprovacao) {
                    $aprovacao->Status_AprovacaoID_Status_Aprovacao = 1;
                    $aprovacao->Data_Aprovacao = null;
                    $aprovacao->Comentario = null;
                    $aprovacao->UtilizadorID_Admin = null;
                    $aprovacao->save();
                }
            }
            
            $anuncio->save();
            
            // Processar novas imagens (se houver)
            if ($request->hasFile('imagens')) {
                $imagens = $request->file('imagens');
                
                // Remover imagens antigas se solicitado
                if ($request->has('remover_imagens_antigas') && $request->remover_imagens_antigas) {
                    foreach ($anuncio->item_imagems as $item_imagem) {
                        // Remover arquivo físico
                        if ($item_imagem->imagem && Storage::exists('public/' . $item_imagem->imagem->Caminho)) {
                            Storage::delete('public/' . $item_imagem->imagem->Caminho);
                        }
                        
                        // Remover registro na tabela item_imagem
                        $item_imagem->delete();
                        
                        // Remover a imagem
                        if ($item_imagem->imagem) {
                            $item_imagem->imagem->delete();
                        }
                    }
                }
                
                foreach ($imagens as $key => $imagemFile) {
                    // Gerar nome único para o arquivo
                    $imagemNome = time() . '_' . $key . '.' . $imagemFile->getClientOriginalExtension();
                    
                    // Salvar arquivo no storage
                    $imagemPath = $imagemFile->storeAs('anuncios/' . $anuncio->ID_Anuncio, $imagemNome, 'public');
                    
                    // Criar registro de imagem
                    $imagem = new Imagem();
                    $imagem->Caminho = $imagemPath;
                    $imagem->save();
                    
                    // Criar relação entre anúncio e imagem
                    $itemImagem = new ItemImagem();
                    $itemImagem->AnuncioID_Anuncio = $anuncio->ID_Anuncio;
                    $itemImagem->ImagemID_Imagem = $imagem->ID_Imagem;
                    $itemImagem->Principal = ($key == 0 && !$anuncio->item_imagems()->exists()) ? 1 : 0; // Primeira imagem é a principal se não houver outras
                    $itemImagem->save();
                }
            }
            
            DB::commit();
            
            // Carregar relações para retornar no response
            $anuncio->load(['categorium', 'tipo_item', 'item_imagems.imagem', 'utilizador', 'aprovacao']);
            
            return response()->json([
                'message' => 'Anúncio atualizado com sucesso e aguardando aprovação',
                'anuncio' => $anuncio
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remover um anúncio
     */
    public function destroy($id)
    {
        $anuncio = Anuncio::with(['item_imagems.imagem'])->find($id);
        
        if (!$anuncio) {
            return response()->json(['message' => 'Anúncio não encontrado'], 404);
        }
        
        // Verificar se o usuário é o dono do anúncio
        if ($anuncio->UtilizadorID_User != Auth::id() && !Auth::user()->hasRole('admin')) {
            return response()->json(['message' => 'Você não tem permissão para remover este anúncio'], 403);
        }
        
        DB::beginTransaction();
        
        try {
            // Remover imagens associadas
            foreach ($anuncio->item_imagems as $item_imagem) {
                // Remover arquivo físico
                if ($item_imagem->imagem && Storage::exists('public/' . $item_imagem->imagem->Caminho)) {
                    Storage::delete('public/' . $item_imagem->imagem->Caminho);
                }
                
                // Remover registro na tabela item_imagem
                $item_imagem->delete();
                
                // Remover a imagem
                if ($item_imagem->imagem) {
                    $item_imagem->imagem->delete();
                }
            }
            
            // Remover o anúncio
            $anuncio->delete();
            
            DB::commit();
            
            return response()->json(['message' => 'Anúncio removido com sucesso']);
            
        } catch (\Exception $e) {
            \Log::error('Erro ao remover anúncio: ' . $e->getMessage());
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao remover anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Rejeitar um anúncio (apenas admin)
     */
    public function rejeitar(Request $request, $id)
    {
        $request->validate([
            'Comentario' => 'required|string'
        ]);
        
        $anuncio = Anuncio::with('aprovacao')->find($id);
        
        if (!$anuncio) {
            return response()->json(['message' => 'Anúncio não encontrado'], 404);
        }
        
        DB::beginTransaction();
        
        try {
            // Atualizar aprovação
            $anuncio->aprovacao->update([
                'Data_Aprovacao' => now(),
                'Comentario' => $request->Comentario,
                'UtilizadorID_Admin' => Auth::id(),
                'Status_AprovacaoID_Status_Aprovacao' => 3 // Status rejeitado
            ]);
            
            // Atualizar status do anúncio
            $anuncio->update([
                'Status_AnuncioID_Status_Anuncio' => 3 // Status rejeitado
            ]);
            
            DB::commit();
            
            return response()->json(['message' => 'Anúncio rejeitado com sucesso']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao rejeitar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obter todas as categorias disponíveis
     */
    public function getCategories()
    {
        try {
            $categorias = DB::table('categoria')->get();
            return response()->json($categorias);
        } catch (\Exception $e) {
            \Log::error('Erro ao obter categorias: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao obter categorias: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obter anúncios aleatórios aprovados
     */
    public function getAnunciosAleatorios(Request $request)
    {
        try {
            // Obter o número de anúncios solicitados ou usar um valor padrão
            $quantidade = $request->input('quantidade', 10);
            
            // Obter o tipo de item (opcional)
            $tipoItemId = $request->input('tipo');
            
            // Consulta base
            $query = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
                ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_APROVADO)
                ->where('Status_AnuncioID_Status_Anuncio', '!=', StatusAnuncio::STATUS_REJEITADO);
            
            // Filtrar por tipo de item se especificado
            if ($tipoItemId) {
                $query->where('TipoItemID_TipoItem', $tipoItemId);
            }
            
            // Obter anúncios aleatórios
            $anuncios = $query->inRandomOrder()
                ->limit($quantidade)
                ->get();
            
            return response()->json($anuncios);
        } catch (\Exception $e) {
            \Log::error('Erro ao obter anúncios aleatórios: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao obter anúncios aleatórios: ' . $e->getMessage(),
                'anuncios' => []
            ], 500);
        }
    }
}
