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
        $userId = Auth::user()->ID_User;
        
        $compras = Compra::where('UtilizadorID_User', $userId)
            ->with([
                'anuncio',
                'anuncio.utilizador',
                'avaliacao',
                'reclamacao',
                'anuncio.imagens' => function($query) {
                    $query->orderBy('ID_Imagem', 'asc')->limit(1);
                }
            ])
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
            ->with(['anuncio.status_anuncio', 'utilizador'])
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
        $compra = Compra::with(['anuncio.status_anuncio', 'utilizador'])
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

        DB::beginTransaction();
        try {
            $compra = new Compra([
                'Data' => Carbon::now(),
                'UtilizadorID_User' => $user->ID_User,
                'AnuncioID_Anuncio' => $anuncioId
            ]);
            $compra->save();

            // Atualizar o status do anúncio para vendido
            $anuncio->Status_AnuncioID_Status_Anuncio = 3; // Vendido
            $anuncio->save();

            DB::commit();

            return response()->json([
                'message' => 'Compra realizada com sucesso',
                'compra' => $compra
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao realizar a compra: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Atualizar o status de uma compra (para vendedores)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status_id' => 'required|exists:Status_Anuncio,ID_Status_Anuncio'
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
        
        DB::beginTransaction();
        try {
            // Atualizar o status do anúncio
            $compra->anuncio->Status_AnuncioID_Status_Anuncio = $request->status_id;
            $compra->anuncio->save();
            
            // Buscar descrição do status para a notificação
            $statusDescricao = DB::table('Status_Anuncio')
                ->where('ID_Status_Anuncio', $request->status_id)
                ->value('Descricao_status_anuncio');
            
            // Criar notificação para o comprador
            DB::table('Notificacao')->insert([
                'Mensagem' => 'O status da sua compra foi atualizado para: ' . $statusDescricao . ' - ' . $compra->anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $compra->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 1, // Compras
                'TIpo_notificacaoID_TipoNotificacao' => 3, // Notificações de compra
                'Estado_notificacaoID_estado_notificacao' => 1 // 1 = Não Lida
            ]);

            DB::commit();
            
            return response()->json([
                'message' => 'Status da compra atualizado com sucesso',
                'compra' => $compra
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar status: ' . $e->getMessage()
            ], 500);
        }
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
        
        // Verificar se o anúncio está em um estado que permite cancelamento
        if ($compra->anuncio->Status_AnuncioID_Status_Anuncio != 3) { // Só pode cancelar se estiver vendido
            return response()->json([
                'message' => 'Esta compra não pode ser cancelada no estado atual'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Atualizar o status do anúncio para ativo novamente
            $compra->anuncio->Status_AnuncioID_Status_Anuncio = 1; // Ativo
            $compra->anuncio->save();
            
            // Restaurar a quantidade disponível no anúncio se necessário
            if ($compra->anuncio->Quantidade_disponivel !== null) {
                $compra->anuncio->Quantidade_disponivel += 1;
                $compra->anuncio->save();
            }
            
            // Criar notificação para o vendedor
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Uma compra foi cancelada pelo comprador: ' . $compra->anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $compra->anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 1, // Compras
                'TIpo_notificacaoID_TipoNotificacao' => 3, // Notificações de compra
                'Estado_notificacaoID_estado_notificacao' => 1 // 1 = Não Lida
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
        
        // Verificar se o anúncio está vendido
        if ($compra->anuncio->Status_AnuncioID_Status_Anuncio != 3) { // Vendido
            return response()->json([
                'message' => 'Esta compra não está em estado apropriado para confirmar recebimento'
            ], 400);
        }
        
        DB::beginTransaction();
        try {
            // O anúncio permanece como vendido (3)
            // Aqui poderíamos adicionar um campo na tabela Compra para marcar como "recebido" se necessário
            
            // Criar notificação para o vendedor
            DB::table('Notificacao')->insert([
                'Mensagem' => 'O comprador confirmou o recebimento do item: ' . $compra->anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $compra->anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 1, // Compras
                'TIpo_notificacaoID_TipoNotificacao' => 3, // Notificações de compra
                'Estado_notificacaoID_estado_notificacao' => 1 // 1 = Não Lida
            ]);

            DB::commit();
            
            return response()->json([
                'message' => 'Recebimento confirmado com sucesso',
                'compra' => $compra
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao confirmar recebimento: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obter os status de compra disponíveis
     */
    public function getStatusOptions()
    {
        $statusOptions = DB::table('Status_Anuncio')->get();
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
        
        // Buscar compras relacionadas a esses anúncios que estão vendidos
        $vendasPendentes = Compra::whereIn('AnuncioID_Anuncio', $anunciosIds)
            ->whereHas('anuncio', function($query) {
                $query->where('Status_AnuncioID_Status_Anuncio', 3); // Vendido
            })
            ->with(['anuncio.status_anuncio', 'utilizador'])
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

            // Atualizar status do anúncio para vendido imediatamente
            $anuncio->Status_AnuncioID_Status_Anuncio = 3; // Vendido
            $anuncio->save();

            // Criar registo de pagamento
            DB::table('pagamento')->insert([
                'Valor' => (int)($anuncio->Preco * 100), // Convertendo para centavos e para inteiro
                'Data' => now(),
                'CompraID_Compra' => $compra->ID_Compra
            ]);

            // Criar notificação para o vendedor
            DB::table('notificacao')->insert([
                'Mensagem' => 'Seu anúncio foi vendido: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 6, // ID 6 = Compra na tabela referenciatipo
                'TIpo_notificacaoID_TipoNotificacao' => 8, // ID 8 = Compra na tabela TIpo_notificacao
                'Estado_notificacaoID_estado_notificacao' => 1 // 1 = Não Lida
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Compra realizada com sucesso',
                'compra' => $compra->load(['anuncio', 'utilizador'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Erro ao realizar compra: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Listar compras do usuário
     */
    public function minhasCompras()
    {
        try {
            $user = Auth::user();
            
            // Buscar todas as compras do usuário com relacionamentos
            $compras = Compra::with([
                    'anuncio.status_anuncio',
                    'anuncio.utilizador',
                    'avaliacoes',
                    'reclamacoes'
                ])
                ->where('UtilizadorID_User', $user->ID_User)
                ->orderBy('Data', 'desc')
                ->get();

            return response()->json($compras);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar compras: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar vendas do usuário
     */
    public function minhasVendas(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->get('per_page', 15);
        
        $vendas = Compra::with(['anuncio.status_anuncio', 'utilizador'])
            ->whereHas('anuncio', function($query) use ($user) {
                $query->where('UtilizadorID_User', $user->ID_User);
            })
            ->orderBy('Data', 'desc')
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
                'status' => 'required|integer|exists:status_anuncio,ID_Status_Anuncio',
                'observacoes' => 'nullable|string|max:500'
            ]);

            DB::beginTransaction();

            $compra->anuncio->Status_AnuncioID_Status_Anuncio = $request->status;
            if ($request->has('observacoes')) {
                $compra->Observacoes = $request->observacoes;
            }
            $compra->Data_atualizacao = now();
            $compra->save();

            // Criar notificação para o comprador
            DB::table('notificacao')->insert([
                'Mensagem' => 'Status da sua compra foi atualizado para: ' . $compra->anuncio->status_anuncio->Descricao_status_anuncio,
                'DataNotificacao' => now(),
                'ReferenciaID' => $compra->ID_Compra,
                'UtilizadorID_User' => $compra->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 3, // Tipo Compra
                'TIpo_notificacaoID_TipoNotificacao' => 2, // Atualização de status
                'Estado_notificacaoID_estado_notificacao' => 1 // 1 = Não Lida
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Status atualizado com sucesso',
                'compra' => $compra->load(['anuncio', 'anuncio.status_anuncio'])
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
        
        $compra = Compra::with(['anuncio.status_anuncio', 'utilizador'])
            ->findOrFail($compraId);

        // Verificar se o usuário é o comprador ou vendedor
        if ($compra->UtilizadorID_User != $user->ID_User && 
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
