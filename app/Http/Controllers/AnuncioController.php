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
        
        // Validar comentário de rejeição
        $validated = $request->validate([
            'comentario' => 'required|string'
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
                        'UtilizadorID_Admin' => $user->ID_User, // ID do admin que rejeitou
                        'Comentario' => $validated['comentario']
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
            ->where('Tipo_ItemID_Tipo', $tipoItemId)
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
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem', 'status_anuncio'])
            ->where('UtilizadorID_User', $userId)
            ->orderBy('ID_Anuncio', 'desc')
            ->get();
        
        return response()->json($anuncios);
    }
    
    /**
     * Criar um novo anúncio
     */
    public function store(Request $request)
    {
        try {
            \Log::info('Iniciando criação de anúncio');
            \Log::info('Dados recebidos: ' . json_encode($request->all()));
            
            // Tratar o preço antes da validação
            $preco = $request->input('Preco');
            \Log::info('Preço original: ' . $preco);
            
            if (is_string($preco)) {
                // Substituir vírgula por ponto se estiver no formato europeu
                $preco = str_replace(',', '.', $preco);
                
                // Verificar se é um número válido
                if (!is_numeric($preco)) {
                    \Log::error('Preço inválido: ' . $preco);
                    return response()->json([
                        'message' => 'O preço deve ser um número válido.'
                    ], 422);
                }
                
                // Garantir que o preço está no formato correto para decimal(6,2)
                // Limitar a 4 dígitos antes da vírgula e 2 depois
                $precoFloat = (float) $preco;
                if ($precoFloat > 9999.99) {
                    \Log::error('Preço excede o valor máximo: ' . $precoFloat);
                    return response()->json([
                        'message' => 'O preço máximo permitido é 9999.99.'
                    ], 422);
                }
                
                // Formatar para garantir exatamente 2 casas decimais, preservando zeros
                $preco = number_format($precoFloat, 2, '.', '');
                
                $request->merge(['Preco' => $preco]);
                \Log::info('Preço formatado: ' . $preco);
            }
        
            \Log::info('Preço recebido: ' . $request->input('Preco'));
            \Log::info('Preço após tratamento: ' . $preco);
            
            // Validar os dados do anúncio
            \Log::info('Iniciando validação dos dados');
            $validated = $request->validate([
                'Titulo' => 'required|string|max:255',
                'Descricao' => 'required|string',
                'Preco' => 'required|numeric|min:0',
                'Tipo_ItemID_Tipo' => 'required|exists:tipo_item,ID_Tipo',
                'CategoriaID_Categoria' => 'required|exists:categoria,ID_Categoria'
                // A validação de imagens será feita separadamente
            ]);
            \Log::info('Validação concluída com sucesso');
        
            // Obter o ID do usuário autenticado ou do formulário
            $userId = $request->input('UtilizadorID_User', Auth::id());
            \Log::info('ID do usuário para o anúncio: ' . $userId);
            
            // Verificar se o usuário existe
            \Log::info('Verificando se o usuário existe');
            $userExists = DB::table('utilizador')->where('ID_User', $userId)->exists();
            if (!$userExists) {
                \Log::error('Usuário não encontrado: ' . $userId);
                return response()->json([
                    'message' => 'Usuário não encontrado. Por favor, faça login novamente.'
                ], 404);
            }
            \Log::info('Usuário encontrado com sucesso');
            
            \Log::info('Iniciando transação no banco de dados');
            DB::beginTransaction();
            // Inserir diretamente na tabela de aprovação usando query builder
            \Log::info('Inserindo aprovação diretamente');
            $aprovacaoId = DB::table('aprovacao')->insertGetId([
                'Data_Submissao' => now(),
                'UtilizadorID_Admin' => 1, // Usando o ID do administrador padrão (ID=1)
                'Status_AprovacaoID_Status_Aprovacao' => 1, // Status pendente
                'Comentario' => ''
            ]);
            
            \Log::info('Aprovação criada com ID: ' . $aprovacaoId);
            
            // Inserir diretamente na tabela de anúncio usando query builder
            \Log::info('Inserindo anúncio diretamente');
            $anuncioId = DB::table('anuncio')->insertGetId([
                'Titulo' => $validated['Titulo'],
                'Descricao' => $validated['Descricao'],
                'Preco' => $validated['Preco'],
                'UtilizadorID_User' => $userId,
                'AprovacaoID_aprovacao' => $aprovacaoId,
                'Tipo_ItemID_Tipo' => $validated['Tipo_ItemID_Tipo'],
                'CategoriaID_Categoria' => $validated['CategoriaID_Categoria'],
                'Status_AnuncioID_Status_Anuncio' => 1 // Status pendente
            ]);
            
            \Log::info('Anúncio criado com ID: ' . $anuncioId);
            
            // Inicializar array de imagens vazio para o caso de não haver imagens
            $imagensArray = [];
            
            // Processar imagens se existirem
            if ($request->hasFile('imagens')) {
                \Log::info('Processando imagens');
                
                // Verificar se imagens é um array ou um único arquivo
                $imagens = $request->file('imagens');
                if (!is_array($imagens)) {
                    $imagens = [$imagens]; // Converter para array se for um único arquivo
                    \Log::info('Convertendo única imagem para array');
                }
                
                \Log::info('Total de imagens: ' . count($imagens));
                
                // Garantir que o diretório de armazenamento existe
                $storagePath = storage_path('app/public/anuncios');
                if (!file_exists($storagePath)) {
                    mkdir($storagePath, 0755, true);
                }
                
                foreach ($imagens as $index => $imagem) {
                    try {
                        // Validar a imagem
                        if ($imagem && $imagem->isValid()) {
                            \Log::info('Processando imagem ' . ($index + 1) . ': ' . $imagem->getClientOriginalName());
                            
                            // Gerar um nome único para a imagem
                            $nomeImagem = time() . '_' . $index . '_' . $imagem->getClientOriginalName();
                            $path = $imagem->storeAs('anuncios', $nomeImagem, 'public');
                            
                            \Log::info('Imagem salva em: ' . $path);
                            
                            // Primeiro criar um registro na tabela imagem
                            \Log::info('Criando registro na tabela imagem');
                            $imagemId = DB::table('imagem')->insertGetId([
                                'Caminho' => $path
                            ]);
                            
                            \Log::info('Imagem criada com ID: ' . $imagemId);
                            
                            // Agora associar a imagem ao anúncio na tabela item_imagem
                            \Log::info('Associando imagem ao anúncio na tabela item_imagem');
                            \Log::info('Dados para inserção: ItemID_Item=' . $anuncioId . ', ImagemID_Imagem=' . $imagemId);
                            
                            DB::table('item_imagem')->insert([
                                'ItemID_Item' => $anuncioId,
                                'ImagemID_Imagem' => $imagemId
                            ]);
                            
                            \Log::info('Registro de imagem associado ao anúncio com sucesso');
                        } else {
                            \Log::warning('Imagem inválida: ' . $imagem->getClientOriginalName());
                        }
                    } catch (\Exception $e) {
                        \Log::error('Erro ao processar imagem ' . ($index + 1) . ': ' . $e->getMessage());
                        \Log::error('Stack trace: ' . $e->getTraceAsString());
                        // Continuamos processando as outras imagens mesmo se uma falhar
                    }
                }
            } else {
                \Log::info('Nenhuma imagem enviada com o anúncio - isto é permitido');
                // Continuar sem imagens - o anúncio será criado sem imagens associadas
            }
            
            DB::commit();
            \Log::info('Transação confirmada com sucesso');
            
            // Buscar o anúncio completo para retornar na resposta
            $anuncioCompleto = DB::table('anuncio')->where('ID_Anuncio', $anuncioId)->first();
            
            return response()->json([
                'message' => 'Anúncio criado com sucesso!',
                'anuncio' => $anuncioCompleto
            ], 201);
        } catch (\Exception $e) {
            // Se houver uma transação ativa, faça o rollback
            if (DB::transactionLevel() > 0) {
                DB::rollBack();
                \Log::error('Rollback da transação realizado');
            }
            
            \Log::error('Erro ao criar anúncio: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Erro ao criar anúncio: ' . $e->getMessage(),
                'error_details' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    /**
     * Exibir detalhes de um anúncio
     */
    public function show($id)
    {
        $anuncio = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem', 'status_anuncio', 'aprovacao'])
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
            return response()->json(['message' => 'Você não tem permissão para editar este anúncio'], 403);
        }
        
        // Tratar o preço antes da validação
        $preco = $request->input('Preco');
        if (is_string($preco) && strpos($preco, ',') !== false) {
            $preco = str_replace(',', '.', $preco);
            $request->merge(['Preco' => $preco]);
        }
        
        // Validar os dados do anúncio
        $validated = $request->validate([
            'Titulo' => 'required|string|max:255',
            'Descricao' => 'required|string',
            'Preco' => 'required|numeric|min:0',
            'Tipo_ItemID_Tipo' => 'required|exists:tipo_item,ID_Tipo',
            'CategoriaID_Categoria' => 'required|exists:categoria,ID_Categoria'
            // A validação de imagens será feita separadamente
        ]);
        
        DB::beginTransaction();
        
        try {
            // Atualizar anúncio
            $anuncio->update([
                'Titulo' => $request->Titulo,
                'Descricao' => $request->Descricao,
                'Preco' => $request->Preco,
                'Tipo_ItemID_Tipo' => $request->Tipo_ItemID_Tipo,
                'CategoriaID_Categoria' => $request->CategoriaID_Categoria,
                'Status_AnuncioID_Status_Anuncio' => 1 // Voltar para pendente após edição
            ]);
            
            // Processar novas imagens se existirem
            if ($request->hasFile('imagens')) {
                // Garantir que o diretório de armazenamento existe
                $storagePath = storage_path('app/public/anuncios');
                if (!file_exists($storagePath)) {
                    mkdir($storagePath, 0755, true);
                }
                
                foreach ($request->file('imagens') as $index => $file) {
                    \Log::info('Processando imagem ' . ($index + 1) . ': ' . $file->getClientOriginalName());
                    
                    // Gerar um nome único para a imagem
                    $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('anuncios', $filename, 'public');
                    
                    // Criar imagem
                    $imagem = new Imagem([
                        'Caminho' => $path
                    ]);
                    $imagem->save();
                    
                    // Associar imagem ao anúncio - CORREÇÃO: nome da tabela em minúsculas
                    DB::table('item_imagem')->insert([
                        'ItemID_Item' => $anuncio->ID_Anuncio,
                        'ImagemID_Imagem' => $imagem->ID_Imagem
                    ]);
                }
            }
            
            DB::commit();
            
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
        }
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Erro ao remover anúncio: ' . $e->getMessage()
        ], 500);
    }
        
        DB::beginTransaction();
        
        try {
            // Atualizar aprovação
            $anuncio->aprovacao->update([
                'Data_Aprovacao' => now(),
                'UtilizadorID_Admin' => Auth::id(),
                'Status_AprovacaoID_Status_Aprovacao' => 2 // Status aprovado
            ]);
            
            // Atualizar status do anúncio
            $anuncio->update([
                'Status_AnuncioID_Status_Anuncio' => 2 // Status aprovado
            ]);
            
            DB::commit();
            
            return response()->json(['message' => 'Anúncio aprovado com sucesso']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao aprovar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // Removed duplicate method definition to resolve syntax error
    
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
        
        // Remover o anúncio
        $anuncio->delete();
        
        DB::commit();
        
        return response()->json(['message' => 'Anúncio removido com sucesso']);
        
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Erro ao remover anúncio: ' . $e->getMessage()
        ], 500);
        
    }
}

// Removed duplicate method definition to resolve syntax error

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
        $tiposItem = DB::table('tipo_item')->get();
        return response()->json($tiposItem);
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
