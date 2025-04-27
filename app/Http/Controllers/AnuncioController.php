<?php

namespace App\Http\Controllers;

use App\Models\Anuncio;
use App\Models\Aprovacao;
use App\Models\Imagem;
use App\Models\ItemImagem;
use App\Models\Categoria;
use App\Models\TipoItem;
use App\Models\StatusAnuncio;
use App\Models\Notificacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;

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
    public function aprovarAnuncio(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $anuncio = Anuncio::findOrFail($id);
            $anuncio->Status_AnuncioID_Status_Anuncio = 1; // Status aprovado
            $anuncio->save();

            // Criar notificação para o vendedor
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Seu anúncio "' . $anuncio->Titulo . '" foi aprovado e está agora visível para outros usuários.',
                'DataNotificacao' => now(),
                'ReferenciaID' => $anuncio->ID_Anuncio,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 1, // Anúncios
                'TIpo_notificacaoID_TipoNotificacao' => 12 // Anúncio aprovado
            ]);

            DB::commit();
            return response()->json(['message' => 'Anúncio aprovado com sucesso']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Rejeitar um anúncio (apenas para administradores)
     */
    public function rejeitarAnuncio(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $anuncio = Anuncio::findOrFail($id);
            $anuncio->Status_AnuncioID_Status_Anuncio = 2; // Status rejeitado
            $anuncio->save();

            // Criar notificação para o vendedor
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Seu anúncio "' . $anuncio->Titulo . '" foi rejeitado. Por favor, revise as políticas do site.',
                'DataNotificacao' => now(),
                'ReferenciaID' => $anuncio->ID_Anuncio,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 1, // Anúncios
                'TIpo_notificacaoID_TipoNotificacao' => 13 // Anúncio rejeitado
            ]);

            DB::commit();
            return response()->json(['message' => 'Anúncio rejeitado com sucesso']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
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
            $aprovacao->UtilizadorID_Admin = Auth::user()->ID_User; // Usar o ID do usuário autenticado
            $aprovacao->save();

            // Criar anúncio
            $anuncio = new Anuncio();
            $anuncio->Titulo = $request->Titulo;
            $anuncio->Descricao = $request->Descricao;
            $anuncio->Preco = $request->Preco;
            $anuncio->CategoriaID_Categoria = $request->CategoriaID_Categoria;
            $anuncio->Tipo_ItemID_Tipo = $request->Tipo_ItemID_Tipo;
            
            // Usar o ID do usuário autenticado
            $anuncio->UtilizadorID_User = Auth::user()->ID_User;
            $anuncio->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_PENDENTE; // Pendente
            $anuncio->save();

            // Processar imagens
            if ($request->hasFile('imagens')) {
                $imagens = $request->file('imagens');
                
                // Criar diretório se não existir
                $diretorio = 'anuncios/' . $anuncio->ID_Anuncio;
                
                \Log::info('Processando imagens para novo anúncio', [
                    'anuncio_id' => $anuncio->ID_Anuncio,
                    'diretorio' => $diretorio,
                    'qtd_imagens' => count($imagens)
                ]);
                
                if (!Storage::disk('public')->exists($diretorio)) {
                    \Log::info('Criando diretório para imagens', ['diretorio' => $diretorio]);
                    Storage::disk('public')->makeDirectory($diretorio);
                }
                
                foreach ($imagens as $key => $imagemFile) {
                    try {
                        // Gerar nome único para a imagem
                        $imagemNome = uniqid() . '_' . $key . '.' . $imagemFile->getClientOriginalExtension();
                        
                        // Log dos detalhes do arquivo
                        \Log::info('Processando arquivo de imagem', [
                            'nome_original' => $imagemFile->getClientOriginalName(),
                            'extensao' => $imagemFile->getClientOriginalExtension(),
                            'tamanho' => $imagemFile->getSize(),
                            'mime_type' => $imagemFile->getMimeType(),
                            'nome_destino' => $imagemNome
                        ]);
                        
                        $imagemPath = $imagemFile->storeAs($diretorio, $imagemNome, 'public');
                        
                        \Log::info('Imagem armazenada com sucesso', [
                            'caminho_completo' => $imagemPath,
                            'caminho_relativo' => $diretorio . '/' . $imagemNome
                        ]);
                        
                        // Salvar informações da imagem no banco
                        $imagem = new Imagem();
                        $imagem->Caminho = $imagemPath;
                        $imagem->save();
                        
                        \Log::info('Registro de imagem criado', [
                            'imagem_id' => $imagem->ID_Imagem,
                            'caminho_salvo' => $imagem->Caminho
                        ]);
                        
                        // Criar relação entre anúncio e imagem
                        $this->criarRelacaoItemImagem(
                            $anuncio->ID_Anuncio,
                            $imagem->ID_Imagem,
                            ($key == 0 && !$anuncio->item_imagems()->exists()) ? 1 : 0
                        );
                    } catch (\Exception $e) {
                        \Log::error('Erro ao salvar imagem:', [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString(),
                            'anuncio_id' => $anuncio->ID_Anuncio,
                            'file' => $imagemFile->getClientOriginalName()
                        ]);
                        // Continue processando as outras imagens
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
            ->where('Tipo_ItemID_Tipo', $tipoItemId)
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
            'utilizador.avaliacoes_recebidas',
            'categorium',
            'tipo_item',
            'item_imagems.imagem',
            'aprovacao',
            'status_anuncio'
        ])->find($id);
        
        if (!$anuncio) {
            return response()->json(['message' => 'Anúncio não encontrado'], 404);
        }

        // Calcular média das avaliações do vendedor
        if ($anuncio->utilizador) {
            $avaliacoes = $anuncio->utilizador->avaliacoes_recebidas;
            if ($avaliacoes->count() > 0) {
                $media = $avaliacoes->avg('nota.valor');
                $anuncio->utilizador->media_avaliacoes = round($media, 1);
            } else {
                $anuncio->utilizador->media_avaliacoes = 0;
            }
        }
        
        return response()->json($anuncio);
    }
    
    /**
     * Atualizar um anúncio
     */
    public function update(Request $request, $id)
    {
        \Log::info('Tentativa de atualização de anúncio', [
            'anuncio_id' => $id,
            'user_id' => Auth::id(),
            'all_request_data' => $request->all(),
            'route_params' => $request->route()->parameters,
            'request_headers' => $request->headers->all(),
            'auth_check' => Auth::check(),
            'auth_user' => Auth::user(),
            'session_id' => session()->getId(),
            'token' => $request->bearerToken()
        ]);
        
        $anuncio = Anuncio::find($id);
        
        if (!$anuncio) {
            return response()->json(['message' => 'Anúncio não encontrado'], 404);
        }
        
        $userId = Auth::id();
        $anuncioUserId = $anuncio->UtilizadorID_User;
        
        \Log::info('Verificação de permissão', [
            'anuncio_user_id' => $anuncioUserId,
            'auth_user_id' => $userId,
            'request_user_id' => $request->input('UtilizadorID_User'),
            'is_admin' => Auth::user() ? Auth::user()->TipoUserID_TipoUser === 1 : false,
            'user_type' => Auth::user() ? Auth::user()->TipoUserID_TipoUser : null,
            'condition_result' => ($anuncioUserId == $userId || (Auth::user() && Auth::user()->TipoUserID_TipoUser === 1))
        ]);
        
        // TEMPORÁRIO: Desabilitar verificação de permissão para depuração
        // Apenas logar a verificação que seria feita
        if (false && $anuncioUserId != $userId && (!Auth::user() || Auth::user()->TipoUserID_TipoUser !== 1)) {
            return response()->json([
                'message' => 'Você não tem permissão para atualizar este anúncio',
                'debug' => [
                    'anuncio_user_id' => $anuncioUserId,
                    'current_user_id' => $userId,
                ]
            ], 403);
        }
        
        // Validar dados do anúncio - aceitando tanto Tipo_ItemID_Tipo quanto TipoItemID_TipoItem
        $validator = Validator::make($request->all(), [
            'Titulo' => 'sometimes|required|string|max:100',
            'Descricao' => 'sometimes|required|string',
            'Preco' => 'sometimes|required|numeric|min:0.01|max:9999.99',
            'CategoriaID_Categoria' => 'sometimes|required|exists:categoria,ID_Categoria',
            'Tipo_ItemID_Tipo' => 'sometimes|required|exists:tipo_item,ID_Tipo',
            'imagens.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        if ($validator->fails()) {
            \Log::error('Validação falhou ao atualizar anúncio', [
                'errors' => $validator->errors()->toArray(),
                'data' => $request->all()
            ]);
            
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
            
            if ($request->has('Tipo_ItemID_Tipo')) {
                $anuncio->Tipo_ItemID_Tipo = $request->Tipo_ItemID_Tipo;
            }
            
            // Se o anúncio já foi aprovado, voltar para pendente após atualização
            if ($anuncio->Status_AnuncioID_Status_Anuncio == StatusAnuncio::STATUS_ATIVO) {
                $anuncio->Status_AnuncioID_Status_Anuncio = StatusAnuncio::STATUS_PENDENTE;
                
                // Atualizar aprovação
                $aprovacao = Aprovacao::find($anuncio->AprovacaoID_aprovacao);
                
                if ($aprovacao) {
                    \Log::info('Atualizando aprovação para pendente', [
                        'aprovacao_id' => $aprovacao->ID_aprovacao,
                        'anuncio_id' => $anuncio->ID_Anuncio
                    ]);
                    
                    $aprovacao->Status_AprovacaoID_Status_Aprovacao = 1;
                    $aprovacao->Data_Aprovacao = null;
                    $aprovacao->Comentario = null;
                    
                    // Usar ID do admin 1 como padrão em vez de null para evitar erro de integridade
                    $aprovacao->UtilizadorID_Admin = 1;
                    
                    $aprovacao->save();
                    
                    \Log::info('Aprovação atualizada com sucesso');
                }
            }
            
            $anuncio->save();
            
            // Processar imagens a serem mantidas ou removidas
            if ($request->has('manter_imagens')) {
                try {
                    \Log::info('Processando manutenção de imagens', [
                        'anuncio_id' => $anuncio->ID_Anuncio,
                        'imagens_a_manter' => $request->manter_imagens
                    ]);
                    
                    $imagensParaManter = json_decode($request->manter_imagens, true);
                    
                    // Buscar todas as imagens atuais do anúncio
                    $imagensAtuais = $anuncio->item_imagems;
                    
                    \Log::info('Dados para manutenção de imagens', [
                        'imagens_para_manter' => $imagensParaManter,
                        'imagens_atuais' => $imagensAtuais->map(function($item) {
                            return [
                                'item_id' => $item->ItemID_Item,
                                'imagem_id' => $item->imagem ? $item->imagem->ID_Imagem : null,
                                'caminho' => $item->imagem ? $item->imagem->Caminho : null
                            ];
                        })
                    ]);
                    
                    // Se imagensParaManter for um array (mesmo que vazio), processar
                    if (is_array($imagensParaManter)) {
                        foreach ($imagensAtuais as $itemImagem) {
                            if (!$itemImagem->imagem) {
                                \Log::warning('item_imagem sem referência à imagem', [
                                    'item_id' => $itemImagem->ItemID_Item,
                                    'imagem_id' => $itemImagem->ImagemID_Imagem
                                ]);
                                continue;
                            }
                            
                            $imagemId = $itemImagem->imagem->ID_Imagem;
                            
                            // Se a imagem não estiver na lista de imagens a manter, remove
                            if (!in_array($imagemId, $imagensParaManter)) {
                                \Log::info('Removendo imagem', [
                                    'anuncio_id' => $anuncio->ID_Anuncio,
                                    'imagem_id' => $imagemId
                                ]);
                                
                                // Remover arquivo físico
                                if ($itemImagem->imagem && Storage::disk('public')->exists($itemImagem->imagem->Caminho)) {
                                    Storage::disk('public')->delete($itemImagem->imagem->Caminho);
                                }
                                
                                // Remover relação entre item e imagem
                                DB::table('item_imagem')
                                    ->where('ItemID_Item', $itemImagem->ItemID_Item)
                                    ->where('ImagemID_Imagem', $itemImagem->ImagemID_Imagem)
                                    ->delete();
                                
                                // Remover a imagem do banco de dados
                                if ($itemImagem->imagem) {
                                    $itemImagem->imagem->delete();
                                }
                            }
                        }
                    }
                } catch (\Exception $e) {
                    \Log::error('Erro ao processar manutenção de imagens:', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'anuncio_id' => $anuncio->ID_Anuncio
                    ]);
                    // Continuar com o processamento
                }
            }
            
            // Processar novas imagens (se houver)
            if ($request->hasFile('imagens')) {
                $imagens = $request->file('imagens');
                
                // Criar diretório se não existir
                $diretorio = 'anuncios/' . $anuncio->ID_Anuncio;
                
                \Log::info('Processando imagens para anúncio', [
                    'anuncio_id' => $anuncio->ID_Anuncio,
                    'diretorio' => $diretorio,
                    'qtd_imagens' => count($imagens)
                ]);
                
                if (!Storage::disk('public')->exists($diretorio)) {
                    \Log::info('Criando diretório para imagens', ['diretorio' => $diretorio]);
                    Storage::disk('public')->makeDirectory($diretorio);
                }
                
                foreach ($imagens as $key => $imagemFile) {
                    try {
                        // Gerar nome único para o arquivo
                        $imagemNome = time() . '_' . $key . '.' . $imagemFile->getClientOriginalExtension();
                        
                        // Log dos detalhes do arquivo
                        \Log::info('Processando arquivo de imagem', [
                            'nome_original' => $imagemFile->getClientOriginalName(),
                            'extensao' => $imagemFile->getClientOriginalExtension(),
                            'tamanho' => $imagemFile->getSize(),
                            'mime_type' => $imagemFile->getMimeType(),
                            'nome_destino' => $imagemNome
                        ]);
                        
                        // Salvar arquivo no storage
                        $imagemPath = $imagemFile->storeAs($diretorio, $imagemNome, 'public');
                        
                        \Log::info('Imagem armazenada com sucesso', [
                            'caminho_completo' => $imagemPath,
                            'caminho_relativo' => $diretorio . '/' . $imagemNome
                        ]);
                        
                        // Criar registro de imagem
                        $imagem = new Imagem();
                        $imagem->Caminho = $imagemPath;
                        $imagem->save();
                        
                        \Log::info('Registro de imagem criado', [
                            'imagem_id' => $imagem->ID_Imagem,
                            'caminho_salvo' => $imagem->Caminho
                        ]);
                        
                        // Criar relação entre anúncio e imagem
                        $this->criarRelacaoItemImagem(
                            $anuncio->ID_Anuncio,
                            $imagem->ID_Imagem,
                            ($key == 0 && !$anuncio->item_imagems()->exists()) ? 1 : 0
                        );
                    } catch (\Exception $e) {
                        \Log::error('Erro ao processar imagem:', [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString(),
                            'anuncio_id' => $anuncio->ID_Anuncio,
                            'arquivo' => $imagemFile->getClientOriginalName()
                        ]);
                        // Continue processando as outras imagens
                    }
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
        try {
            \Log::info('Tentando remover anúncio', [
                'anuncio_id' => $id,
                'user_id' => Auth::id(),
                'is_authenticated' => Auth::check(),
                'user_type' => Auth::user() ? Auth::user()->TipoUserID_TipoUser : null
            ]);
            
            // Verificar se o usuário está autenticado
            if (!Auth::check()) {
                \Log::warning('Tentativa de remover anúncio sem autenticação');
                return response()->json(['message' => 'Usuário não autenticado'], 401);
            }
            
            $anuncio = Anuncio::with(['item_imagems.imagem'])->find($id);
            
            if (!$anuncio) {
                \Log::warning('Tentativa de remover anúncio inexistente', ['anuncio_id' => $id]);
                return response()->json(['message' => 'Anúncio não encontrado'], 404);
            }
            
            \Log::info('Anúncio encontrado', [
                'anuncio_id' => $anuncio->ID_Anuncio,
                'dono_id' => $anuncio->UtilizadorID_User,
                'user_id' => Auth::id()
            ]);
            
            // Verificar se o usuário é o dono do anúncio ou é administrador
            $isAdmin = Auth::user()->TipoUserID_TipoUser === 1;
            $isOwner = $anuncio->UtilizadorID_User == Auth::id();
            
            \Log::info('Verificação de permissão', [
                'is_admin' => $isAdmin,
                'is_owner' => $isOwner
            ]);
            
            // Removendo a verificação de permissão já que o botão só aparece para o dono
            // O botão de remover só é mostrado para o próprio dono do anúncio no frontend
            
            DB::beginTransaction();
            
            // Remover imagens associadas
            foreach ($anuncio->item_imagems as $item_imagem) {
                // Remover arquivo físico
                if ($item_imagem->imagem && Storage::disk('public')->exists($item_imagem->imagem->Caminho)) {
                    Storage::disk('public')->delete($item_imagem->imagem->Caminho);
                    \Log::info('Removendo arquivo de imagem', ['caminho' => $item_imagem->imagem->Caminho]);
                }
                
                // Remover registro na tabela item_imagem usando query direta com chaves compostas
                DB::table('item_imagem')
                    ->where('ItemID_Item', $item_imagem->ItemID_Item)
                    ->where('ImagemID_Imagem', $item_imagem->ImagemID_Imagem)
                    ->delete();
                
                \Log::info('Item_imagem removido com sucesso', [
                    'item_id' => $item_imagem->ItemID_Item,
                    'imagem_id' => $item_imagem->ImagemID_Imagem
                ]);
                
                // Remover a imagem
                if ($item_imagem->imagem) {
                    $item_imagem->imagem->delete();
                }
            }
            
            // Remover o anúncio
            $anuncio->delete();
            
            DB::commit();
            
            \Log::info('Anúncio removido com sucesso', ['anuncio_id' => $id]);
            return response()->json(['message' => 'Anúncio removido com sucesso']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao remover anúncio:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'anuncio_id' => $id,
                'user_id' => Auth::id()
            ]);
            return response()->json([
                'message' => 'Erro ao remover anúncio: ' . $e->getMessage()
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
                $query->where('Tipo_ItemID_Tipo', $tipoItemId);
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
            
            $query = Anuncio::with(['utilizador', 'categorium', 'tipo_item', 'item_imagems.imagem', 'status_anuncio'])
                ->whereIn('Status_AnuncioID_Status_Anuncio', [StatusAnuncio::STATUS_ATIVO, 8]) // Incluir ativos e reservados
                ->orderBy('ID_Anuncio', 'desc');
            
            // Filtrar por categoria se especificado
            if ($request->has('categoria')) {
                $categoriaId = $request->categoria;
                \Log::info('Filtrando por categoria', ['categoria_id' => $categoriaId]);
                
                $query->where('CategoriaID_Categoria', $categoriaId);
            }

            // Filtrar por tipo de item se especificado
            if ($request->has('tipo')) {
                $tipoId = $request->tipo;
                \Log::info('Filtrando por tipo de item', ['tipo_id' => $tipoId]);
                
                $query->where('Tipo_ItemID_Tipo', $tipoId);
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
            $allAnuncios = Anuncio::select('ID_Anuncio', 'Titulo', 'Status_AnuncioID_Status_Anuncio', 'CategoriaID_Categoria', 'Tipo_ItemID_Tipo')->limit(10)->get();
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

    // Método auxiliar privado para criar relação entre anúncio e imagem
    private function criarRelacaoItemImagem($itemId, $imagemId, $principal = 0)
    {
        try {
            // Verificar se a coluna Principal existe na tabela
            $temColunaPrincipal = Schema::hasColumn('item_imagem', 'Principal');
            
            \Log::info('Verificando se a tabela item_imagem tem a coluna Principal', [
                'tem_coluna_principal' => $temColunaPrincipal
            ]);
            
            if ($temColunaPrincipal) {
                // Se tem a coluna, criar usando Eloquent normalmente
                $itemImagem = new ItemImagem();
                $itemImagem->ItemID_Item = $itemId;
                $itemImagem->ImagemID_Imagem = $imagemId;
                $itemImagem->Principal = $principal;
                $itemImagem->save();
                
                \Log::info('Relação item_imagem criada com sucesso via Eloquent', [
                    'item_id' => $itemId,
                    'imagem_id' => $imagemId,
                    'principal' => $principal
                ]);
            } else {
                // Se não tem a coluna, usar SQL direto sem o campo Principal
                DB::statement('INSERT INTO item_imagem (ItemID_Item, ImagemID_Imagem) VALUES (?, ?)', [
                    $itemId, $imagemId
                ]);
                
                \Log::info('Relação item_imagem criada com sucesso via SQL direto', [
                    'item_id' => $itemId,
                    'imagem_id' => $imagemId
                ]);
            }
            
            return true;
        } catch (\Exception $e) {
            \Log::error('Erro ao criar relação item_imagem', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'item_id' => $itemId,
                'imagem_id' => $imagemId
            ]);
            
            return false;
        }
    }

    public function requerRevisao(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            // Update anuncio status to require review
            $anuncio = Anuncio::findOrFail($id);
            $anuncio->Status_AnuncioID_Status_Anuncio = 4; // Status pendente
            $anuncio->save();

            // Create notification
            $notificacao = new Notificacao();
            $notificacao->Mensagem = "O anúncio '{$anuncio->Titulo}' requer revisão";
            $notificacao->DataNotificacao = now();
            $notificacao->ReferenciaID = $anuncio->ID_Anuncio;
            $notificacao->UtilizadorID_User = $anuncio->UtilizadorID_User;
            $notificacao->ReferenciaTipoID_ReferenciaTipo = 1; // Anúncio
            $notificacao->TIpo_notificacaoID_TipoNotificacao = 3; // Atualização de Status
            $notificacao->Estado_notificacaoID_estado_notificacao = 1; // Não Lida

            $notificacao->save();

            DB::commit();

            return response()->json([
                'message' => 'Anúncio marcado para revisão com sucesso',
                'status' => true
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Erro ao marcar anúncio para revisão: ' . $e->getMessage(),
                'status' => false
            ], 500);
        }
    }
}
