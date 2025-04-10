<?php

namespace App\Http\Controllers;

use App\Models\Notificacao;
use App\Models\TipoNotificacao;
use App\Models\ReferenciaTipo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificacaoController extends Controller
{
    /**
     * Listar todas as notificações do utilizador autenticado
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
     * Listar notificações não lidas do utilizador autenticado
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
     * Marcar uma notificação como lida
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
     * Marcar todas as notificações como lidas
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
     * Excluir uma notificação
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
     * Excluir todas as notificações lidas
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
     * Contar notificações não lidas
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
     * Obter detalhes de uma notificação específica
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
        
        switch ($notificacao->TipoReferencia) {
            case 'Mensagem':
                // Buscar detalhes da mensagem
                $detalhes = DB::table('Mensagem as m')
                    ->join('Anuncio as a', 'm.ItemID_Item', '=', 'a.ID_Anuncio')
                    ->join('Utilizador as u', function($join) {
                        $join->join('Mensagem_Utilizador as mu', 'mu.UtilizadorID_User', '=', 'u.ID_User')
                            ->on('mu.MensagemID_Mensagem', '=', 'm.ID_Mensagem');
                    })
                    ->where('m.ID_Mensagem', $notificacao->ReferenciaID)
                    ->select(
                        'm.ID_Mensagem',
                        'm.Conteudo',
                        'm.Data_mensagem',
                        'a.ID_Anuncio',
                        'a.Titulo as TituloAnuncio',
                        'u.ID_User',
                        'u.Name as NomeRemetente'
                    )
                    ->first();
                break;
                
            case 'Troca':
                // Buscar detalhes da troca
                $detalhes = DB::table('Troca as t')
                    ->join('Anuncio as a1', 't.ItemID_ItemOferecido', '=', 'a1.ID_Anuncio')
                    ->join('Anuncio as a2', 't.ItemID_Solicitado', '=', 'a2.ID_Anuncio')
                    ->join('Utilizador as u1', 'a1.UtilizadorID_User', '=', 'u1.ID_User')
                    ->join('Utilizador as u2', 'a2.UtilizadorID_User', '=', 'u2.ID_User')
                    ->join('Status_Troca as st', 't.Status_TrocaID_Status_Troca', '=', 'st.ID_Status_Troca')
                    ->where('t.ID_Troca', $notificacao->ReferenciaID)
                    ->select(
                        't.ID_Troca',
                        't.DataTroca',
                        'a1.ID_Anuncio as ItemOferecidoID',
                        'a1.Titulo as ItemOferecidoTitulo',
                        'a2.ID_Anuncio as ItemSolicitadoID',
                        'a2.Titulo as ItemSolicitadoTitulo',
                        'u1.ID_User as UtilizadorOfereceuID',
                        'u1.Name as UtilizadorOfereceuNome',
                        'u2.ID_User as UtilizadorSolicitadoID',
                        'u2.Name as UtilizadorSolicitadoNome',
                        'st.Descricao_status_troca as StatusTroca'
                    )
                    ->first();
                break;
                
            case 'Avaliacao':
                // Buscar detalhes da avaliação
                $detalhes = DB::table('Avaliacao as av')
                    ->join('Compra as c', 'av.OrdemID_Produto', '=', 'c.ID_Compra')
                    ->join('Anuncio as a', 'c.AnuncioID_Anuncio', '=', 'a.ID_Anuncio')
                    ->join('Utilizador as u1', 'c.UtilizadorID_User', '=', 'u1.ID_User')
                    ->join('Utilizador as u2', 'a.UtilizadorID_User', '=', 'u2.ID_User')
                    ->join('Nota as n', 'av.NotaID_Nota', '=', 'n.ID_Nota')
                    ->where('av.Id_Avaliacao', $notificacao->ReferenciaID)
                    ->select(
                        'av.Id_Avaliacao',
                        'av.Comentario',
                        'av.Resposta',
                        'av.Data_Avaliacao',
                        'av.Data_Resposta',
                        'c.ID_Compra',
                        'a.ID_Anuncio',
                        'a.Titulo as TituloAnuncio',
                        'u1.ID_User as CompradorID',
                        'u1.Name as CompradorNome',
                        'u2.ID_User as VendedorID',
                        'u2.Name as VendedorNome',
                        'n.Descricao_nota as Nota'
                    )
                    ->first();
                break;
                
            case 'Aprovacao':
                // Buscar detalhes da aprovação
                $detalhes = DB::table('Aprovacao as ap')
                    ->join('Status_Aprovacao as sa', 'ap.Status_AprovacaoID_Status_Aprovacao', '=', 'sa.ID_Status_Aprovacao')
                    ->join('Utilizador as u', 'ap.UtilizadorID_Admin', '=', 'u.ID_User')
                    ->where('ap.ID_aprovacao', $notificacao->ReferenciaID)
                    ->select(
                        'ap.ID_aprovacao',
                        'ap.Data_Submissao',
                        'ap.Data_Aprovacao',
                        'sa.Descricao_status_aprovacao as StatusAprovacao',
                        'u.ID_User as AdminID',
                        'u.Name as AdminNome'
                    )
                    ->first();
                break;
        }
        
        return response()->json([
            'notificacao' => $notificacao,
            'detalhes' => $detalhes
        ]);
    }
}
