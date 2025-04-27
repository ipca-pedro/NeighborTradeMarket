<?php

namespace App\Http\Controllers;

use App\Models\Troca;
use App\Models\Anuncio;
use App\Models\Utilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrocaController extends Controller
{
    /**
     * Listar todas as trocas do utilizador autenticado
     */
    public function index()
    {
        $userId = Auth::id();
        
        // Buscar anúncios do utilizador
        $anunciosIds = Anuncio::where('UtilizadorID_User', $userId)
            ->pluck('ID_Anuncio')
            ->toArray();
        
        // Buscar trocas onde o utilizador está envolvido (como solicitante ou como dono do item solicitado)
        $trocas = Troca::where(function($query) use ($anunciosIds, $userId) {
                // Trocas onde o utilizador é o dono do item solicitado
                $query->whereIn('ItemID_Solicitado', $anunciosIds)
                // Ou trocas onde o utilizador é o solicitante (dono do item oferecido)
                ->orWhereIn('ItemID_ItemOferecido', $anunciosIds);
            })
            ->with([
                'item_oferecido', 
                'item_solicitado', 
                'status_troca',
                'item_oferecido.utilizador',
                'item_solicitado.utilizador'
            ])
            ->orderBy('DataTroca', 'desc')
            ->get();
        
        return response()->json($trocas);
    }
    
    /**
     * Mostrar detalhes de uma troca específica
     */
    public function show($id)
    {
        $userId = Auth::id();
        
        $troca = Troca::with([
                'item_oferecido', 
                'item_solicitado', 
                'status_troca',
                'item_oferecido.utilizador',
                'item_solicitado.utilizador'
            ])
            ->findOrFail($id);
        
        // Verificar se o utilizador está envolvido na troca
        $itemOferecido = Anuncio::find($troca->ItemID_ItemOferecido);
        $itemSolicitado = Anuncio::find($troca->ItemID_Solicitado);
        
        if ($itemOferecido->UtilizadorID_User != $userId && $itemSolicitado->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Não autorizado a ver esta troca'
            ], 403);
        }
        
        return response()->json($troca);
    }
    
    /**
     * Criar uma nova proposta de troca
     */
    public function store(Request $request)
    {
        $request->validate([
            'item_oferecido_id' => 'required|exists:Anuncio,ID_Anuncio',
            'item_solicitado_id' => 'required|exists:Anuncio,ID_Anuncio',
        ]);
        
        // Garantir que temos o ID numérico do usuário
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'message' => 'Usuário não autenticado',
                'error_code' => 'USER_NOT_AUTHENTICATED'
            ], 401);
        }
        $userId = $user->ID_User; // Usar ID_User em vez de Auth::id()

        $itemOferecidoId = $request->item_oferecido_id;
        $itemSolicitadoId = $request->item_solicitado_id;
        
        // Verificar se os itens existem e estão ativos
        $itemOferecido = Anuncio::findOrFail($itemOferecidoId);
        $itemSolicitado = Anuncio::findOrFail($itemSolicitadoId);
        
        // Log detalhado para debug
        \Log::info('Tentativa de troca - Detalhes completos:', [
            'user_id' => $userId,
            'user_email' => $user->Email, // Adicionado para debug
            'item_oferecido' => [
                'id' => $itemOferecidoId,
                'dono_id' => $itemOferecido->UtilizadorID_User,
                'titulo' => $itemOferecido->Titulo,
                'status' => $itemOferecido->Status_AnuncioID_Status_Anuncio
            ],
            'item_solicitado' => [
                'id' => $itemSolicitadoId,
                'dono_id' => $itemSolicitado->UtilizadorID_User,
                'titulo' => $itemSolicitado->Titulo,
                'status' => $itemSolicitado->Status_AnuncioID_Status_Anuncio
            ]
        ]);

        // Verificar se o usuário autenticado é o dono do item oferecido
        if ((int)$itemOferecido->UtilizadorID_User !== (int)$userId) {
            \Log::warning('Tentativa de troca não autorizada - usuário não é dono do item oferecido', [
                'user_id' => $userId,
                'dono_id' => $itemOferecido->UtilizadorID_User,
                'item_id' => $itemOferecidoId
            ]);
            
            return response()->json([
                'message' => 'Você não é o dono do item oferecido',
                'error_code' => 'NOT_ITEM_OWNER',
                'debug' => [
                    'seu_id' => $userId,
                    'seu_id_type' => gettype($userId),
                    'dono_id' => $itemOferecido->UtilizadorID_User,
                    'dono_id_type' => gettype($itemOferecido->UtilizadorID_User),
                    'item_oferecido' => $itemOferecidoId
                ]
            ], 403);
        }
        
        // Verificar se o item solicitado pertence a outro usuário
        if ((int)$itemSolicitado->UtilizadorID_User === (int)$userId) {
            \Log::warning('Tentativa de troca inválida - usuário tentando trocar com próprio item', [
                'user_id' => $userId,
                'item_solicitado_id' => $itemSolicitadoId
            ]);
            
            return response()->json([
                'message' => 'Não é possível solicitar troca com seu próprio item',
                'error_code' => 'SELF_TRADE_NOT_ALLOWED',
                'debug' => [
                    'seu_id' => $userId,
                    'dono_item_solicitado' => $itemSolicitado->UtilizadorID_User,
                    'item_solicitado' => $itemSolicitadoId
                ]
            ], 400);
        }
        
        // Verificar se os itens estão disponíveis para troca
        if ($itemOferecido->Status_AnuncioID_Status_Anuncio !== 1 || $itemSolicitado->Status_AnuncioID_Status_Anuncio !== 1) {
            \Log::warning('Tentativa de troca com itens indisponíveis', [
                'item_oferecido_status' => $itemOferecido->Status_AnuncioID_Status_Anuncio,
                'item_solicitado_status' => $itemSolicitado->Status_AnuncioID_Status_Anuncio
            ]);
            
            return response()->json([
                'message' => 'Um ou ambos os itens não estão disponíveis para troca',
                'error_code' => 'ITEMS_NOT_AVAILABLE',
                'debug' => [
                    'status_oferecido' => $itemOferecido->Status_AnuncioID_Status_Anuncio,
                    'status_solicitado' => $itemSolicitado->Status_AnuncioID_Status_Anuncio,
                    'item_oferecido' => $itemOferecidoId,
                    'item_solicitado' => $itemSolicitadoId
                ]
            ], 400);
        }
        
        // Verificar se já existe uma troca pendente entre estes itens
        $trocaExistente = Troca::where(function($query) use ($itemOferecidoId, $itemSolicitadoId) {
                $query->where('ItemID_ItemOferecido', $itemOferecidoId)
                      ->where('ItemID_Solicitado', $itemSolicitadoId);
            })
            ->orWhere(function($query) use ($itemOferecidoId, $itemSolicitadoId) {
                $query->where('ItemID_ItemOferecido', $itemSolicitadoId)
                      ->where('ItemID_Solicitado', $itemOferecidoId);
            })
            ->where('Status_TrocaID_Status_Troca', 1) // Pendente
            ->first();
        
        if ($trocaExistente) {
            return response()->json([
                'message' => 'Já existe uma proposta de troca pendente para estes itens',
                'troca_id' => $trocaExistente->ID_Troca
            ], 400);
        }
        
        try {
            DB::beginTransaction();

            $troca = new Troca();
            $troca->ItemID_ItemOferecido = $itemOferecidoId;
            $troca->ItemID_Solicitado = $itemSolicitadoId;
            $troca->DataTroca = now();
            $troca->Status_TrocaID_Status_Troca = 1; // Pendente
            $troca->save();

            // Criar notificação para o dono do item solicitado
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Você recebeu uma nova proposta de troca para seu anúncio "' . $itemSolicitado->Titulo . '".',
                'DataNotificacao' => now(),
                'ReferenciaID' => $troca->ID_Troca,
                'UtilizadorID_User' => $itemSolicitado->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 4, // Trocas
                'TIpo_notificacaoID_TipoNotificacao' => 9, // Nova proposta de troca
                'Estado_notificacaoID_estado_notificacao' => 1 // Não Lida
            ]);

            DB::commit();
            
            \Log::info('Troca criada com sucesso:', [
                'troca_id' => $troca->ID_Troca,
                'user_id' => $userId
            ]);

            return response()->json([
                'message' => 'Proposta de troca criada com sucesso',
                'troca' => $troca
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao criar troca:', [
                'error' => $e->getMessage(),
                'user_id' => $userId
            ]);
            return response()->json([
                'message' => 'Erro ao criar proposta de troca',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Aceitar uma proposta de troca
     */
    public function accept($id)
    {
        $userId = Auth::id();
        
        $troca = Troca::findOrFail($id);
        
        // Verificar se a troca está pendente
        if ($troca->Status_TrocaID_Status_Troca != 1) { // Pendente
            return response()->json([
                'message' => 'Esta troca não está pendente'
            ], 400);
        }
        
        // Verificar se o utilizador é o dono do item solicitado
        $itemSolicitado = Anuncio::findOrFail($troca->ItemID_Solicitado);
        
        if ($itemSolicitado->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o dono do item solicitado'
            ], 403);
        }
        
        // Verificar se os itens ainda estão disponíveis
        $itemOferecido = Anuncio::findOrFail($troca->ItemID_ItemOferecido);
        
        if ($itemOferecido->Status_AnuncioID_Status_Anuncio != 1 || $itemSolicitado->Status_AnuncioID_Status_Anuncio != 1) {
            return response()->json([
                'message' => 'Um ou ambos os itens não estão mais disponíveis'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Atualizar status da troca
            $troca->Status_TrocaID_Status_Troca = 2; // Aceita
            $troca->save();
            
            // Atualizar status dos anúncios para indisponíveis/trocados
            $itemOferecido->Status_AnuncioID_Status_Anuncio = 4; // Trocado
            $itemSolicitado->Status_AnuncioID_Status_Anuncio = 4; // Trocado
            
            $itemOferecido->save();
            $itemSolicitado->save();
            
            // Criar notificação para o dono do item oferecido
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Sua proposta de troca foi aceita para o anúncio: ' . $itemSolicitado->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $troca->ID_Troca,
                'UtilizadorID_User' => $itemOferecido->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 3, // Trocas
                'TIpo_notificacaoID_TipoNotificacao' => 2, // Propostas de troca
                'Estado_notificacaoID_estado_notificacao' => 1 // Não Lida
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Proposta de troca aceita com sucesso',
                'troca' => $troca
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao aceitar proposta de troca: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Rejeitar uma proposta de troca
     */
    public function reject($id)
    {
        $userId = Auth::id();
        
        $troca = Troca::findOrFail($id);
        
        // Verificar se a troca está pendente
        if ($troca->Status_TrocaID_Status_Troca != 1) { // Pendente
            return response()->json([
                'message' => 'Esta troca não está pendente'
            ], 400);
        }
        
        // Verificar se o utilizador é o dono do item solicitado
        $itemSolicitado = Anuncio::findOrFail($troca->ItemID_Solicitado);
        
        if ($itemSolicitado->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o dono do item solicitado'
            ], 403);
        }
        
        DB::beginTransaction();
        
        try {
            // Atualizar status da troca
            $troca->Status_TrocaID_Status_Troca = 3; // Rejeitada
            $troca->save();
            
            // Buscar o item oferecido para a notificação
            $itemOferecido = Anuncio::findOrFail($troca->ItemID_ItemOferecido);
            
            // Criar notificação para o dono do item oferecido
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Sua proposta de troca foi rejeitada para o anúncio: ' . $itemSolicitado->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $troca->ID_Troca,
                'UtilizadorID_User' => $itemOferecido->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 3, // Trocas
                'TIpo_notificacaoID_TipoNotificacao' => 2, // Propostas de troca
                'Estado_notificacaoID_estado_notificacao' => 1 // Não Lida
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Proposta de troca rejeitada',
                'troca' => $troca
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao rejeitar proposta de troca: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Cancelar uma proposta de troca (pelo solicitante)
     */
    public function cancel($id)
    {
        $userId = Auth::id();
        
        $troca = Troca::findOrFail($id);
        
        // Verificar se a troca está pendente
        if ($troca->Status_TrocaID_Status_Troca != 1) { // Pendente
            return response()->json([
                'message' => 'Esta troca não está pendente'
            ], 400);
        }
        
        // Verificar se o utilizador é o dono do item oferecido (solicitante)
        $itemOferecido = Anuncio::findOrFail($troca->ItemID_ItemOferecido);
        
        if ($itemOferecido->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o solicitante desta troca'
            ], 403);
        }
        
        DB::beginTransaction();
        
        try {
            // Atualizar status da troca
            $troca->Status_TrocaID_Status_Troca = 4; // Cancelada
            $troca->save();
            
            // Buscar o item solicitado para a notificação
            $itemSolicitado = Anuncio::findOrFail($troca->ItemID_Solicitado);
            
            // Criar notificação para o dono do item solicitado
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Uma proposta de troca para seu anúncio foi cancelada: ' . $itemSolicitado->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $troca->ID_Troca,
                'UtilizadorID_User' => $itemSolicitado->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 3, // Trocas
                'TIpo_notificacaoID_TipoNotificacao' => 2, // Propostas de troca
                'Estado_notificacaoID_estado_notificacao' => 1 // Não Lida
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Proposta de troca cancelada',
                'troca' => $troca
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao cancelar proposta de troca: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Listar propostas de troca pendentes recebidas
     */
    public function pendingReceived()
    {
        $userId = Auth::id();
        
        // Buscar anúncios do utilizador
        $anunciosIds = Anuncio::where('UtilizadorID_User', $userId)
            ->pluck('ID_Anuncio')
            ->toArray();
        
        // Buscar trocas pendentes onde o utilizador é o dono do item solicitado
        $trocas = Troca::whereIn('ItemID_Solicitado', $anunciosIds)
            ->where('Status_TrocaID_Status_Troca', 1) // Pendente
            ->with([
                'item_oferecido', 
                'item_solicitado', 
                'status_troca',
                'item_oferecido.utilizador'
            ])
            ->orderBy('DataTroca', 'desc')
            ->get();
        
        return response()->json($trocas);
    }
    
    /**
     * Listar propostas de troca pendentes enviadas
     */
    public function pendingSent()
    {
        $userId = Auth::id();
        
        // Buscar anúncios do utilizador
        $anunciosIds = Anuncio::where('UtilizadorID_User', $userId)
            ->pluck('ID_Anuncio')
            ->toArray();
        
        // Buscar trocas pendentes onde o utilizador é o dono do item oferecido
        $trocas = Troca::whereIn('ItemID_ItemOferecido', $anunciosIds)
            ->where('Status_TrocaID_Status_Troca', 1) // Pendente
            ->with([
                'item_oferecido', 
                'item_solicitado', 
                'status_troca',
                'item_solicitado.utilizador'
            ])
            ->orderBy('DataTroca', 'desc')
            ->get();
        
        return response()->json($trocas);
    }

    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $troca = Troca::findOrFail($id);
            $oldStatus = $troca->Status_TrocaID_Status_Troca;
            
            $troca->fill($request->all());
            $troca->save();

            // Se o status mudou para aceito ou rejeitado
            if ($oldStatus != $troca->Status_TrocaID_Status_Troca) {
                $anuncio = Anuncio::find($troca->AnuncioID_Anuncio);
                if ($anuncio) {
                    $mensagem = '';
                    $tipoNotificacao = 0;

                    if ($troca->Status_TrocaID_Status_Troca == 2) { // Aceita
                        $mensagem = 'Sua proposta de troca para o anúncio "' . $anuncio->Titulo . '" foi aceita!';
                        $tipoNotificacao = 9; // Troca aceita
                    } elseif ($troca->Status_TrocaID_Status_Troca == 3) { // Rejeitada
                        $mensagem = 'Sua proposta de troca para o anúncio "' . $anuncio->Titulo . '" foi rejeitada.';
                        $tipoNotificacao = 10; // Troca rejeitada
                    }

                    if ($mensagem && $tipoNotificacao) {
                        DB::table('Notificacao')->insert([
                            'Mensagem' => $mensagem,
                            'DataNotificacao' => now(),
                            'ReferenciaID' => $troca->ID_Troca,
                            'UtilizadorID_User' => $troca->UtilizadorID_User,
                            'ReferenciaTipoID_ReferenciaTipo' => 4, // Trocas
                            'TIpo_notificacaoID_TipoNotificacao' => $tipoNotificacao,
                            'Estado_notificacaoID_estado_notificacao' => 1 // Não Lida
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json($troca);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
