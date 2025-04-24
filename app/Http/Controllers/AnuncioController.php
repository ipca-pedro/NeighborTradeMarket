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

/**
 * @OA\Tag(
 *     name="Anúncios",
 *     description="API Endpoints para gerenciamento de anúncios"
 * )
 */
class AnuncioController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/anuncios",
     *     summary="Listar todos os anúncios aprovados",
     *     description="Retorna uma lista paginada de anúncios que foram aprovados e estão ativos",
     *     operationId="getAnuncios",
     *     tags={"Anúncios"},
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Número da página para paginação",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de anúncios recuperada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="current_page", type="integer", example=1),
     *             @OA\Property(property="data", type="array", 
     *                 @OA\Items(
     *                     @OA\Property(property="ID_Anuncio", type="integer", example=1),
     *                     @OA\Property(property="Titulo", type="string", example="Smartphone Xiaomi"),
     *                     @OA\Property(property="Descricao", type="string", example="Smartphone Xiaomi Redmi Note 10 128GB"),
     *                     @OA\Property(property="Preco", type="number", format="float", example=299.99)
     *                 )
     *             ),
     *             @OA\Property(property="first_page_url", type="string", example="http://localhost/api/anuncios?page=1"),
     *             @OA\Property(property="from", type="integer", example=1),
     *             @OA\Property(property="last_page", type="integer", example=5),
     *             @OA\Property(property="last_page_url", type="string", example="http://localhost/api/anuncios?page=5"),
     *             @OA\Property(property="per_page", type="integer", example=10),
     *             @OA\Property(property="total", type="integer", example=50)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao buscar anúncios")
     *         )
     *     )
     * )
     */
    public function index()
    {
        $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
            ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_ATIVO)
            ->where('Status_AnuncioID_Status_Anuncio', '!=', StatusAnuncio::STATUS_REJEITADO)
            ->orderBy('ID_Anuncio', 'desc')
            ->paginate(10);
        
        return response()->json($anuncios);
    }
    
    /**
     * @OA\Get(
     *     path="/api/anuncios/categoria/{categoriaId}",
     *     summary="Listar anúncios por categoria",
     *     description="Retorna todos os anúncios ativos de uma categoria específica",
     *     operationId="getAnunciosByCategoria",
     *     tags={"Anúncios"},
     *     @OA\Parameter(
     *         name="categoriaId",
     *         in="path",
     *         description="ID da categoria para filtrar os anúncios",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de anúncios da categoria recuperada com sucesso",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="ID_Anuncio", type="integer", example=1),
     *             @OA\Property(property="Titulo", type="string", example="Smartphone Xiaomi"),
     *             @OA\Property(property="Descricao", type="string", example="Smartphone Xiaomi Redmi Note 10 128GB"),
     *             @OA\Property(property="Preco", type="number", format="float", example=299.99)
     *         ))
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao buscar anúncios por categoria"),
     *             @OA\Property(property="anuncios", type="array", @OA\Items())
     *         )
     *     )
     * )
     */
    public function byCategoria($categoriaId)
    {
        try {
            \Log::info('Buscando anúncios por categoria', [
                'categoria_id' => $categoriaId
            ]);
            
            $anuncios = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
                ->where('CategoriaID_Categoria', $categoriaId)
                ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_ATIVO)
                ->orderBy('ID_Anuncio', 'desc')
                ->get();
            
            \Log::info('Anúncios encontrados por categoria', [
                'categoria_id' => $categoriaId,
                'quantidade' => $anuncios->count()
            ]);
            
            return response()->json($anuncios);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar anúncios por categoria:', [
                'categoria_id' => $categoriaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao buscar anúncios por categoria: ' . $e->getMessage(),
                'anuncios' => []
            ], 500);
        }
    }
    
    /**
     * @OA\Get(
     *     path="/api/admin/anuncios/pendentes",
     *     summary="Listar anúncios pendentes de aprovação",
     *     description="Retorna todos os anúncios que estão aguardando aprovação de um administrador",
     *     operationId="getAnunciosPendentes",
     *     tags={"Anúncios", "Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de anúncios pendentes recuperada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="ID_Anuncio", type="integer", example=1),
     *                 @OA\Property(property="Titulo", type="string", example="Smartphone Xiaomi"),
     *                 @OA\Property(property="Descricao", type="string", example="Smartphone Xiaomi Redmi Note 10 128GB"),
     *                 @OA\Property(property="Preco", type="number", format="float", example=299.99),
     *                 @OA\Property(property="utilizador", type="object"),
     *                 @OA\Property(property="categorium", type="object"),
     *                 @OA\Property(property="tipo_item", type="object"),
     *                 @OA\Property(property="item_imagems", type="array", @OA\Items())
     *             )),
     *             @OA\Property(property="message", type="string", example="Anúncios pendentes recuperados com sucesso")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Usuário não autenticado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Proibido - usuário não é administrador",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Acesso não autorizado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao buscar anúncios pendentes")
     *         )
     *     )
     * )
     */
    public function anunciosPendentes()
    {
        try {
            // Verificar se o utilizador está autenticado
            if (!Auth::check()) {
                return response()->json([
                    'message' => 'Usuário não autenticado'
                ], 401);
            }

            // Verificar se o utilizador é administrador
            if (Auth::user()->TipoUserID_TipoUser != 1) {
                return response()->json([
                    'message' => 'Acesso não autorizado'
                ], 403);
            }

            // Log para debug
            \Log::info('Buscando anúncios pendentes', [
                'status_pendente' => StatusAnuncio::STATUS_PENDENTE,
                'user_id' => Auth::id(),
                'user_type' => Auth::user()->TipoUserID_TipoUser
            ]);
            
            $anunciosPendentes = Anuncio::with([
                'utilizador:ID_User,User_Name,Name,Email',
                'categorium:ID_Categoria,Descricao_Categoria',
                'tipo_item:ID_Tipo,Descricao_TipoItem',
                'item_imagems.imagem',
                'aprovacao',
                'status_anuncio:ID_Status_Anuncio,Descricao_status_anuncio'
            ])
            ->where('Status_AnuncioID_Status_Anuncio', '=', StatusAnuncio::STATUS_PENDENTE)
            ->orderBy('ID_Anuncio', 'desc')
            ->get(); // Mudado de paginate para get para debug

            // Log do resultado
            \Log::info('Anúncios pendentes encontrados', [
                'count' => $anunciosPendentes->count(),
                'anuncios' => $anunciosPendentes->toArray()
            ]);
            
            return response()->json([
                'data' => $anunciosPendentes,
                'message' => 'Anúncios pendentes recuperados com sucesso'
            ]);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar anúncios pendentes:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao buscar anúncios pendentes: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * @OA\Post(
     *     path="/api/admin/anuncios/{id}/aprovar",
     *     summary="Aprovar um anúncio",
     *     description="Aprova um anúncio pendente, tornando-o visível para os usuários",
     *     operationId="aprovarAnuncio",
     *     tags={"Anúncios", "Admin"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID do anúncio a ser aprovado",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Anúncio aprovado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Anúncio aprovado com sucesso"),
     *             @OA\Property(property="anuncio", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Requisição inválida - anúncio já processado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Este anúncio já foi processado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Usuário não autenticado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Proibido - usuário não é administrador",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Acesso não autorizado - Tipo de usuário inválido")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Anúncio não encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="O recurso solicitado não foi encontrado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao aprovar anúncio")
     *         )
     *     )
     * )
     */
    public function aprovarAnuncio($id)
    {
        try {
            // Log do usuário atual
            \Log::info('Tentativa de aprovação de anúncio', [
                'anuncio_id' => $id,
                'user' => Auth::user(),
                'user_id' => Auth::id(),
                'is_authenticated' => Auth::check(),
                'user_type' => Auth::user() ? Auth::user()->TipoUserID_TipoUser : null
            ]);

            // Verificar se o Utilizador está autenticado
            if (!Auth::check()) {
                return response()->json([
                    'message' => 'Usuário não autenticado'
                ], 401);
            }

            // Verificar se o utilizador é administrador
            if (Auth::user()->TipoUserID_TipoUser != 1) {
                return response()->json([
                    'message' => 'Acesso não autorizado - Tipo de usuário inválido'
                ], 403);
            }
            
            DB::beginTransaction();
            
            $anuncio = Anuncio::findOrFail($id);
            
            // Log do anúncio encontrado
            \Log::info('Anúncio encontrado', [
                'anuncio' => $anuncio,
                'status_atual' => $anuncio->Status_AnuncioID_Status_Anuncio
            ]);
            
            // Verificar se o anúncio já foi processado
            if ($anuncio->Status_AnuncioID_Status_Anuncio != StatusAnuncio::STATUS_PENDENTE) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Este anúncio já foi processado'
                ], 400);
            }
            
            // Atualizar status do anúncio
            $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_ATIVO;
            $anuncio->save();
            
            // Atualizar status da aprovação
            $aprovacao = Aprovacao::find($anuncio->AprovacaoID_aprovacao);
            
            if ($aprovacao) {
                // Usar ID_User em vez de email
                $adminId = Auth::user()->ID_User;
                
                \Log::info('Atualizando aprovação', [
                    'admin_id' => $adminId,
                    'aprovacao_id' => $aprovacao->ID_aprovacao
                ]);
                
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 2; // Status aprovado
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->UtilizadorID_Admin = $adminId; // Usar o ID do administrador
                $aprovacao->save();

                // Log da aprovação
                \Log::info('Aprovação atualizada', [
                    'aprovacao' => $aprovacao
                ]);
            } else {
                \Log::warning('Aprovação não encontrada para o anúncio', [
                    'anuncio_id' => $id,
                    'aprovacao_id' => $anuncio->AprovacaoID_aprovacao
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Anúncio aprovado com sucesso!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao aprovar anúncio:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'anuncio_id' => $id
            ]);
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
        if (!Auth::check() || Auth::user()->TipoUserID_TipoUser !== 1) { // Assumindo que ID 1 é para administradores
            return response()->json([
                'message' => 'Acesso não autorizado - Apenas administradores podem rejeitar anúncios'
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
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 3; // Status rejeitado
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->UtilizadorID_Admin = Auth::id(); // Usando o ID do usuário autenticado
                $aprovacao->motivo_rejeicao = $request->motivo;
                $aprovacao->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Anúncio rejeitado com sucesso'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao rejeitar anúncio:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
                'user_type' => Auth::user()->TipoUserID_TipoUser,
                'anuncio_id' => $id
            ]);
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
        try {
            if (!Auth::check()) {
                return response()->json([
                    'message' => 'Você precisa estar logado para ver seus anúncios'
                ], 401);
            }

            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Usuário autenticado não encontrado.'], 401);
            }
            $userId = $user->getKey();
            \Log::info('Fetching ads for user:', ['user_id' => $userId, 'auth_check' => Auth::check()]);

            $anuncios = Anuncio::with([
                'utilizador', 
                'categorium', 
                'tipo_item', 
                'item_imagems.imagem', 
                'aprovacao',
                'status_anuncio'
            ])
            ->where('UtilizadorID_User', $userId)
            ->orderBy('ID_Anuncio', 'desc')
            ->get();

            \Log::info('Found ads for user:', ['user_id' => $userId, 'count' => $anuncios->count()]);

            return response()->json($anuncios);

        } catch (\Exception $e) {
            \Log::error('Erro ao buscar meus anúncios:', [
                'user_id' => Auth::check() ? Auth::user()->getKey() : 'N/A',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Erro ao buscar seus anúncios: ' . $e->getMessage()
            ], 500);
        }
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
            'UtilizadorID_User' => 'required|integer|exists:utilizador,ID_User',
            'imagens' => 'nullable|array',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120'
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
            $aprovacao->Data_Submissao = now();
            $aprovacao->Status_AprovacaoID_Status_Aprovacao = 1;
            $aprovacao->UtilizadorID_Admin = 1;
            $aprovacao->save();

            // Criar anúncio
            $anuncio = new Anuncio();
            $anuncio->Titulo = $request->Titulo;
            $anuncio->Descricao = $request->Descricao;
            $anuncio->Preco = $request->Preco;
            $anuncio->CategoriaID_Categoria = $request->CategoriaID_Categoria;
            $anuncio->Tipo_ItemID_Tipo = $request->Tipo_ItemID_Tipo;
            
            // Usar o ID do usuário enviado pelo frontend
            $userId = $request->input('UtilizadorID_User');
            
            // Validar se o ID do usuário é válido
            if (!$userId || !is_numeric($userId)) {
                throw new \Exception('ID do usuário inválido');
            }
            
            $anuncio->UtilizadorID_User = $userId;
            $anuncio->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_PENDENTE; // Pendente
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
                        
                        // Criar relação na tabela Item_Imagem
                        DB::table('item_imagem')->insert([
                            'ItemID_Item' => $anuncio->ID_Anuncio,
                            'ImagemID_Imagem' => $imagem->ID_Imagem
                        ]);
                        
                        \Log::info('Imagem salva com sucesso:', [
                            'anuncio_id' => $anuncio->ID_Anuncio,
                            'imagem_id' => $imagem->ID_Imagem,
                            'path' => $imagemPath
                        ]);
                    } catch (\Exception $e) {
                        \Log::error('Erro ao salvar imagem:', [
                            'error' => $e->getMessage(),
                            'anuncio_id' => $anuncio->ID_Anuncio,
                            'file' => $imagemFile->getClientOriginalName()
                        ]);
                        throw $e;
                    }
                }
            }

            DB::commit();

            // Carregar o anúncio com todas as relações
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
            \Log::error('Erro ao criar anúncio:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
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
            ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_ATIVO)
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
            ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_ATIVO)
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
        $anuncio = Anuncio::with([
            'utilizador.morada',
            'categorium',
            'tipo_item',
            'item_imagems.imagem',
            'aprovacao',
            'status_anuncio'
        ])->find($id);
        
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
            if ($anuncio->Status_AnuncioID_Status_Anuncio == StatusAnuncio::STATUS_ATIVO) {
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
        // Verificar se o usuário está autenticado e é admin
        if (!Auth::check() || Auth::user()->TipoUserID_TipoUser !== 1) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }

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
            if ($anuncio->aprovacao) {
                $anuncio->aprovacao->Data_Aprovacao = now();
                $anuncio->aprovacao->Comentario = $request->Comentario;
                $anuncio->aprovacao->UtilizadorID_Admin = Auth::id(); // Usando Auth::id() para obter o ID do usuário
                $anuncio->aprovacao->Status_AprovacaoID_Status_Aprovacao = 3; // Status rejeitado
                $anuncio->aprovacao->save();
            }
            
            // Atualizar status do anúncio
            $anuncio->Status_AnuncioID_Status_Anuncio = 3; // Status rejeitado
            $anuncio->save();
            
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
                ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_ATIVO)
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
            \Log::error('Erro ao obter anúncios aleatórios:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Erro ao obter anúncios aleatórios: ' . $e->getMessage(),
                'anuncios' => []
            ], 500);
        }
    }
    
    /**
     * Atualizar a imagem principal de um anúncio
     */
    public function updatePrincipalImage(Request $request, $anuncioId, $imagemId)
    {
        try {
            DB::beginTransaction();

            // Verificar se o anúncio pertence ao usuário
            $anuncio = Anuncio::findOrFail($anuncioId);
            if ($anuncio->UtilizadorID_User != Auth::id()) {
                return response()->json(['message' => 'Não autorizado'], 403);
            }

            // Verificar se a imagem pertence ao anúncio
            $imagemExists = DB::table('item_imagem')
                ->where('ItemID_Item', $anuncioId)
                ->where('ImagemID_Imagem', $imagemId)
                ->exists();

            if (!$imagemExists) {
                return response()->json(['message' => 'Imagem não encontrada neste anúncio'], 404);
            }

            // Atualizar a imagem principal
            DB::table('item_imagem')
                ->where('ItemID_Item', $anuncioId)
                ->where('ImagemID_Imagem', $imagemId)
                ->update(['Principal' => 1]);

            DB::commit();

            return response()->json(['message' => 'Imagem principal atualizada com sucesso']);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao atualizar imagem principal:', [
                'error' => $e->getMessage(),
                'anuncio_id' => $anuncioId,
                'imagem_id' => $imagemId
            ]);
            return response()->json(['message' => 'Erro ao atualizar imagem principal'], 500);
        }
    }

    /**
     * Obter anúncios públicos sem autenticação
     * Aceita parâmetros de filtro via query string
     */
    public function getAnunciosPublicos(Request $request)
    {
        try {
            \Log::info('Buscando anúncios públicos', [
                'filtros' => $request->all()
            ]);
            
            // Verificar as constantes de status para debug
            \Log::info('Status disponíveis:', [
                'STATUS_PENDENTE' => StatusAnuncio::STATUS_PENDENTE,
                'STATUS_ATIVO' => StatusAnuncio::STATUS_ATIVO,
                'STATUS_REJEITADO' => StatusAnuncio::STATUS_REJEITADO
            ]);
            
            $query = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem'])
                ->where('Status_AnuncioID_Status_Anuncio', StatusAnuncio::STATUS_ATIVO)
                ->orderBy('ID_Anuncio', 'desc');
            
            // Filtrar por categoria se especificado
            if ($request->has('categoria')) {
                $categoriaId = $request->categoria;
                \Log::info('Filtrando por categoria', ['categoria_id' => $categoriaId]);
                
                $query->where('CategoriaID_Categoria', $categoriaId);
            }

            // Filtrar por termo de pesquisa se especificado
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('Titulo', 'LIKE', "%{$search}%")
                      ->orWhere('Descricao', 'LIKE', "%{$search}%");
                });
            }
            
            // Mostrar todos os anúncios disponíveis para debug
            $allAnuncios = Anuncio::select('ID_Anuncio', 'Titulo', 'Status_AnuncioID_Status_Anuncio', 'CategoriaID_Categoria')->limit(10)->get();
            \Log::info('Amostra de anúncios na BD:', ['anuncios' => $allAnuncios]);
            
            $anuncios = $query->get();
            
            \Log::info('Anúncios encontrados:', [
                'count' => $anuncios->count(),
                'query' => $query->toSql(),
                'bindings' => $query->getBindings()
            ]);
            
            return response()->json($anuncios);
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar anúncios públicos:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao buscar anúncios: ' . $e->getMessage()
            ], 500);
        }
    }
}
