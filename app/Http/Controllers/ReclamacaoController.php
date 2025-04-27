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
        // Versão simplificada com diagnóstico
        try {
            // Debug detalhado de autenticação
            \Log::info('=== Diagnóstico de Autenticação ===', [
                'IsAuthenticated' => Auth::check(),
                'UserID' => Auth::id(),
                'RequestUser' => $request->user(),
                'AuthHeader' => $request->header('Authorization'),
                'AllHeaders' => $request->headers->all()
            ]);
            
            // Debug de autenticação
            file_put_contents(
                storage_path('logs/debug_reclamacao.log'), 
                date('Y-m-d H:i:s') . ' - Auth Debug: ' . 
                'IsAuthenticated: ' . (Auth::check() ? 'true' : 'false') . 
                ', UserID: ' . (Auth::id() ?? 'null') . 
                ', Request User: ' . json_encode($request->user()) . PHP_EOL,
                FILE_APPEND
            );
            
            // Log para verificar dados recebidos
            file_put_contents(
                storage_path('logs/debug_reclamacao.log'), 
                date('Y-m-d H:i:s') . ' - Requisição recebida: ' . json_encode($request->all()) . PHP_EOL,
                FILE_APPEND
            );
            
            // Validação básica
            if (empty($request->compraId) || empty($request->descricao)) {
                return response()->json([
                    'message' => 'Campos compraId e descricao são obrigatórios'
                ], 400);
            }
            
            // Busca direta pelo ID da compra
            $compraId = $request->compraId;
            
            // Verificar se a compra existe
            $compraExiste = DB::table('compra')->where('ID_Compra', $compraId)->exists();
            
            if (!$compraExiste) {
                return response()->json([
                    'message' => 'Compra não encontrada'
                ], 404);
            }
            
            // Verificar se o usuário autenticado é o comprador
            $compra = DB::table('compra')
                ->where('ID_Compra', $compraId)
                ->first();
                
            file_put_contents(
                storage_path('logs/debug_reclamacao.log'), 
                date('Y-m-d H:i:s') . ' - Verificando permissão: ' . 
                'UserID: ' . Auth::id() . 
                ', CompradorID: ' . $compra->UtilizadorID_User . PHP_EOL,
                FILE_APPEND
            );
            
            // Obter o ID numérico do usuário autenticado
            $userId = Auth::user()->ID_User;
            
            file_put_contents(
                storage_path('logs/debug_reclamacao.log'), 
                date('Y-m-d H:i:s') . ' - Usuário autenticado ID: ' . $userId . PHP_EOL,
                FILE_APPEND
            );
            
            if ($compra->UtilizadorID_User != $userId) {
                return response()->json([
                    'message' => 'Você não tem permissão para criar uma reclamação para esta compra'
                ], 403);
            }
            
            file_put_contents(
                storage_path('logs/debug_reclamacao.log'), 
                date('Y-m-d H:i:s') . ' - Compra encontrada, id: ' . $compraId . PHP_EOL,
                FILE_APPEND
            );
            
            // Verificar se já existe uma reclamação para esta compra
            try {
                $reclamacaoExiste = DB::table('compra_reclamacao')
                    ->where('CompraID_Compra', $compraId)
                    ->exists();
                    
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Verificação de reclamação existente concluída: ' . ($reclamacaoExiste ? 'Sim' : 'Não') . PHP_EOL,
                    FILE_APPEND
                );
                
                if ($reclamacaoExiste) {
                    return response()->json([
                        'message' => 'Já existe uma reclamação para esta compra'
                    ], 400);
                }
            } catch (\Exception $e) {
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Erro ao verificar reclamação existente: ' . $e->getMessage() . PHP_EOL,
                    FILE_APPEND
                );
                
                return response()->json([
                    'message' => 'Erro ao verificar reclamações existentes',
                    'erro' => $e->getMessage()
                ], 500);
            }
            
            // Agora vamos criar a reclamação e suas dependências
            try {
                DB::beginTransaction();
                
                // 1. Criar aprovação
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Iniciando criação de aprovação' . PHP_EOL,
                    FILE_APPEND
                );
                
                $aprovacaoId = DB::table('aprovacao')->insertGetId([
                    'Data_Submissao' => now(),
                    'Status_AprovacaoID_Status_Aprovacao' => 1,
                    'UtilizadorID_Admin' => $userId
                ]);
                
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Aprovação criada com ID: ' . $aprovacaoId . PHP_EOL,
                    FILE_APPEND
                );
                
                // 2. Criar reclamação
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Iniciando criação de reclamação' . PHP_EOL,
                    FILE_APPEND
                );
                
                $reclamacaoId = DB::table('reclamacao')->insertGetId([
                    'Descricao' => $request->descricao,
                    'DataReclamacao' => now(),
                    'AprovacaoID_aprovacao' => $aprovacaoId,
                    'Status_ReclamacaoID_Status_Reclamacao' => 1
                ]);
                
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Reclamação criada com ID: ' . $reclamacaoId . PHP_EOL,
                    FILE_APPEND
                );
                
                // 3. Criar relação entre compra e reclamação
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Iniciando criação de relação compra-reclamação' . PHP_EOL,
                    FILE_APPEND
                );
                
                DB::table('compra_reclamacao')->insert([
                    'CompraID_Compra' => $compraId,
                    'ReclamacaoID_Reclamacao' => $reclamacaoId
                ]);
                
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Relação criada com sucesso' . PHP_EOL,
                    FILE_APPEND
                );

            DB::commit();
                
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Transação concluída com sucesso' . PHP_EOL,
                    FILE_APPEND
                );

            return response()->json([
                'message' => 'Reclamação criada com sucesso',
                    'reclamacao_id' => $reclamacaoId,
                    'aprovacao_id' => $aprovacaoId,
                    'compra_id' => $compraId
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
                
                file_put_contents(
                    storage_path('logs/debug_reclamacao.log'), 
                    date('Y-m-d H:i:s') . ' - Erro na criação: ' . $e->getMessage() . ' na linha ' . $e->getLine() . PHP_EOL,
                    FILE_APPEND
                );
                
                return response()->json([
                    'message' => 'Erro ao criar reclamação',
                    'erro' => $e->getMessage(),
                    'linha' => $e->getLine(),
                    'arquivo' => $e->getFile()
                ], 500);
            }
        } catch (\Exception $e) {
            file_put_contents(
                storage_path('logs/debug_reclamacao.log'), 
                date('Y-m-d H:i:s') . ' - Erro geral: ' . $e->getMessage() . ' na linha ' . $e->getLine() . PHP_EOL,
                FILE_APPEND
            );
            
            return response()->json([
                'message' => 'Erro ao processar reclamação',
                'erro_detalhado' => $e->getMessage(),
                'linha' => $e->getLine(),
                'arquivo' => $e->getFile()
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
            $reclamacao = Reclamacao::with(['compras.anuncio.utilizador', 'compras.utilizador', 'aprovacao'])->find($id);
            
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
                $notificacao->TIpo_notificacaoID_TipoNotificacao = 5; // Mensagem
                $notificacao->Estado_notificacaoID_estado_notificacao = 1; // Não lida
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
     * Atualizar status da reclamação
     */
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        
        $validator = Validator::make($request->all(), [
            'status_id' => 'required|in:3,4' // Apenas permitir Resolvida (3) ou Rejeitada (4)
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Status inválido. Apenas é possível resolver ou rejeitar a reclamação.',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $reclamacao = Reclamacao::with(['compras.anuncio.utilizador', 'compras.utilizador', 'aprovacao'])->find($id);
            
            if (!$reclamacao) {
                return response()->json(['message' => 'Reclamação não encontrada'], 404);
            }

            $compra = $reclamacao->compras->first();
            
            // Apenas admin pode resolver/rejeitar reclamações
            if ($user->TipoUserID_TipoUser !== 1) {
                return response()->json([
                    'message' => 'Apenas administradores podem resolver ou rejeitar reclamações'
                ], 403);
            }

            $novoStatus = $request->status_id;

            // Atualizar o status da reclamação
            $reclamacao->Status_ReclamacaoID_Status_Reclamacao = $novoStatus;
            $reclamacao->save();

            // Atualizar aprovação
            $aprovacao = $reclamacao->aprovacao;
            
            if ($novoStatus == 3) { // Resolvida (Aprovada)
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 2; // Aprovada
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->save();
                
                if ($compra && $compra->anuncio) {
                    // Inativar o anúncio
                    app(AnuncioController::class)->marcarComoProblematico($compra->anuncio->ID_Anuncio);

                    // Notificar o comprador
                    $notificacaoComprador = new Notificacao();
                    $notificacaoComprador->Mensagem = "O anúncio '{$compra->anuncio->Titulo}' foi inativado pois sua reclamação foi aprovada.";
                    $notificacaoComprador->DataNotificacao = now();
                    $notificacaoComprador->ReferenciaID = $compra->ID_Compra;
                    $notificacaoComprador->UtilizadorID_User = $compra->UtilizadorID_User;
                    $notificacaoComprador->ReferenciaTipoID_ReferenciaTipo = 6; // Compra
                    $notificacaoComprador->TIpo_notificacaoID_TipoNotificacao = 8; // Compra
                    $notificacaoComprador->Estado_notificacaoID_estado_notificacao = 1; // Não Lida
                    $notificacaoComprador->save();
                }
            } 
            else { // Rejeitada
                $aprovacao->Status_AprovacaoID_Status_Aprovacao = 3; // Rejeitada
                $aprovacao->Data_Aprovacao = now();
                $aprovacao->save();

                if ($compra && $compra->anuncio) {
                    // Notificar o comprador
                    $notificacaoComprador = new Notificacao();
                    $notificacaoComprador->Mensagem = "Sua reclamação sobre o anúncio '{$compra->anuncio->Titulo}' foi rejeitada.";
                    $notificacaoComprador->DataNotificacao = now();
                    $notificacaoComprador->ReferenciaID = $compra->ID_Compra;
                    $notificacaoComprador->UtilizadorID_User = $compra->UtilizadorID_User;
                    $notificacaoComprador->ReferenciaTipoID_ReferenciaTipo = 6; // Compra
                    $notificacaoComprador->TIpo_notificacaoID_TipoNotificacao = 8; // Compra
                    $notificacaoComprador->Estado_notificacaoID_estado_notificacao = 1; // Não Lida
                    $notificacaoComprador->save();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Status da reclamação atualizado com sucesso',
                'reclamacao' => $reclamacao->fresh(['aprovacao', 'compras'])
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