<?php

namespace App\Http\Controllers;

use App\Models\Mensagem;
use App\Models\Anuncio;
use App\Models\Utilizador;
use App\Models\EstadoMensagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Events\MensagemEnviada;
use App\Events\MensagemLida;

class MensagemController extends Controller
{
    /**
     * Listar conversas do utilizador autenticado
     */
    public function getConversations()
    {
        try {
            $user = Auth::user();
            $perPage = request('per_page', 15);
            
            $conversas = DB::table('mensagem as m')
                ->join('mensagem_utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
                ->join('anuncio as a', 'm.ItemID_Item', '=', 'a.ID_Anuncio')
                ->join('utilizador as u', 'a.UtilizadorID_User', '=', 'u.ID_User')
                ->select([
                'a.ID_Anuncio',
                'a.Titulo',
                'u.Name as OwnerName',
                DB::raw('MAX(m.Data_mensagem) as last_message_date'),
                    DB::raw('COUNT(CASE WHEN m.Status_MensagemID_Status_Mensagem = 1 AND mu.UtilizadorID_User = ' . $user->ID_User . ' THEN 1 END) as unread_count')
                ])
                ->where(function($query) use ($user) {
                    $query->where('mu.UtilizadorID_User', $user->ID_User)
                        ->orWhere('a.UtilizadorID_User', $user->ID_User);
                })
                ->groupBy('a.ID_Anuncio', 'a.Titulo', 'u.Name')
            ->orderBy('last_message_date', 'desc')
                ->paginate($perPage);

            return response()->json($conversas);
            
        } catch (\Exception $e) {
            \Log::error('Erro ao buscar conversas:', [
                'error' => $e->getMessage(),
                'userId' => $user->ID_User
            ]);
            
            return response()->json([
                'error' => 'Erro ao buscar conversas: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obter mensagens de uma conversa específica
     */
    public function getMessages($anuncioId)
    {
        try {
            $user = Auth::user();
            $perPage = request('per_page', 50);
            
            // Primeiro, vamos buscar o anúncio para saber quem é o vendedor
            $anuncio = DB::table('anuncio')
                ->where('ID_Anuncio', $anuncioId)
                ->first();

            if (!$anuncio) {
                return response()->json(['error' => 'Anúncio não encontrado'], 404);
            }

            // Marcar mensagens como lidas
            DB::table('mensagem as m')
                ->join('mensagem_utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
            ->where('m.ItemID_Item', $anuncioId)
                ->where('mu.UtilizadorID_User', $user->ID_User)
                ->where('m.Status_MensagemID_Status_Mensagem', 1)
                ->update(['Status_MensagemID_Status_Mensagem' => 2]);

            // Buscar todas as mensagens da conversa
            $mensagens = DB::table('mensagem as m')
                ->select([
                'm.ID_Mensagem',
                'm.Conteudo',
                'm.Data_mensagem',
                'u.Name as SenderName',
                    'i.Caminho as SenderImage',
                    'mu.UtilizadorID_User as SenderId',
                    DB::raw('(mu.UtilizadorID_User = ' . $user->ID_User . ') as isMine')
                ])
                ->join('mensagem_utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
                ->join('utilizador as u', 'mu.UtilizadorID_User', '=', 'u.ID_User')
                ->leftJoin('imagem as i', 'u.ImagemID_Imagem', '=', 'i.ID_Imagem')
                ->where('m.ItemID_Item', $anuncioId)
            ->orderBy('m.Data_mensagem', 'asc')
            ->get();
        
            // Se o usuário é o vendedor, precisamos incluir todas as mensagens do anúncio
            if ($user->ID_User == $anuncio->UtilizadorID_User) {
                $mensagensCompradores = DB::table('mensagem as m')
                    ->select([
                        'm.ID_Mensagem',
                        'm.Conteudo',
                        'm.Data_mensagem',
                        'u.Name as SenderName',
                        'i.Caminho as SenderImage',
                        'mu.UtilizadorID_User as SenderId',
                        DB::raw('false as isMine')
                    ])
                    ->join('mensagem_utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
                    ->join('utilizador as u', 'mu.UtilizadorID_User', '=', 'u.ID_User')
                    ->leftJoin('imagem as i', 'u.ImagemID_Imagem', '=', 'i.ID_Imagem')
                ->where('m.ItemID_Item', $anuncioId)
                    ->where('mu.UtilizadorID_User', '!=', $user->ID_User)
                    ->orderBy('m.Data_mensagem', 'asc')
                    ->get();

                $mensagens = $mensagens->concat($mensagensCompradores);
            }

            // Remover duplicatas e ordenar por data
            $mensagensFiltradas = collect($mensagens)
                ->unique('ID_Mensagem')
                ->sortBy('Data_mensagem')
                ->values();

            // Paginar manualmente
            $page = request('page', 1);
            $total = $mensagensFiltradas->count();
            $mensagensPaginadas = $mensagensFiltradas->forPage($page, $perPage);
        
        return response()->json([
                'messages' => $mensagensPaginadas->values(),
                'pagination' => [
                    'current_page' => $page,
                    'last_page' => ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Erro ao buscar mensagens:', [
                'error' => $e->getMessage(),
                'anuncioId' => $anuncioId,
                'userId' => $user->ID_User,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Erro ao buscar mensagens: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Enviar uma nova mensagem
     */
    public function enviarMensagem(Request $request, $anuncioId)
    {
        \Log::info('Iniciando envio de mensagem', [
            'anuncioId' => $anuncioId,
            'userId' => Auth::id()
        ]);

        $user = Auth::user();
        if (!$user) {
            \Log::error('Utilizador não autenticado tentando enviar mensagem');
            return response()->json(['error' => 'Utilizador não autenticado'], 401);
        }

        $request->validate([
            'conteudo' => 'required|string|max:255'
        ]);
        
        // Verificar se o anúncio existe
        $anuncio = Anuncio::find($anuncioId);
        if (!$anuncio) {
            \Log::error('Tentativa de enviar mensagem para anúncio inexistente', [
                'anuncioId' => $anuncioId
            ]);
            return response()->json(['error' => 'Anúncio não encontrado'], 404);
        }

        // Se for uma nova conversa (não existem mensagens anteriores)
        $existemMensagens = DB::table('mensagem')
            ->where('ItemID_Item', $anuncioId)
            ->exists();

        // Se não existem mensagens e o usuário é dono do anúncio, não permitir iniciar conversa
        if (!$existemMensagens && $anuncio->UtilizadorID_User == $user->ID_User) {
            \Log::error('Usuário tentando iniciar conversa com seu próprio anúncio', [
                'userId' => $user->ID_User,
                'anuncioId' => $anuncioId
            ]);
            return response()->json(['error' => 'Não é possível iniciar conversa com seu próprio anúncio'], 403);
        }
        
        DB::beginTransaction();
        try {
            // Criar mensagem
            $mensagem = new Mensagem();
            $mensagem->Conteudo = $request->conteudo;
            $mensagem->Data_mensagem = now();
            $mensagem->ItemID_Item = $anuncioId;
            $mensagem->Status_MensagemID_Status_Mensagem = 1; // Não lida
            $mensagem->save();
            
            \Log::info('Mensagem criada', ['mensagemId' => $mensagem->ID_Mensagem]);

            // Criar relação mensagem-utilizador para o remetente
            DB::table('mensagem_utilizador')->insert([
                'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $user->ID_User
            ]);

            // Se for o dono do anúncio respondendo, notificar o último usuário que enviou mensagem
            if ($user->ID_User == $anuncio->UtilizadorID_User) {
                $ultimoRemetente = DB::table('mensagem as m')
                    ->join('mensagem_utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
                    ->where('m.ItemID_Item', $anuncioId)
                    ->where('mu.UtilizadorID_User', '!=', $user->ID_User)
                    ->orderBy('m.Data_mensagem', 'desc')
                    ->value('mu.UtilizadorID_User');

                if ($ultimoRemetente) {
                    DB::table('notificacao')->insert([
                        'Mensagem' => 'Nova resposta recebida sobre o anúncio: ' . $anuncio->Titulo,
                        'DataNotificacao' => now(),
                        'ReferenciaID' => $mensagem->ID_Mensagem,
                        'UtilizadorID_User' => $ultimoRemetente,
                        'ReferenciaTipoID_ReferenciaTipo' => 2,
                        'TIpo_notificacaoID_TipoNotificacao' => 5,
                        'Estado_notificacaoID_estado_notificacao' => 1
                    ]);
                }
            } else {
                // Se for um comprador enviando mensagem, notificar o dono do anúncio
                DB::table('notificacao')->insert([
                    'Mensagem' => 'Nova mensagem recebida sobre o anúncio: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                    'ReferenciaTipoID_ReferenciaTipo' => 2,
                    'TIpo_notificacaoID_TipoNotificacao' => 5,
                    'Estado_notificacaoID_estado_notificacao' => 1
            ]);
            }
            
            DB::commit();

            // Disparar evento de nova mensagem
            broadcast(new MensagemEnviada($mensagem))->toOthers();

            \Log::info('Mensagem enviada com sucesso', [
                'mensagemId' => $mensagem->ID_Mensagem,
                'anuncioId' => $anuncioId
            ]);
            
            return response()->json([
                'message' => 'Mensagem enviada com sucesso',
                'data' => $mensagem
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao enviar mensagem', [
                'error' => $e->getMessage(),
                'anuncioId' => $anuncioId,
                'userId' => $user->ID_User
            ]);
            return response()->json([
                'error' => 'Erro ao enviar mensagem: ' . $e->getMessage()
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
                        'ReferenciaTipoID_ReferenciaTipo' => 2,
                        'TIpo_notificacaoID_TipoNotificacao' => 5,
                        'Estado_notificacaoID_estado_notificacao' => 1
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
                    'Mensagem' => 'Nova resposta recebida sobre o anúncio: ' . $anuncio->Titulo,
                    'DataNotificacao' => now(),
                    'ReferenciaID' => $mensagem->ID_Mensagem,
                    'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                    'ReferenciaTipoID_ReferenciaTipo' => 2,
                    'TIpo_notificacaoID_TipoNotificacao' => 5,
                    'Estado_notificacaoID_estado_notificacao' => 1
                ]);
            }
            
            DB::commit();

            // Disparar evento de nova mensagem
            broadcast(new MensagemEnviada($mensagem))->toOthers();
            
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
     * Marcar mensagens como lidas
     */
    public function markAsRead($anuncioId)
    {
        $userId = Auth::id();
        
        $unreadMessages = DB::table('Mensagem as m')
            ->join('Mensagem_Utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
            ->where('m.ItemID_Item', $anuncioId)
            ->where('mu.UtilizadorID_User', '!=', $userId)
            ->where('m.Status_MensagemID_Status_Mensagem', 1)
            ->select('m.ID_Mensagem')
            ->get();

        if ($unreadMessages->isNotEmpty()) {
            DB::table('Mensagem')
                ->whereIn('ID_Mensagem', $unreadMessages->pluck('ID_Mensagem'))
                ->update(['Status_MensagemID_Status_Mensagem' => 2]);

            // Disparar evento de mensagens lidas
            broadcast(new MensagemLida($anuncioId, $userId))->toOthers();
        }
        
        return response()->json([
            'message' => 'Mensagens marcadas como lidas'
        ]);
    }
    
    /**
     * Contar mensagens não lidas
     */
    public function countUnread()
    {
        $userId = Auth::id();
        
        $unreadCount = DB::table('Mensagem as m')
            ->join('Mensagem_Utilizador as mu', 'm.ID_Mensagem', '=', 'mu.MensagemID_Mensagem')
            ->where('mu.UtilizadorID_User', $userId)
            ->where('m.Status_MensagemID_Status_Mensagem', 1)
            ->count();
        
        return response()->json([
            'unread_count' => $unreadCount
        ]);
    }

    /**
     * Iniciar uma nova conversa
     */
    public function iniciarConversa(Request $request, $anuncioId)
    {
        \Log::info('Iniciando nova conversa', [
            'anuncioId' => $anuncioId,
            'userId' => Auth::id()
        ]);

        $user = Auth::user();
        if (!$user) {
            \Log::error('Utilizador não autenticado tentando iniciar conversa');
            return response()->json(['error' => 'Utilizador não autenticado'], 401);
        }

        $request->validate([
            'conteudo' => 'required|string|max:255'
        ]);

        // Verificar se o anúncio existe
        $anuncio = Anuncio::find($anuncioId);
        if (!$anuncio) {
            \Log::error('Tentativa de iniciar conversa para anúncio inexistente', [
                'anuncioId' => $anuncioId
            ]);
            return response()->json(['error' => 'Anúncio não encontrado'], 404);
        }

        // Não permitir que o dono do anúncio inicie conversa com ele mesmo
        if ($anuncio->UtilizadorID_User == $user->ID_User) {
            \Log::error('Utilizador tentando iniciar conversa com seu próprio anúncio', [
                'userId' => $user->ID_User,
                'anuncioId' => $anuncioId
            ]);
            return response()->json(['error' => 'Não é possível iniciar conversa com seu próprio anúncio'], 400);
        }

        DB::beginTransaction();
        try {
            // Criar mensagem
            $mensagem = new Mensagem();
            $mensagem->Conteudo = $request->conteudo;
            $mensagem->Data_mensagem = now();
            $mensagem->ItemID_Item = $anuncioId;
            $mensagem->Status_MensagemID_Status_Mensagem = 1; // Não lida
            $mensagem->save();

            \Log::info('Mensagem inicial criada', ['mensagemId' => $mensagem->ID_Mensagem]);

            // Criar relação mensagem-utilizador para o remetente (quem inicia a conversa)
            DB::table('mensagem_utilizador')->insert([
                'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $user->ID_User
            ]);

            // Criar relação mensagem-utilizador para o dono do anúncio
            DB::table('mensagem_utilizador')->insert([
                'MensagemID_Mensagem' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User
            ]);

            // Criar notificação para o dono do anúncio
            DB::table('notificacao')->insert([
                'Mensagem' => 'Nova mensagem recebida sobre o seu anúncio: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $mensagem->ID_Mensagem,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 2,
                'TIpo_notificacaoID_TipoNotificacao' => 5,
                'Estado_notificacaoID_estado_notificacao' => 1
            ]);

            DB::commit();

            // Disparar evento de nova mensagem
            broadcast(new MensagemEnviada($mensagem))->toOthers();

            \Log::info('Conversa iniciada com sucesso', [
                'mensagemId' => $mensagem->ID_Mensagem,
                'anuncioId' => $anuncioId
            ]);

            return response()->json([
                'message' => 'Conversa iniciada com sucesso',
                'data' => $mensagem,
                'conversation' => [
                    'ID_Anuncio' => $anuncio->ID_Anuncio,
                    'Titulo' => $anuncio->Titulo,
                    'OwnerName' => $anuncio->utilizador->Name
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao iniciar conversa', [
                'error' => $e->getMessage(),
                'anuncioId' => $anuncioId,
                'userId' => $user->ID_User
            ]);
            return response()->json([
                'error' => 'Erro ao iniciar conversa: ' . $e->getMessage()
            ], 500);
        }
    }
}
