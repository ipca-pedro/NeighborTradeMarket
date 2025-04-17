<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Anuncio;
use App\Models\Utilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompraController extends Controller
{
    /**
     * Listar todas as compras do utilizador autenticado
     */
    public function index()
    {
        $user = Auth::user();
        $compras = Compra::with(['anuncio', 'utilizador'])
            ->where('UtilizadorID_User', $user->ID_User)
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
        $user = Auth::user();
        $compra = Compra::with(['anuncio', 'utilizador'])
            ->where('ID_Compra', $id)
            ->where('UtilizadorID_User', $user->ID_User)
            ->firstOrFail();

        return response()->json($compra);
    }
    
    /**
     * Criar uma nova compra
     */
    public function store(Request $request, $anuncioId)
    {
        $request->validate([
            'anuncioId' => 'required|exists:anuncio,ID_Anuncio'
        ]);

        $user = Auth::user();
        $anuncio = Anuncio::findOrFail($anuncioId);

        $compra = new Compra([
            'Data' => Carbon::now(),
            'UtilizadorID_User' => $user->ID_User,
            'AnuncioID_Anuncio' => $anuncioId
        ]);

        $compra->save();

        return response()->json([
            'message' => 'Compra realizada com sucesso',
            'compra' => $compra
        ], 201);
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

    /**
     * Iniciar uma nova compra
     */
    public function iniciarCompra(Request $request, $anuncioId)
    {
        try {
            $request->validate([
                'cartao_id' => 'required|exists:cartao,ID_Cartao'
            ]);

            $user = Auth::user();
            
            // Validar anúncio
            $anuncio = Anuncio::find($anuncioId);
            if (!$anuncio) {
                return response()->json(['error' => 'Anúncio não encontrado'], 404);
            }

            // Verificar se o usuário não está tentando comprar seu próprio anúncio
            if ($anuncio->UtilizadorID_User == $user->ID_User) {
                return response()->json(['error' => 'Não é possível comprar seu próprio anúncio'], 403);
            }

            // Verificar se já existe uma compra para este anúncio
            $compraExistente = Compra::where('AnuncioID_Anuncio', $anuncioId)->exists();

            if ($compraExistente) {
                return response()->json(['error' => 'Este anúncio já foi comprado'], 400);
            }

            DB::beginTransaction();

            // Criar nova compra
            $compra = new Compra();
            $compra->AnuncioID_Anuncio = $anuncioId;
            $compra->UtilizadorID_User = $user->ID_User;
            $compra->Data = now();
            $compra->save();

            // Criar notificação para o vendedor
            DB::table('notificacao')->insert([
                'Mensagem' => 'Nova solicitação de compra para o anúncio: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 3, // Tipo Compra
                'TIpo_notificacaoID_TipoNotificacao' => 1 // Nova compra
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Compra iniciada com sucesso',
                'compra' => $compra->load(['anuncio', 'utilizador'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao iniciar compra: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Listar compras do usuário
     */
    public function minhasCompras()
    {
        $user = Auth::user();
        $compras = Compra::with(['anuncio', 'utilizador'])
            ->where('UtilizadorID_User', $user->ID_User)
            ->orderBy('Data', 'desc')
            ->get();

        return response()->json($compras);
    }

    /**
     * Listar vendas do usuário
     */
    public function minhasVendas(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->get('per_page', 15);
        
        $vendas = Compra::with(['anuncio', 'status', 'comprador'])
            ->whereHas('anuncio', function($query) use ($user) {
                $query->where('UtilizadorID_User', $user->ID_User);
            })
            ->orderBy('Data_compra', 'desc')
            ->paginate($perPage);

        return response()->json($vendas);
    }

    /**
     * Atualizar status da compra
     */
    public function atualizarStatus(Request $request, $compraId)
    {
        try {
            $user = Auth::user();
            
            $compra = Compra::with('anuncio')->findOrFail($compraId);

            // Verificar se o usuário é o vendedor
            if ($compra->anuncio->UtilizadorID_User != $user->ID_User) {
                return response()->json(['error' => 'Não autorizado'], 403);
            }

            $request->validate([
                'status' => 'required|integer|exists:status_compra,ID_Status',
                'observacoes' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            $compra->StatusID_Status = $request->status;
            if ($request->has('observacoes')) {
                $compra->Observacoes = $request->observacoes;
            }
            $compra->Data_atualizacao = now();
            $compra->save();

            // Criar notificação para o comprador
            DB::table('notificacao')->insert([
                'Mensagem' => 'Status da sua compra foi atualizado para: ' . $compra->status->Descricao,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $compra->CompradorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 3, // Tipo Compra
                'TIpo_notificacaoID_TipoNotificacao' => 2 // Atualização de status
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Status atualizado com sucesso',
                'compra' => $compra->load(['anuncio', 'status'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao atualizar status: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Obter detalhes de uma compra
     */
    public function detalhes($compraId)
    {
        $user = Auth::user();
        
        $compra = Compra::with(['anuncio', 'status', 'comprador'])
            ->findOrFail($compraId);

        // Verificar se o usuário é o comprador ou vendedor
        if ($compra->CompradorID_User != $user->ID_User && 
            $compra->anuncio->UtilizadorID_User != $user->ID_User) {
            return response()->json(['error' => 'Não autorizado'], 403);
        }

        return response()->json($compra);
    }

    public function vendasAnuncio($anuncioId)
    {
        $user = Auth::user();
        $anuncio = Anuncio::where('ID_Anuncio', $anuncioId)
            ->where('UtilizadorID_User', $user->ID_User)
            ->firstOrFail();

        $compras = Compra::with(['utilizador'])
            ->where('AnuncioID_Anuncio', $anuncioId)
            ->orderBy('Data', 'desc')
            ->get();

        return response()->json($compras);
    }
}
