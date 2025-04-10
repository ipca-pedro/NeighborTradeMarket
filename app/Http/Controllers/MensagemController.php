<?php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use App\Models\Anuncio;
use App\Models\Utilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MensagemController extends Controller
{
    /**
     * Listar conversas do utilizador autenticado
     */
    public function getConversations()
    {
        $userId = Auth::id();
        
        // Buscar todas as mensagens onde o utilizador está envolvido
        $conversations = DB::table('Mensagem_Utilizador as mu')
            ->join('Mensagem as m', 'mu.MensagemID_Mensagem', '=', 'm.ID_Mensagem')
            ->join('Anuncio as a', 'm.ItemID_Item', '=', 'a.ID_Anuncio')
            ->join('Utilizador as u', 'a.UtilizadorID_User', '=', 'u.ID_User')
            ->where('mu.UtilizadorID_User', $userId)
            ->select(
                'a.ID_Anuncio',
                'a.Titulo',
                'u.ID_User as OwnerID',
                'u.Name as OwnerName',
                DB::raw('MAX(m.Data_mensagem) as last_message_date'),
                DB::raw('COUNT(m.ID_Mensagem) as message_count')
            )
            ->groupBy('a.ID_Anuncio', 'a.Titulo', 'u.ID_User', 'u.Name')
            ->orderBy('last_message_date', 'desc')
            ->get();
        
        return response()->json($conversations);
    }
    
    /**
     * Obter mensagens de uma conversa específica
     */
    public function getMessages($anuncioId)
    {
        $userId = Auth::id();
        
        // Verificar se o anúncio existe
        $anuncio = Anuncio::findOrFail($anuncioId);
        
        // Verificar se o utilizador tem permissão para ver estas mensagens
        // (deve ser o dono do anúncio ou ter enviado/recebido mensagens relacionadas)
        $isOwner = $anuncio->UtilizadorID_User == $userId;
        $isParticipant = DB::table('Mensagem_Utilizador as mu')
            ->join('Mensagem as m', 'mu.MensagemID_Mensagem', '=', 'm.ID_Mensagem')
            ->where('mu.UtilizadorID_User', $userId)
            ->where('m.ItemID_Item', $anuncioId)
            ->exists();
        
        if (!$isOwner && !$isParticipant) {
            return response()->json([
                'message' => 'Não autorizado a ver estas mensagens'
            ], 403);
        }
        
        // Buscar todas as mensagens relacionadas ao anúncio
        $messages = DB::table('Mensagem as m')
            ->join('Mensagem_Utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
            ->join('Utilizador as u', 'mu.UtilizadorID_User', '=', 'u.ID_User')
            ->join('Status_Mensagem as sm', 'm.Status_MensagemID_Status_Mensagem', '=', 'sm.ID_Status_Mensagem')
            ->where('m.ItemID_Item', $anuncioId)
            ->select(
                'm.ID_Mensagem',
                'm.Conteudo',
                'm.Data_mensagem',
                'u.ID_User as SenderID',
                'u.Name as SenderName',
                'sm.Descricao_status_mensagem as Status'
            )
            ->orderBy('m.Data_mensagem', 'asc')
            ->get();
        
        // Marcar mensagens como lidas se o utilizador não for o remetente
        if (!$isOwner) {
            DB::table('Mensagem as m')
                ->join('Mensagem_Utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
                ->where('m.ItemID_Item', $anuncioId)
                ->where('mu.UtilizadorID_User', '!=', $userId)
                ->where('m.Status_MensagemID_Status_Mensagem', 1) // Assumindo que 1 é "Não lida"
                ->update(['m.Status_MensagemID_Status_Mensagem' => 2]); // Assumindo que 2 é "Lida"
        }
        
        return response()->json([
            'anuncio' => $anuncio,
            'messages' => $messages
        ]);
    }
    
    /**
     * Enviar uma nova mensagem
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'anuncio_id' => 'required|exists:Anuncio,ID_Anuncio',
            'conteudo' => 'required|string|max:255'
        ]);
        
        $userId = Auth::id();
        $anuncioId = $request->anuncio_id;
        
        // Buscar o anúncio
        $anuncio = Anuncio::findOrFail($anuncioId);
        
        // Verificar se o anúncio está ativo
        if ($anuncio->Status_AnuncioID_Status_Anuncio != 2) { // Assumindo que 2 é "Ativo"
            return response()->json([
                'message' => 'Este anúncio não está disponível para mensagens'
            ], 400);
        }
        
        // Não permitir que o dono envie mensagem para seu próprio anúncio
        if ($anuncio->UtilizadorID_User == $userId) {
            return response()->json([
                'message' => 'Não é possível enviar mensagens para seu próprio anúncio'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Criar a mensagem
            $mensagem = new Mensagem([
                'Conteudo' => $request->conteudo,
                'Data_mensagem' => now(),
                'ItemID_Item' => $anuncioId,
                'Status_MensagemID_Status_Mensagem' => 1 // Não lida
            ]);
            
            $mensagem->save();
            
            // Associar a mensagem ao remetente
            DB::table('Mensagem_Utilizador')->insert([
                'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $userId
            ]);
            
            // Associar a mensagem ao destinatário (dono do anúncio)
            DB::table('Mensagem_Utilizador')->insert([
                'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User
            ]);
            
            // Criar notificação para o destinatário
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Nova mensagem recebida sobre seu anúncio: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 2, // Assumindo que 2 é para mensagens
                'TIpo_notificacaoID_TipoNotificacao' => 1 // Assumindo que 1 é para notificações gerais
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Mensagem enviada com sucesso',
                'mensagem' => $mensagem
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao enviar mensagem: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Responder a uma mensagem
     */
    public function replyMessage(Request $request, $anuncioId)
    {
        $request->validate([
            'conteudo' => 'required|string|max:255'
        ]);
        
        $userId = Auth::id();
        
        // Buscar o anúncio
        $anuncio = Anuncio::findOrFail($anuncioId);
        
        // Verificar se o utilizador é o dono do anúncio ou já tem mensagens nesta conversa
        $isOwner = $anuncio->UtilizadorID_User == $userId;
        $isParticipant = DB::table('Mensagem_Utilizador as mu')
            ->join('Mensagem as m', 'mu.MensagemID_Mensagem', '=', 'm.ID_Mensagem')
            ->where('mu.UtilizadorID_User', $userId)
            ->where('m.ItemID_Item', $anuncioId)
            ->exists();
        
        if (!$isOwner && !$isParticipant) {
            return response()->json([
                'message' => 'Não autorizado a responder a esta conversa'
            ], 403);
        }
        
        DB::beginTransaction();
        
        try {
            // Criar a mensagem
            $mensagem = new Mensagem([
                'Conteudo' => $request->conteudo,
                'Data_mensagem' => now(),
                'ItemID_Item' => $anuncioId,
                'Status_MensagemID_Status_Mensagem' => 1 // Não lida
            ]);
            
            $mensagem->save();
            
            // Associar a mensagem ao remetente
            DB::table('Mensagem_Utilizador')->insert([
                'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $userId
            ]);
            
            // Determinar o destinatário (o outro participante da conversa)
            if ($isOwner) {
                // Se o remetente é o dono, buscar o outro participante
                $recipient = DB::table('Mensagem_Utilizador as mu')
                    ->join('Mensagem as m', 'mu.MensagemID_Mensagem', '=', 'm.ID_Mensagem')
                    ->where('m.ItemID_Item', $anuncioId)
                    ->where('mu.UtilizadorID_User', '!=', $userId)
                    ->select('mu.UtilizadorID_User')
                    ->first();
                
                if ($recipient) {
                    // Associar a mensagem ao destinatário
                    DB::table('Mensagem_Utilizador')->insert([
                        'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                        'UtilizadorID_User' => $recipient->UtilizadorID_User
                    ]);
                    
                    // Criar notificação para o destinatário
                    DB::table('Notificacao')->insert([
                        'Mensagem' => 'Nova resposta recebida sobre o anúncio: ' . $anuncio->Titulo,
                        'DataNotificacao' => now(),
                        'ReferenciaID' => $mensagem->ID_Mensagem,
                        'UtilizadorID_User' => $recipient->UtilizadorID_User,
                        'ReferenciaTipoID_ReferenciaTipo' => 2, // Assumindo que 2 é para mensagens
                        'TIpo_notificacaoID_TipoNotificacao' => 1 // Assumindo que 1 é para notificações gerais
                    ]);
                }
            } else {
                // Se o remetente não é o dono, o destinatário é o dono
                DB::table('Mensagem_Utilizador')->insert([
                    'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                    'UtilizadorID_User' => $anuncio->UtilizadorID_User
                ]);
                
                // Criar notificação para o dono
                DB::table('Notificacao')->insert([
                    'Mensagem' => 'Nova resposta recebida sobre seu anúncio: ' . $anuncio->Titulo,
                    'DataNotificacao' => now(),
                    'ReferenciaID' => $mensagem->ID_Mensagem,
                    'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                    'ReferenciaTipoID_ReferenciaTipo' => 2, // Assumindo que 2 é para mensagens
                    'TIpo_notificacaoID_TipoNotificacao' => 1 // Assumindo que 1 é para notificações gerais
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Resposta enviada com sucesso',
                'mensagem' => $mensagem
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao enviar resposta: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Marcar todas as mensagens de uma conversa como lidas
     */
    public function markAsRead($anuncioId)
    {
        $userId = Auth::id();
        
        // Verificar se o utilizador tem permissão para acessar esta conversa
        $anuncio = Anuncio::findOrFail($anuncioId);
        $isOwner = $anuncio->UtilizadorID_User == $userId;
        $isParticipant = DB::table('Mensagem_Utilizador as mu')
            ->join('Mensagem as m', 'mu.MensagemID_Mensagem', '=', 'm.ID_Mensagem')
            ->where('mu.UtilizadorID_User', $userId)
            ->where('m.ItemID_Item', $anuncioId)
            ->exists();
        
        if (!$isOwner && !$isParticipant) {
            return response()->json([
                'message' => 'Não autorizado a acessar esta conversa'
            ], 403);
        }
        
        // Buscar todas as mensagens não lidas desta conversa
        $mensagens = DB::table('Mensagem as m')
            ->join('Mensagem_Utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
            ->where('m.ItemID_Item', $anuncioId)
            ->where('mu.UtilizadorID_User', $userId)
            ->where('m.Status_MensagemID_Status_Mensagem', 1) // Não lida
            ->update(['m.Status_MensagemID_Status_Mensagem' => 2]); // Lida
        
        return response()->json([
            'message' => 'Mensagens marcadas como lidas',
            'count' => $mensagens
        ]);
    }
    
    /**
     * Contar mensagens não lidas
     */
    public function countUnread()
    {
        $userId = Auth::id();
        
        $count = DB::table('Mensagem as m')
            ->join('Mensagem_Utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
            ->where('mu.UtilizadorID_User', $userId)
            ->where('m.Status_MensagemID_Status_Mensagem', 1) // Não lida
            ->count();
        
        return response()->json([
            'count' => $count
        ]);
    }
}
