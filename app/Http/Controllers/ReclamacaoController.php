<?php

namespace App\Http\Controllers;

use App\Models\Reclamacao;
use App\Models\Compra;
use App\Models\Aprovacao;
use App\Models\Notificacao;
use App\Models\StatusReclamacao;
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
        $validator = Validator::make($request->all(), [
            'compra_id' => 'required|exists:compra,ID_Compra',
            'descricao' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Verificar se o usuário é o comprador
            $compra = Compra::with('anuncio.utilizador')->find($request->compra_id);
            if (!$compra || $compra->UtilizadorID_User !== Auth::id()) {
                return response()->json([
                    'message' => 'Você não tem permissão para criar uma reclamação para esta compra'
                ], 403);
            }

            // Criar aprovação (pendente)
            $aprovacao = new Aprovacao();
            $aprovacao->Data_Submissao = now();
            $aprovacao->Status_AprovacaoID_Status_Aprovacao = 1; // Pendente
            $aprovacao->save();

            // Criar reclamação
            $reclamacao = new Reclamacao();
            $reclamacao->Descricao = $request->descricao;
            $reclamacao->DataReclamacao = now();
            $reclamacao->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $reclamacao->Status_ReclamacaoID_Status_Reclamacao = 1; // Recebida
            $reclamacao->save();

            // Vincular reclamação à compra
            DB::table('compra_reclamacao')->insert([
                'CompraID_Compra' => $request->compra_id,
                'ReclamacaoID_Reclamacao' => $reclamacao->ID_Reclamacao
            ]);

            // Criar notificação para o vendedor
            $notificacaoVendedor = new Notificacao();
            $notificacaoVendedor->Mensagem = "Nova reclamação recebida para sua venda";
            $notificacaoVendedor->DataNotificacao = now();
            $notificacaoVendedor->ReferenciaID = $reclamacao->ID_Reclamacao;
            $notificacaoVendedor->UtilizadorID_User = $compra->anuncio->utilizador->ID_User;
            $notificacaoVendedor->ReferenciaTipoID_ReferenciaTipo = 4; // Tipo Reclamação
            $notificacaoVendedor->TIpo_notificacaoID_TipoNotificacao = 1; // Nova Reclamação
            $notificacaoVendedor->save();

            // Criar notificação para os admins
            $admins = DB::table('utilizador')
                ->where('TipoUserID_TipoUser', 1)
                ->get();

            foreach ($admins as $admin) {
                $notificacaoAdmin = new Notificacao();
                $notificacaoAdmin->Mensagem = "Nova reclamação necessita de moderação";
                $notificacaoAdmin->DataNotificacao = now();
                $notificacaoAdmin->ReferenciaID = $reclamacao->ID_Reclamacao;
                $notificacaoAdmin->UtilizadorID_User = $admin->ID_User;
                $notificacaoAdmin->ReferenciaTipoID_ReferenciaTipo = 4; // Tipo Reclamação
                $notificacaoAdmin->TIpo_notificacaoID_TipoNotificacao = 1; // Nova Reclamação
                $notificacaoAdmin->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Reclamação criada com sucesso',
                'reclamacao' => $reclamacao
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao criar reclamação: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar reclamações (com base no papel do usuário)
     */
    public function index()
    {
        $user = Auth::user();
        $query = Reclamacao::with([
            'aprovacao',
            'status_reclamacao',
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

            $reclamacao->Status_ReclamacaoID_Status_Reclamacao = $request->status_id;
            $reclamacao->save();

            // Notificar comprador e vendedor
            $compra = $reclamacao->compras->first();
            $participantes = [
                $compra->UtilizadorID_User,
                $compra->anuncio->UtilizadorID_User
            ];

            foreach ($participantes as $userId) {
                $notificacao = new Notificacao();
                $notificacao->Mensagem = "O status da reclamação #" . $reclamacao->ID_Reclamacao . " foi atualizado";
                $notificacao->DataNotificacao = now();
                $notificacao->ReferenciaID = $reclamacao->ID_Reclamacao;
                $notificacao->UtilizadorID_User = $userId;
                $notificacao->ReferenciaTipoID_ReferenciaTipo = 4; // Tipo Reclamação
                $notificacao->TIpo_notificacaoID_TipoNotificacao = 3; // Atualização de Status
                $notificacao->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Status da reclamação atualizado com sucesso',
                'reclamacao' => $reclamacao
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
            'status_reclamacao',
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
} 