<?php

namespace App\Http\Controllers;

use App\Models\Notificacao;
use App\Models\TipoNotificacao;
use App\Models\ReferenciaTipo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(
 *     name="Notificações",
 *     description="API Endpoints para gerenciamento de notificações"
 * )
 */
class NotificacaoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/notificacoes",
     *     summary="Listar todas as notificações do utilizador",
     *     description="Retorna todas as notificações do utilizador autenticado",
     *     operationId="getAllNotificacoes",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de notificações recuperada com sucesso",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="ID_Notificacao", type="integer", example=1),
     *             @OA\Property(property="Mensagem", type="string", example="Seu anúncio foi aprovado"),
     *             @OA\Property(property="DataNotificacao", type="string", format="date-time", example="2023-01-01 12:00:00"),
     *             @OA\Property(property="Lida", type="integer", example=0),
     *             @OA\Property(property="ReferenciaID", type="integer", example=123),
     *             @OA\Property(property="TipoReferencia", type="string", example="Anúncio"),
     *             @OA\Property(property="TipoNotificacao", type="string", example="Aprovação")
     *         ))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao buscar notificações")
     *         )
     *     )
     * )
     */
    public function index()
    {
        $userId = Auth::id();
        
        $notificacoes = DB::table('Notificacao as n')
            ->join('Tipo_notificacao as tn', 'n.TIpo_notificacaoID_TipoNotificacao', '=', 'tn.ID_TipoNotificacao')
            ->join('Referencia_tipo as rt', 'n.ReferenciaTipoID_ReferenciaTipo', '=', 'rt.ID_ReferenciaTipo')
            ->where('n.UtilizadorID_User', $userId)
            ->select(
                'n.ID_Notificacao',
                'n.Mensagem',
                'n.DataNotificacao',
                'n.Lida',
                'n.ReferenciaID',
                'rt.Descricao_referencia_tipo as TipoReferencia',
                'tn.Descricao_tipo_notificacao as TipoNotificacao'
            )
            ->orderBy('n.DataNotificacao', 'desc')
            ->get();
        
        return response()->json($notificacoes);
    }
    
    /**
     * @OA\Get(
     *     path="/api/notificacoes/nao-lidas",
     *     summary="Listar notificações não lidas",
     *     description="Retorna todas as notificações não lidas do utilizador autenticado",
     *     operationId="getUnreadNotificacoes",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de notificações não lidas recuperada com sucesso",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="ID_Notificacao", type="integer", example=1),
     *             @OA\Property(property="Mensagem", type="string", example="Seu anúncio foi aprovado"),
     *             @OA\Property(property="DataNotificacao", type="string", format="date-time", example="2023-01-01 12:00:00"),
     *             @OA\Property(property="Lida", type="integer", example=0),
     *             @OA\Property(property="ReferenciaID", type="integer", example=123),
     *             @OA\Property(property="TipoReferencia", type="string", example="Anúncio"),
     *             @OA\Property(property="TipoNotificacao", type="string", example="Aprovação")
     *         ))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function unread()
    {
        $userId = Auth::id();
        
        $notificacoes = DB::table('Notificacao as n')
            ->join('Tipo_notificacao as tn', 'n.TIpo_notificacaoID_TipoNotificacao', '=', 'tn.ID_TipoNotificacao')
            ->join('Referencia_tipo as rt', 'n.ReferenciaTipoID_ReferenciaTipo', '=', 'rt.ID_ReferenciaTipo')
            ->where('n.UtilizadorID_User', $userId)
            ->where('n.Lida', 0) // Não lida
            ->select(
                'n.ID_Notificacao',
                'n.Mensagem',
                'n.DataNotificacao',
                'n.Lida',
                'n.ReferenciaID',
                'rt.Descricao_referencia_tipo as TipoReferencia',
                'tn.Descricao_tipo_notificacao as TipoNotificacao'
            )
            ->orderBy('n.DataNotificacao', 'desc')
            ->get();
        
        return response()->json($notificacoes);
    }
    
    /**
     * @OA\Post(
     *     path="/api/notificacoes/{id}/lida",
     *     summary="Marcar notificação como lida",
     *     description="Marca uma notificação específica como lida",
     *     operationId="markNotificationAsRead",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da notificação a ser marcada como lida",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Notificação marcada como lida com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Notificação marcada como lida")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Notificação não encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Notificação não encontrada ou não pertence ao utilizador")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function markAsRead($id)
    {
        $userId = Auth::id();
        
        // Verificar se a notificação existe e pertence ao utilizador
        $notificacao = DB::table('Notificacao')
            ->where('ID_Notificacao', $id)
            ->where('UtilizadorID_User', $userId)
            ->first();
        
        if (!$notificacao) {
            return response()->json([
                'message' => 'Notificação não encontrada ou não pertence ao utilizador'
            ], 404);
        }
        
        // Marcar como lida
        DB::table('Notificacao')
            ->where('ID_Notificacao', $id)
            ->update(['Lida' => 1]);
        
        return response()->json([
            'message' => 'Notificação marcada como lida'
        ]);
    }
    
    /**
     * @OA\Post(
     *     path="/api/notificacoes/todas-lidas",
     *     summary="Marcar todas as notificações como lidas",
     *     description="Marca todas as notificações não lidas do utilizador como lidas",
     *     operationId="markAllNotificationsAsRead",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Notificações marcadas como lidas com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Todas as notificações foram marcadas como lidas"),
     *             @OA\Property(property="count", type="integer", example=5)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function markAllAsRead()
    {
        $userId = Auth::id();
        
        // Marcar todas as notificações do utilizador como lidas
        $count = DB::table('Notificacao')
            ->where('UtilizadorID_User', $userId)
            ->where('Lida', 0)
            ->update(['Lida' => 1]);
        
        return response()->json([
            'message' => 'Todas as notificações foram marcadas como lidas',
            'count' => $count
        ]);
    }
    
    /**
     * @OA\Delete(
     *     path="/api/notificacoes/{id}",
     *     summary="Excluir notificação",
     *     description="Exclui uma notificação específica do utilizador",
     *     operationId="deleteNotification",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da notificação a ser excluída",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Notificação excluída com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Notificação excluída com sucesso")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Notificação não encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Notificação não encontrada ou não pertence ao utilizador")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        $userId = Auth::id();
        
        // Verificar se a notificação existe e pertence ao utilizador
        $notificacao = DB::table('Notificacao')
            ->where('ID_Notificacao', $id)
            ->where('UtilizadorID_User', $userId)
            ->first();
        
        if (!$notificacao) {
            return response()->json([
                'message' => 'Notificação não encontrada ou não pertence ao utilizador'
            ], 404);
        }
        
        // Excluir a notificação
        DB::table('Notificacao')
            ->where('ID_Notificacao', $id)
            ->delete();
        
        return response()->json([
            'message' => 'Notificação excluída com sucesso'
        ]);
    }
    
    /**
     * @OA\Delete(
     *     path="/api/notificacoes/lidas",
     *     summary="Excluir todas as notificações lidas",
     *     description="Exclui todas as notificações já lidas do utilizador",
     *     operationId="deleteAllReadNotifications",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Notificações lidas excluídas com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Todas as notificações lidas foram excluídas"),
     *             @OA\Property(property="count", type="integer", example=10)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function deleteAllRead()
    {
        $userId = Auth::id();
        
        // Excluir todas as notificações lidas do utilizador
        $count = DB::table('Notificacao')
            ->where('UtilizadorID_User', $userId)
            ->where('Lida', 1)
            ->delete();
        
        return response()->json([
            'message' => 'Todas as notificações lidas foram excluídas',
            'count' => $count
        ]);
    }
    
    /**
     * @OA\Get(
     *     path="/api/notificacoes/nao-lidas/contar",
     *     summary="Contar notificações não lidas",
     *     description="Retorna o número de notificações não lidas do utilizador autenticado",
     *     operationId="countUnreadNotifications",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Contagem de notificações não lidas",
     *         @OA\JsonContent(
     *             @OA\Property(property="count", type="integer", example=5)
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function countUnread()
    {
        $userId = Auth::id();
        
        $count = DB::table('Notificacao')
            ->where('UtilizadorID_User', $userId)
            ->where('Lida', 0)
            ->count();
        
        return response()->json([
            'count' => $count
        ]);
    }
    
    /**
     * @OA\Get(
     *     path="/api/notificacoes/{id}",
     *     summary="Visualizar notificação específica",
     *     description="Retorna detalhes de uma notificação específica e a marca como lida",
     *     operationId="getNotificationDetails",
     *     tags={"Notificações"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID da notificação a ser visualizada",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalhes da notificação recuperados com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="ID_Notificacao", type="integer", example=1),
     *             @OA\Property(property="Mensagem", type="string", example="Seu anúncio foi aprovado"),
     *             @OA\Property(property="DataNotificacao", type="string", format="date-time", example="2023-01-01 12:00:00"),
     *             @OA\Property(property="Lida", type="integer", example=1),
     *             @OA\Property(property="ReferenciaID", type="integer", example=123),
     *             @OA\Property(property="TipoReferencia", type="string", example="Anúncio"),
     *             @OA\Property(property="TipoNotificacao", type="string", example="Aprovação")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Notificação não encontrada",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Notificação não encontrada ou não pertence ao utilizador")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        $userId = Auth::id();
        
        $notificacao = DB::table('Notificacao as n')
            ->join('Tipo_notificacao as tn', 'n.TIpo_notificacaoID_TipoNotificacao', '=', 'tn.ID_TipoNotificacao')
            ->join('Referencia_tipo as rt', 'n.ReferenciaTipoID_ReferenciaTipo', '=', 'rt.ID_ReferenciaTipo')
            ->where('n.ID_Notificacao', $id)
            ->where('n.UtilizadorID_User', $userId)
            ->select(
                'n.ID_Notificacao',
                'n.Mensagem',
                'n.DataNotificacao',
                'n.Lida',
                'n.ReferenciaID',
                'rt.Descricao_referencia_tipo as TipoReferencia',
                'tn.Descricao_tipo_notificacao as TipoNotificacao'
            )
            ->first();
        
        if (!$notificacao) {
            return response()->json([
                'message' => 'Notificação não encontrada ou não pertence ao utilizador'
            ], 404);
        }
        
        // Marcar como lida ao visualizar detalhes
        DB::table('Notificacao')
            ->where('ID_Notificacao', $id)
            ->update(['Lida' => 1]);
        
        // Buscar detalhes adicionais com base no tipo de referência
        $detalhes = null;
        
        // Exemplo: se for referência a um anúncio, buscar detalhes do anúncio
        if ($notificacao->TipoReferencia == 'Anúncio') {
            $anuncio = DB::table('Anuncio')
                ->where('ID_Anuncio', $notificacao->ReferenciaID)
                ->select('ID_Anuncio', 'Titulo', 'Descricao', 'Preco')
                ->first();
                
            if ($anuncio) {
                $detalhes = $anuncio;
            }
        }
        
        // Adicionar detalhes à resposta se encontrados
        $resposta = (array) $notificacao;
        if ($detalhes) {
            $resposta['detalhes'] = $detalhes;
        }
        
        return response()->json($resposta);
    }
}
