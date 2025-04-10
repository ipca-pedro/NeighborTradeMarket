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
        
        $userId = Auth::id();
        $itemOferecidoId = $request->item_oferecido_id;
        $itemSolicitadoId = $request->item_solicitado_id;
        
        // Verificar se os itens existem e estão ativos
        $itemOferecido = Anuncio::findOrFail($itemOferecidoId);
        $itemSolicitado = Anuncio::findOrFail($itemSolicitadoId);
        
        // Verificar se o utilizador é o dono do item oferecido
        if ($itemOferecido->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o dono do item oferecido'
            ], 403);
        }
        
        // Verificar se o utilizador não é o dono do item solicitado
        if ($itemSolicitado->UtilizadorID_User == $userId) {
            return response()->json([
                'message' => 'Não é possível solicitar troca com seu próprio item'
            ], 400);
        }
        
        // Verificar se os itens estão disponíveis para troca
        if ($itemOferecido->Status_AnuncioID_Status_Anuncio != 2 || $itemSolicitado->Status_AnuncioID_Status_Anuncio != 2) {
            return response()->json([
                'message' => 'Um ou ambos os itens não estão disponíveis para troca'
            ], 400);
        }
        
        // Verificar se já existe uma troca pendente entre estes itens
        $trocaExistente = Troca::where('ItemID_ItemOferecido', $itemOferecidoId)
            ->where('ItemID_Solicitado', $itemSolicitadoId)
            ->where('Status_TrocaID_Status_Troca', 1) // Pendente
            ->first();
        
        if ($trocaExistente) {
            return response()->json([
                'message' => 'Já existe uma proposta de troca pendente para estes itens'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Criar a troca
            $troca = new Troca([
                'DataTroca' => now(),
                'ItemID_ItemOferecido' => $itemOferecidoId,
                'ItemID_Solicitado' => $itemSolicitadoId,
                'Status_TrocaID_Status_Troca' => 1 // Pendente
            ]);
            
            $troca->save();
            
            // Criar notificação para o dono do item solicitado
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Nova proposta de troca recebida para seu anúncio: ' . $itemSolicitado->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $troca->ID_Troca,
                'UtilizadorID_User' => $itemSolicitado->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 3, // Assumindo que 3 é para trocas
                'TIpo_notificacaoID_TipoNotificacao' => 2 // Assumindo que 2 é para propostas de troca
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Proposta de troca enviada com sucesso',
                'troca' => $troca
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao criar proposta de troca: ' . $e->getMessage()
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
        
        if ($itemOferecido->Status_AnuncioID_Status_Anuncio != 2 || $itemSolicitado->Status_AnuncioID_Status_Anuncio != 2) {
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
                'TIpo_notificacaoID_TipoNotificacao' => 2 // Propostas de troca
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
                'TIpo_notificacaoID_TipoNotificacao' => 2 // Propostas de troca
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
                'TIpo_notificacaoID_TipoNotificacao' => 2 // Propostas de troca
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
}
