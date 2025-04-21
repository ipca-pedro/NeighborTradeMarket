<?php

namespace App\Http\Controllers;

use App\Models\Reclamacao;
use App\Models\Compra;
use App\Models\Aprovacao;
use App\Models\Notificacao;
use App\Models\StatusReclamacao;
use App\Models\Utilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReclamacaoController extends Controller
{
    /**
     * Criar uma nova reclamação
     */
    public function store(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'compraId' => 'required|exists:compra,ID_Compra',
                'descricao' => 'required|string'
            ]);

            // Get the purchase and check if user is the buyer
            $compra = Compra::findOrFail($request->compraId);
            if ($compra->UtilizadorID_Comprador !== auth()->id()) {
                return response()->json(['message' => 'Não autorizado a criar reclamação para esta compra'], 403);
            }

            // Check if complaint already exists for this purchase
            if ($compra->reclamacoes()->exists()) {
                return response()->json(['message' => 'Já existe uma reclamação para esta compra'], 400);
            }

            DB::beginTransaction();

            // 1. Create approval (pending)
            $aprovacao = new Aprovacao();
            $aprovacao->Data_Submissao = now();
            $aprovacao->Status_AprovacaoID_Status_Aprovacao = 1; // Assuming 1 is "Pendente"
            $aprovacao->save();

            // 2. Create complaint
            $reclamacao = new Reclamacao();
            $reclamacao->Descricao = $request->descricao;
            $reclamacao->DataReclamacao = now();
            $reclamacao->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $reclamacao->Status_ReclamacaoID_Status_Reclamacao = 1; // Assuming 1 is "Pendente"
            $reclamacao->save();

            // 3. Link complaint to purchase
            $compra->reclamacoes()->attach($reclamacao->ID_Reclamacao);

            // 4. Create notifications
            // For seller
            $notificacaoVendedor = new Notificacao();
            $notificacaoVendedor->Mensagem = "Nova reclamação recebida para sua venda";
            $notificacaoVendedor->DataNotificacao = now();
            $notificacaoVendedor->ReferenciaID = $reclamacao->ID_Reclamacao;
            $notificacaoVendedor->UtilizadorID_User = $compra->UtilizadorID_Vendedor;
            $notificacaoVendedor->ReferenciaTipoID_ReferenciaTipo = 4; // Assuming 4 is for "Reclamação"
            $notificacaoVendedor->TIpo_notificacaoID_TipoNotificacao = 1; // Assuming 1 is "Nova Reclamação"
            $notificacaoVendedor->save();

            // For admins
            $admins = Utilizador::where('TipoUtilizadorID_TipoUtilizador', 1)->get(); // Assuming 1 is admin type
            foreach ($admins as $admin) {
                $notificacaoAdmin = new Notificacao();
                $notificacaoAdmin->Mensagem = "Nova reclamação necessita moderação";
                $notificacaoAdmin->DataNotificacao = now();
                $notificacaoAdmin->ReferenciaID = $reclamacao->ID_Reclamacao;
                $notificacaoAdmin->UtilizadorID_User = $admin->ID_Utilizador;
                $notificacaoAdmin->ReferenciaTipoID_ReferenciaTipo = 4; // Assuming 4 is for "Reclamação"
                $notificacaoAdmin->TIpo_notificacaoID_TipoNotificacao = 1; // Assuming 1 is "Nova Reclamação"
                $notificacaoAdmin->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Reclamação criada com sucesso',
                'reclamacao' => $reclamacao
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao criar reclamação: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'compra_id' => $request->compraId ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao criar reclamação',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /** 
     * Li   star reclamações (com base no papel do usuário)
     */
    public function index()
    {
        $user = Auth::user();
        $query = Reclamacao::with([
            'aprovacao',
            'status',
            'compras.anuncio.utilizador',
            'compras.utilizador'
        ]);

        // Se for admin, vê todas as reclamações
        if ($user->TipoUserID_TipoUser === 1) {
            $reclamacoes = $query->get();
        } else {
            // Se for usuário normal, vê apenas suas reclamações (como comprador ou vendedor)
            $reclamacoes = $query->whereHas('compras', function ($q) use ($user) {
                $q->where('UtilizadorID_User', $user->ID_User)
                  ->orWhereHas('anuncio', function ($q2) use ($user) {
                      $q2->where('UtilizadorID_User', $user->ID_User);
                  });
            })->get();
        }

        return response()->json($reclamacoes);
    }

    /**
     * Listar todas as reclamações (apenas para administradores)
     */
    public function indexAdmin()
    {
        $user = Auth::user();
        
        // Verificar se o usuário é administrador
        if ($user->TipoUserID_TipoUser !== 1) {
            return response()->json([
                'message' => 'Acesso negado. Apenas administradores podem visualizar todas as reclamações.'
            ], 403);
        }
        
        // Obter todas as reclamações com os relacionamentos
        $reclamacoes = Reclamacao::with([
            'aprovacao',
            'status',
            'compras.anuncio.utilizador',
            'compras.utilizador'
        ])->orderBy('DataReclamacao', 'desc')->get();
        
        return response()->json([
            'message' => 'Reclamações recuperadas com sucesso',
            'total' => $reclamacoes->count(),
            'reclamacoes' => $reclamacoes
        ]);
    }

    /**
     * Adicionar mensagem à reclamação
     */
    public function addMensagem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'mensagem' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $reclamacao = Reclamacao::with(['compras.anuncio.utilizador', 'compras.utilizador'])->find($id);
            
            if (!$reclamacao) {
                return response()->json(['message' => 'Reclamação não encontrada'], 404);
            }

            $user = Auth::user();
            $compra = $reclamacao->compras->first();

            // Verificar se o usuário tem permissão para adicionar mensagem
            $isAdmin = $user->TipoUserID_TipoUser === 1;
            $isComprador = $compra->UtilizadorID_User === $user->ID_User;
            $isVendedor = $compra->anuncio->UtilizadorID_User === $user->ID_User;

            if (!$isAdmin && !$isComprador && !$isVendedor) {
                return response()->json([
                    'message' => 'Você não tem permissão para adicionar mensagens a esta reclamação'
                ], 403);
            }

            // Adicionar mensagem à aprovação
            $aprovacao = $reclamacao->aprovacao;
            $aprovacao->Comentario = ($aprovacao->Comentario ? $aprovacao->Comentario . "\n" : '') . 
                                   now()->format('Y-m-d H:i:s') . " - " . $user->Name . ": " . $request->mensagem;
            $aprovacao->save();

            // Notificar outros participantes
            $participantes = collect([$compra->UtilizadorID_User, $compra->anuncio->UtilizadorID_User]);
            
            if ($isAdmin) {
                // Se for admin, notifica comprador e vendedor
                $notificarIds = $participantes;
            } else {
                // Se for comprador ou vendedor, notifica admin e a outra parte
                $admins = DB::table('utilizador')->where('TipoUserID_TipoUser', 1)->pluck('ID_User');
                $notificarIds = $admins->merge($participantes->filter(fn($id) => $id !== $user->ID_User));
            }

            foreach ($notificarIds as $userId) {
                $notificacao = new Notificacao();
                $notificacao->Mensagem = "Nova mensagem na reclamação #" . $reclamacao->ID_Reclamacao;
                $notificacao->DataNotificacao = now();
                $notificacao->ReferenciaID = $reclamacao->ID_Reclamacao;
                $notificacao->UtilizadorID_User = $userId;
                $notificacao->ReferenciaTipoID_ReferenciaTipo = 4; // Tipo Reclamação
                $notificacao->TIpo_notificacaoID_TipoNotificacao = 2; // Nova Mensagem
                $notificacao->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Mensagem adicionada com sucesso',
                'reclamacao' => $reclamacao->fresh(['aprovacao'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao adicionar mensagem: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Atualizar status da reclamação (apenas admin)
     */
    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->TipoUserID_TipoUser !== 1) {
            return response()->json(['message' => 'Apenas administradores podem atualizar o status'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status_id' => 'required|exists:status_reclamacao,ID_Status_Reclamacao'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Status inválido',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $reclamacao = Reclamacao::with(['compras.anuncio.utilizador', 'compras.utilizador'])->find($id);
            
            if (!$reclamacao) {
                return response()->json(['message' => 'Reclamação não encontrada'], 404);
            }

            $compra = $reclamacao->compras->first();
            $statusAnterior = $reclamacao->Status_ReclamacaoID_Status_Reclamacao;
            $novoStatus = $request->status_id;

            // Atualizar o status da reclamação
            $reclamacao->Status_ReclamacaoID_Status_Reclamacao = $novoStatus;
            $reclamacao->save();

            // Processar consequências com base no novo status
            if ($novoStatus == 3) { // Reclamação Resolvida/Aceita
                // Adicionar um comentário ao registro de aprovação
                $aprovacao = $reclamacao->aprovacao;
                $aprovacao->Comentario = ($aprovacao->Comentario ? $aprovacao->Comentario . "\n" : '') . 
                                       now()->format('Y-m-d H:i:s') . " - SISTEMA: Reclamação foi aceita pelo administrador. A compra foi marcada como problemática.";
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->UtilizadorID_Admin = Auth::id();
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 2; // Aprovado
                $aprovacao->save();

                // TODO: Marcar a compra como problemática (adicione esta funcionalidade se existir um campo para isso)
                // $compra->Status_CompraID_Status_Compra = 5; // Status problemático/devolvido
                // $compra->save();
            } 
            else if ($novoStatus == 4) { // Reclamação Rejeitada
                // Adicionar um comentário ao registro de aprovação
                $aprovacao = $reclamacao->aprovacao;
                $aprovacao->Comentario = ($aprovacao->Comentario ? $aprovacao->Comentario . "\n" : '') . 
                                       now()->format('Y-m-d H:i:s') . " - SISTEMA: Reclamação foi rejeitada pelo administrador. A compra continua válida.";
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->UtilizadorID_Admin = Auth::id();
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 3; // Rejeitado
                $aprovacao->save();
            }

            // Notificar comprador e vendedor
            $participantes = [
                $compra->UtilizadorID_User,
                $compra->anuncio->UtilizadorID_User
            ];

            foreach ($participantes as $userId) {
                $notificacao = new Notificacao();
                $notificacao->Mensagem = "O status da reclamação #" . $reclamacao->ID_Reclamacao . " foi atualizado para " . 
                                        ($novoStatus == 3 ? "ACEITA" : ($novoStatus == 4 ? "REJEITADA" : "atualizado"));
                $notificacao->DataNotificacao = now();
                $notificacao->ReferenciaID = $reclamacao->ID_Reclamacao;
                $notificacao->UtilizadorID_User = $userId;
                $notificacao->ReferenciaTipoID_ReferenciaTipo = 4; // Tipo Reclamação
                $notificacao->TIpo_notificacaoID_TipoNotificacao = 5; // Atualização de Status
                $notificacao->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Status da reclamação atualizado com sucesso',
                'reclamacao' => $reclamacao,
                'processamento' => $novoStatus == 3 ? 'Reclamação aceita. Compra marcada como problemática.' :
                                  ($novoStatus == 4 ? 'Reclamação rejeitada. Compra continua válida.' : 'Status atualizado.')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obter detalhes de uma reclamação específica
     */
    public function show($id)
    {
        $reclamacao = Reclamacao::with([
            'aprovacao',
            'status',
            'compras.anuncio.utilizador',
            'compras.utilizador'
        ])->find($id);

        if (!$reclamacao) {
            return response()->json(['message' => 'Reclamação não encontrada'], 404);
        }

        $user = Auth::user();
        $compra = $reclamacao->compras->first();

        // Verificar permissão
        $isAdmin = $user->TipoUserID_TipoUser === 1;
        $isComprador = $compra->UtilizadorID_User === $user->ID_User;
        $isVendedor = $compra->anuncio->UtilizadorID_User === $user->ID_User;

        if (!$isAdmin && !$isComprador && !$isVendedor) {
            return response()->json([
                'message' => 'Você não tem permissão para ver esta reclamação'
            ], 403);
        }

        return response()->json($reclamacao);
    }

    /**
     * Get messages for a complaint
     */
    public function getMensagens($id)
    {
        try {
            $reclamacao = Reclamacao::with(['compras.anuncio.utilizador', 'compras.utilizador', 'aprovacao'])->find($id);
            
            if (!$reclamacao) {
                return response()->json(['message' => 'Reclamação não encontrada'], 404);
            }

            $user = Auth::user();
            $compra = $reclamacao->compras->first();

            // Check if user has permission to view messages
            $isAdmin = $user->TipoUserID_TipoUser === 1;
            $isComprador = $compra->UtilizadorID_User === $user->ID_User;
            $isVendedor = $compra->anuncio->UtilizadorID_User === $user->ID_User;

            if (!$isAdmin && !$isComprador && !$isVendedor) {
                return response()->json([
                    'message' => 'Você não tem permissão para ver as mensagens desta reclamação'
                ], 403);
            }

            // Parse messages from the Comentario field
            $comentario = $reclamacao->aprovacao->Comentario ?? '';
            $mensagens = [];
            
            if ($comentario) {
                $linhas = explode("\n", $comentario);
                foreach ($linhas as $linha) {
                    if (preg_match('/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) - ([^:]+): (.+)$/', $linha, $matches)) {
                        $mensagens[] = [
                            'data' => $matches[1],
                            'usuario' => $matches[2],
                            'mensagem' => $matches[3]
                        ];
                    }
                }
            }

            return response()->json([
                'mensagens' => $mensagens,
                'reclamacao' => $reclamacao
            ]);

        } catch (\Exception $e) {
            \Log::error('Erro ao buscar mensagens da reclamação: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'reclamacao_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao buscar mensagens da reclamação',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get participants of a complaint
     */
    public function getParticipantes($id)
    {
        try {
            $reclamacao = Reclamacao::with(['compras.anuncio.utilizador', 'compras.utilizador'])->find($id);
            
            if (!$reclamacao) {
                return response()->json(['message' => 'Reclamação não encontrada'], 404);
            }

            $user = Auth::user();
            $compra = $reclamacao->compras->first();

            // Check if user has permission
            $isAdmin = $user->TipoUserID_TipoUser === 1;
            $isComprador = $compra->UtilizadorID_User === $user->ID_User;
            $isVendedor = $compra->anuncio->UtilizadorID_User === $user->ID_User;

            if (!$isAdmin && !$isComprador && !$isVendedor) {
                return response()->json([
                    'message' => 'Você não tem permissão para ver os participantes desta reclamação'
                ], 403);
            }

            // Get participants info
            $participantes = [
                'admin' => [
                    'tipo' => 'admin',
                    'nome' => 'Administrador'
                ],
                'comprador' => [
                    'tipo' => 'comprador',
                    'nome' => $compra->utilizador->Name,
                    'id' => $compra->utilizador->ID_User
                ],
                'vendedor' => [
                    'tipo' => 'vendedor',
                    'nome' => $compra->anuncio->utilizador->Name,
                    'id' => $compra->anuncio->utilizador->ID_User
                ]
            ];

            return response()->json($participantes);

        } catch (\Exception $e) {
            \Log::error('Erro ao buscar participantes da reclamação: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'reclamacao_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao buscar participantes da reclamação',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 