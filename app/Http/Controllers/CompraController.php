<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Anuncio;
use App\Models\Utilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    /**
     * Listar todas as compras do utilizador autenticado
     */
    public function index()
    {
        $userId = Auth::id();
        
        $compras = Compra::where('UtilizadorID_User', $userId)
            ->with(['anuncio', 'anuncio.utilizador', 'status_compra'])
            ->orderBy('Data', 'desc')
            ->get();
        
        return response()->json($compras);
    }
    
    /**
     * Listar vendas do utilizador autenticado
     */
    public function sales()
    {
        $userId = Auth::id();
        
        // Buscar anúncios do utilizador
        $anunciosIds = Anuncio::where('UtilizadorID_User', $userId)
            ->pluck('ID_Anuncio')
            ->toArray();
        
        // Buscar compras relacionadas a esses anúncios
        $vendas = Compra::whereIn('AnuncioID_Anuncio', $anunciosIds)
            ->with(['anuncio', 'utilizador', 'status_compra'])
            ->orderBy('Data', 'desc')
            ->get();
        
        return response()->json($vendas);
    }
    
    /**
     * Mostrar detalhes de uma compra específica
     */
    public function show($id)
    {
        $userId = Auth::id();
        
        $compra = Compra::with(['anuncio', 'anuncio.utilizador', 'utilizador', 'status_compra'])
            ->findOrFail($id);
        
        // Verificar se o utilizador está envolvido na compra (como comprador ou vendedor)
        if ($compra->UtilizadorID_User != $userId && $compra->anuncio->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Não autorizado a ver esta compra'
            ], 403);
        }
        
        return response()->json($compra);
    }
    
    /**
     * Criar uma nova compra
     */
    public function store(Request $request)
    {
        $request->validate([
            'anuncio_id' => 'required|exists:Anuncio,ID_Anuncio',
            'quantidade' => 'required|integer|min:1',
            'endereco_entrega' => 'required|string|max:255',
            'metodo_pagamento' => 'required|string|max:50'
        ]);
        
        $userId = Auth::id();
        $anuncioId = $request->anuncio_id;
        
        // Buscar o anúncio
        $anuncio = Anuncio::findOrFail($anuncioId);
        
        // Verificar se o anúncio está disponível para compra
        if ($anuncio->Status_AnuncioID_Status_Anuncio != 2) { // Assumindo que 2 é "Ativo"
            return response()->json([
                'message' => 'Este anúncio não está disponível para compra'
            ], 400);
        }
        
        // Verificar se o utilizador não está tentando comprar seu próprio anúncio
        if ($anuncio->UtilizadorID_User == $userId) {
            return response()->json([
                'message' => 'Não é possível comprar seu próprio anúncio'
            ], 400);
        }
        
        // Verificar se a quantidade solicitada está disponível
        if ($request->quantidade > $anuncio->Quantidade_disponivel) {
            return response()->json([
                'message' => 'Quantidade solicitada não disponível'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Calcular valor total
            $valorTotal = $anuncio->Preco * $request->quantidade;
            
            // Criar a compra
            $compra = new Compra([
                'Quantidade' => $request->quantidade,
                'Valor_total' => $valorTotal,
                'Data' => now(),
                'Endereco_entrega' => $request->endereco_entrega,
                'Metodo_pagamento' => $request->metodo_pagamento,
                'AnuncioID_Anuncio' => $anuncioId,
                'UtilizadorID_User' => $userId,
                'Status_CompraID_Status_Compra' => 1 // Pendente
            ]);
            
            $compra->save();
            
            // Atualizar a quantidade disponível no anúncio
            $anuncio->Quantidade_disponivel -= $request->quantidade;
            
            // Se a quantidade disponível chegar a zero, marcar o anúncio como vendido
            if ($anuncio->Quantidade_disponivel <= 0) {
                $anuncio->Status_AnuncioID_Status_Anuncio = 3; // Vendido
            }
            
            $anuncio->save();
            
            // Criar notificação para o vendedor
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Novo pedido recebido para seu anúncio: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 1, // Compras
                'TIpo_notificacaoID_TipoNotificacao' => 3 // Notificações de compra
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Compra realizada com sucesso',
                'compra' => $compra
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao processar compra: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Atualizar o status de uma compra (para vendedores)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_id' => 'required|exists:Status_Compra,ID_Status_Compra'
        ]);
        
        $userId = Auth::id();
        
        // Buscar a compra
        $compra = Compra::with('anuncio')->findOrFail($id);
        
        // Verificar se o utilizador é o vendedor
        if ($compra->anuncio->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o vendedor deste item'
            ], 403);
        }
        
        // Atualizar o status da compra
        $compra->Status_CompraID_Status_Compra = $request->status_id;
        $compra->save();
        
        // Buscar descrição do status para a notificação
        $statusDescricao = DB::table('Status_Compra')
            ->where('ID_Status_Compra', $request->status_id)
            ->value('Descricao_status_compra');
        
        // Criar notificação para o comprador
        DB::table('Notificacao')->insert([
            'Mensagem' => 'O status da sua compra foi atualizado para: ' . $statusDescricao . ' - ' . $compra->anuncio->Titulo,
            'DataNotificacao' => now(),
            'ReferenciaID' => $compra->ID_Compra,
            'UtilizadorID_User' => $compra->UtilizadorID_User,
            'ReferenciaTipoID_ReferenciaTipo' => 1, // Compras
            'TIpo_notificacaoID_TipoNotificacao' => 3 // Notificações de compra
        ]);
        
        return response()->json([
            'message' => 'Status da compra atualizado com sucesso',
            'compra' => $compra
        ]);
    }
    
    /**
     * Cancelar uma compra (para compradores)
     */
    public function cancel($id)
    {
        $userId = Auth::id();
        
        // Buscar a compra
        $compra = Compra::with('anuncio')->findOrFail($id);
        
        // Verificar se o utilizador é o comprador
        if ($compra->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o comprador deste item'
            ], 403);
        }
        
        // Verificar se a compra está em um estado que permite cancelamento
        if ($compra->Status_CompraID_Status_Compra > 2) { // Assumindo que apenas status 1 (Pendente) e 2 (Em processamento) podem ser cancelados
            return response()->json([
                'message' => 'Esta compra não pode ser cancelada no estado atual'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Atualizar o status da compra para cancelado
            $compra->Status_CompraID_Status_Compra = 5; // Cancelado
            $compra->save();
            
            // Restaurar a quantidade disponível no anúncio
            $anuncio = $compra->anuncio;
            $anuncio->Quantidade_disponivel += $compra->Quantidade;
            
            // Se o anúncio estava marcado como vendido, restaurar para ativo
            if ($anuncio->Status_AnuncioID_Status_Anuncio == 3) { // Vendido
                $anuncio->Status_AnuncioID_Status_Anuncio = 2; // Ativo
            }
            
            $anuncio->save();
            
            // Criar notificação para o vendedor
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Uma compra foi cancelada pelo comprador: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 1, // Compras
                'TIpo_notificacaoID_TipoNotificacao' => 3 // Notificações de compra
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Compra cancelada com sucesso',
                'compra' => $compra
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao cancelar compra: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Confirmar recebimento de uma compra (para compradores)
     */
    public function confirmReceipt($id)
    {
        $userId = Auth::id();
        
        // Buscar a compra
        $compra = Compra::with('anuncio')->findOrFail($id);
        
        // Verificar se o utilizador é o comprador
        if ($compra->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o comprador deste item'
            ], 403);
        }
        
        // Verificar se a compra está em um estado que permite confirmação de recebimento
        if ($compra->Status_CompraID_Status_Compra != 3) { // Assumindo que 3 é "Enviado"
            return response()->json([
                'message' => 'Esta compra não está em estado de envio para confirmar recebimento'
            ], 400);
        }
        
        // Atualizar o status da compra para concluído
        $compra->Status_CompraID_Status_Compra = 4; // Concluído
        $compra->save();
        
        // Criar notificação para o vendedor
        DB::table('Notificacao')->insert([
            'Mensagem' => 'O comprador confirmou o recebimento do item: ' . $compra->anuncio->Titulo,
            'DataNotificacao' => now(),
            'ReferenciaID' => $compra->ID_Compra,
            'UtilizadorID_User' => $compra->anuncio->UtilizadorID_User,
            'ReferenciaTipoID_ReferenciaTipo' => 1, // Compras
            'TIpo_notificacaoID_TipoNotificacao' => 3 // Notificações de compra
        ]);
        
        return response()->json([
            'message' => 'Recebimento confirmado com sucesso',
            'compra' => $compra
        ]);
    }
    
    /**
     * Obter os status de compra disponíveis
     */
    public function getStatusOptions()
    {
        $statusOptions = DB::table('Status_Compra')->get();
        return response()->json($statusOptions);
    }
    
    /**
     * Listar compras pendentes (para vendedores)
     */
    public function pendingSales()
    {
        $userId = Auth::id();
        
        // Buscar anúncios do utilizador
        $anunciosIds = Anuncio::where('UtilizadorID_User', $userId)
            ->pluck('ID_Anuncio')
            ->toArray();
        
        // Buscar compras pendentes relacionadas a esses anúncios
        $vendasPendentes = Compra::whereIn('AnuncioID_Anuncio', $anunciosIds)
            ->where('Status_CompraID_Status_Compra', 1) // Pendente
            ->with(['anuncio', 'utilizador', 'status_compra'])
            ->orderBy('Data', 'desc')
            ->get();
        
        return response()->json($vendasPendentes);
    }
}
