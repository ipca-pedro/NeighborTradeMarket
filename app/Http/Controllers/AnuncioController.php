<?php

namespace App\Http\Controllers;

use App\Models\Anuncio;
use App\Models\Aprovacao;
use App\Models\Imagem;
use App\Models\ItemImagem;
use App\Models\Categoria;
use App\Models\Tipo_Item;
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
            ->where('Status_AnuncioID_Status_Anuncio', 2) // Status aprovado
            ->orderBy('ID_Anuncio', 'desc')
            ->get();
        
        return response()->json($anuncios);
    }
    
    /**
     * Listar anúncios por categoria
     */
    public function byCategoria($categoriaId)
    {
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
            ->where('CategoriaID_Categoria', $categoriaId)
            ->where('Status_AnuncioID_Status_Anuncio', 2) // Status aprovado
            ->orderBy('ID_Anuncio', 'desc')
            ->get();
        
        return response()->json($anuncios);
    }
    
    /**
     * Listar anúncios pendentes de aprovação (apenas para administradores)
     */
    public function anunciosPendentes()
    {
        // Verificar se o usuário é administrador
        $user = auth()->user();
        if (!$user || $user->TipoUserID_TipoUser != 1) { // Assumindo que TipoUserID_TipoUser = 1 é admin
            return response()->json([
                'message' => 'Acesso não autorizado.'
            ], 403);
        }
        
        // Buscar anúncios pendentes de aprovação
        $anunciosPendentes = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem', 'aprovacao'])
            ->whereHas('aprovacao', function($query) {
                $query->where('Status_AprovacaoID_Status_Aprovacao', 1); // Status pendente
            })
            ->where('Status_AnuncioID_Status_Anuncio', 1) // Status pendente
            ->orderBy('ID_Anuncio', 'desc')
            ->get();
        
        return response()->json($anunciosPendentes);
    }
    
    /**
     * Aprovar um anúncio (apenas para administradores)
     */
    public function aprovarAnuncio($id)
    {
        // Verificar se o usuário é administrador
        $user = auth()->user();
        if (!$user || $user->TipoUserID_TipoUser != 1) { // Assumindo que TipoUserID_TipoUser = 1 é admin
            return response()->json([
                'message' => 'Acesso não autorizado.'
            ], 403);
        }
        
        try {
            DB::beginTransaction();
            
            // Buscar o anúncio
            $anuncio = Anuncio::findOrFail($id);
            
            // Atualizar status do anúncio
            $anuncio->Status_AnuncioID_Status_Anuncio = 2; // Status aprovado
            $anuncio->save();
            
            // Atualizar status da aprovação
            $aprovacao = DB::table('aprovacao')->where('ID_aprovacao', $anuncio->AprovacaoID_aprovacao)->first();
            
            if ($aprovacao) {
                DB::table('aprovacao')
                    ->where('ID_aprovacao', $anuncio->AprovacaoID_aprovacao)
                    ->update([
                        'Status_AprovacaoID_Status_Aprovacao' => 2, // Status aprovado
                        'Data_Aprovacao' => now(),
                        'UtilizadorID_Admin' => $user->ID_User // ID do admin que aprovou
                    ]);
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
        // Verificar se o usuário é administrador
        $user = auth()->user();
        if (!$user || $user->TipoUserID_TipoUser != 1) { // Assumindo que TipoUserID_TipoUser = 1 é admin
            return response()->json([
                'message' => 'Acesso não autorizado.'
            ], 403);
        }
        
        $request->validate([
            'Comentario' => 'required|string'
        ]);
        
        try {
            DB::beginTransaction();
            
            // Buscar o anúncio
            $anuncio = Anuncio::findOrFail($id);
            
            // Atualizar status do anúncio
            $anuncio->Status_AnuncioID_Status_Anuncio = 3; // Status rejeitado
            $anuncio->save();
            
            // Atualizar status da aprovação
            $aprovacao = DB::table('aprovacao')->where('ID_aprovacao', $anuncio->AprovacaoID_aprovacao)->first();
            
            if ($aprovacao) {
                DB::table('aprovacao')
                    ->where('ID_aprovacao', $anuncio->AprovacaoID_aprovacao)
                    ->update([
                        'Status_AprovacaoID_Status_Aprovacao' => 3, // Status rejeitado
                        'Data_Aprovacao' => now(),
                        'Comentario' => $request->Comentario,
                        'UtilizadorID_Admin' => $user->ID_User // ID do admin que rejeitou
                    ]);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Anúncio rejeitado com sucesso!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao rejeitar anúncio: ' . $e->getMessage()
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
            ->where('Status_AnuncioID_Status_Anuncio', 2) // Status aprovado
            ->orderBy('ID_Anuncio', 'desc')
            ->get();
        
        return response()->json($anuncios);
    }
    
    /**
     * Listar anúncios de um utilizador
     */
    public function byUser($userId)
    {
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
            ->where('UtilizadorID_User', $userId)
            ->where('Status_AnuncioID_Status_Anuncio', 2) // Status aprovado
            ->orderBy('ID_Anuncio', 'desc')
            ->get();
        
        return response()->json($anuncios);
    }
    
    /**
     * Criar um novo anúncio
     */
    public function store(Request $request)
    {
        // Validar dados do anúncio
        $validator = Validator::make($request->all(), [
            'Titulo' => 'required|string|max:100',
            'Descricao' => 'required|string',
            'Preco' => 'required|numeric|max:9999.99', // Máximo permitido pelo campo decimal(6,2)
            'CategoriaID_Categoria' => 'required|exists:categoria,ID_Categoria',
            'TipoItemID_TipoItem' => 'required|exists:tipo_item,ID_Tipo',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // Imagens são opcionais agora
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }
        
        DB::beginTransaction();
        
        try {
            // Criar aprovação (pendente)
            $aprovacao = new Aprovacao();
            $aprovacao->Data_Criacao = now();
            $aprovacao->Status_AprovacaoID_Status_Aprovacao = 1; // Status pendente
            $aprovacao->UtilizadorID_Admin = 1; // Usando o ID do admin padrão (ID=1) conforme necessário pela restrição NOT NULL
            $aprovacao->save();
            
            // Criar anúncio
            $anuncio = new Anuncio();
            $anuncio->Titulo = $request->Titulo;
            $anuncio->Descricao = $request->Descricao;
            $anuncio->Preco = $request->Preco;
            $anuncio->Data_Criacao = now();
            $anuncio->CategoriaID_Categoria = $request->CategoriaID_Categoria;
            $anuncio->TipoItemID_TipoItem = $request->TipoItemID_TipoItem;
            $anuncio->UtilizadorID_User = Auth::id();
            $anuncio->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $anuncio->Status_AnuncioID_Status_Anuncio = 1; // Status pendente
            $anuncio->save();
            
            // Processar imagens (se houver)
            if ($request->hasFile('imagens')) {
                $imagens = $request->file('imagens');
                
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
                    $itemImagem->Principal = ($key == 0) ? 1 : 0; // Primeira imagem é a principal
                    $itemImagem->save();
                }
            }
            
            DB::commit();
            
            // Carregar relações para retornar no response
            $anuncio->load(['categorium', 'tipo_item', 'item_imagems.imagem', 'utilizador', 'aprovacao']);
            
            return response()->json([
                'message' => 'Anúncio criado com sucesso e aguardando aprovação',
                'anuncio' => $anuncio
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao criar anúncio: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erro ao criar anúncio: ' . $e->getMessage()
            ], 500);
        }
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
        if ($anuncio->UtilizadorID_User != Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Você não tem permissão para atualizar este anúncio'], 403);
        }
        
        // Validar dados do anúncio
        $validator = Validator::make($request->all(), [
            'Titulo' => 'sometimes|required|string|max:100',
            'Descricao' => 'sometimes|required|string',
            'Preco' => 'sometimes|required|numeric|max:9999.99', // Máximo permitido pelo campo decimal(6,2)
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
            if ($anuncio->Status_AnuncioID_Status_Anuncio == 2) {
                $anuncio->Status_AnuncioID_Status_Anuncio = 1; // Status pendente
                
                // Atualizar aprovação
                $aprovacao = DB::table('aprovacao')->where('ID_aprovacao', $anuncio->AprovacaoID_aprovacao)->first();
                
                if ($aprovacao) {
                    DB::table('aprovacao')
                        ->where('ID_aprovacao', $anuncio->AprovacaoID_aprovacao)
                        ->update([
                            'Status_AprovacaoID_Status_Aprovacao' => 1, // Status pendente
                            'Data_Aprovacao' => null,
                            'Comentario' => null,
                            'UtilizadorID_Admin' => 1 // Usando o ID do admin padrão (ID=1)
                        ]);
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
        if ($anuncio->UtilizadorID_User != Auth::id() && !Auth::user()->isAdmin()) {
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
     * Obter todos os tipos de item disponíveis
     */
    public function getTiposItem()
    {
        try {
            $tipos = DB::table('tipo_item')->get();
            return response()->json($tipos);
        } catch (\Exception $e) {
            \Log::error('Erro ao obter tipos de item: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao obter tipos de item: ' . $e->getMessage()
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
                ->where('Status_AnuncioID_Status_Anuncio', 2); // Status aprovado
            
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
    
    /**
     * Obter anúncios do usuário logado
     */
    public function myAds(Request $request)
    {
        try {
            // Tentar obter o ID do usuário de várias formas para maior robustez
            $userId = null;
            
            // Tentar obter via Auth facade
            if (Auth::check()) {
                $userId = Auth::id();
                \Log::info('ID do usuário obtido via Auth::id(): ' . $userId);
            }
            
            // Se não conseguiu via Auth, tentar via session
            if (!$userId && session()->has('user_id')) {
                $userId = session('user_id');
                \Log::info('ID do usuário obtido via session: ' . $userId);
            }
            
            // Se ainda não conseguiu, tentar via request
            if (!$userId && $request->has('user_id')) {
                $userId = $request->input('user_id');
                \Log::info('ID do usuário obtido via request parameter: ' . $userId);
            }
            
            // Se não conseguiu de nenhuma forma, retornar erro
            if (!$userId) {
                \Log::warning('Tentativa de acessar meus-anuncios sem autenticação');
                return response()->json([
                    'message' => 'Usuário não autenticado',
                    'anuncios' => []
                ], 401);
            }
            
            try {
                // Tentar carregar com o relacionamento de aprovação
                $anuncios = Anuncio::with([
                    'categorium', 
                    'tipo_item', 
                    'item_imagems.imagem', 
                    'utilizador'
                ])
                ->where('UtilizadorID_User', $userId)
                ->orderBy('ID_Anuncio', 'desc')
                ->get();
                
                // Tentar carregar o relacionamento de aprovação separadamente para evitar erros
                foreach ($anuncios as $anuncio) {
                    try {
                        // Carregar o relacionamento de aprovação manualmente
                        $aprovacao = DB::table('aprovacao')
                            ->where('ID_aprovacao', $anuncio->AprovacaoID_aprovacao)
                            ->first();
                        
                        if ($aprovacao) {
                            // Adicionar manualmente ao objeto do anúncio
                            $anuncio->aprovacao = $aprovacao;
                        } else if ($anuncio->AprovacaoID_aprovacao) {
                            \Log::warning('Anúncio com ID ' . $anuncio->ID_Anuncio . ' tem AprovacaoID_aprovacao definido mas o registro não foi encontrado');
                        }
                    } catch (\Exception $approvalException) {
                        \Log::warning('Erro ao carregar aprovação para anúncio ' . $anuncio->ID_Anuncio . ': ' . $approvalException->getMessage());
                    }
                }
            } catch (\Exception $innerException) {
                // Se houver erro no carregamento dos anúncios, registrar e retornar array vazio
                \Log::error('Erro ao carregar anúncios: ' . $innerException->getMessage());
                
                return response()->json([
                    'message' => 'Erro ao carregar anúncios',
                    'anuncios' => []
                ], 500);
            }
        
            // Log para depuração
            \Log::info('Anúncios do usuário ' . $userId . ' carregados com sucesso:', ['count' => $anuncios->count()]);
            
            return response()->json($anuncios);
        } catch (\Exception $e) {
            \Log::error('Erro ao obter anúncios do usuário: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao obter anúncios: ' . $e->getMessage(),
                'anuncios' => []
            ], 500);
        }
    }
}
