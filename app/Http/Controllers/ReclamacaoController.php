<?php

namespace App\Http\Controllers;

use App\Models\Reclamacao;
use App\Models\Compra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReclamacaoController extends Controller
{
    /**
     * Criar uma nova reclamação para uma compra
     */
    public function store(Request $request, $compraId)
    {
        try {
            $request->validate([
                'descricao' => 'required|string|max:255',
            ]);

            $user = Auth::user();
            
            // Verificar se a compra existe e pertence ao usuário
            $compra = Compra::where('ID_Compra', $compraId)
                ->where('UtilizadorID_User', $user->ID_User)
                ->firstOrFail();

            // Verificar se já existe uma reclamação para esta compra
            $reclamacaoExistente = DB::table('Compra_Reclamacao')
                ->where('CompraID_Compra', $compraId)
                ->exists();

            if ($reclamacaoExistente) {
                return response()->json([
                    'error' => 'Já existe uma reclamação para esta compra'
                ], 400);
            }

            DB::beginTransaction();

            // Criar a reclamação
            $reclamacao = new Reclamacao();
            $reclamacao->Descricao = $request->descricao;
            $reclamacao->DataReclamacao = now();
            $reclamacao->Status_ReclamacaoID_Status_Reclamacao = 1; // Status inicial (Pendente)
            $reclamacao->AprovacaoID_aprovacao = 1; // Aprovação inicial (Pendente)
            $reclamacao->save();

            // Criar a relação entre compra e reclamação
            DB::table('Compra_Reclamacao')->insert([
                'CompraID_Compra' => $compraId,
                'ReclamacaoID_Reclamacao' => $reclamacao->ID_Reclamacao
            ]);

            // Criar notificação para o vendedor
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Nova reclamação recebida para a compra #' . $compraId,
                'DataNotificacao' => now(),
                'ReferenciaID' => $reclamacao->ID_Reclamacao,
                'UtilizadorID_User' => $compra->anuncio->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 4, // Tipo Reclamação
                'TIpo_notificacaoID_TipoNotificacao' => 5 // Nova reclamação
            ]);

            // Criar notificação para o admin
            $admins = DB::table('Utilizador')
                ->where('TipoUtilizadorID_TipoUtilizador', 1) // Assumindo que 1 é o ID para admin
                ->get();

            foreach ($admins as $admin) {
                DB::table('Notificacao')->insert([
                    'Mensagem' => 'Nova reclamação para análise - Compra #' . $compraId,
                    'DataNotificacao' => now(),
                    'ReferenciaID' => $reclamacao->ID_Reclamacao,
                    'UtilizadorID_User' => $admin->ID_User,
                    'ReferenciaTipoID_ReferenciaTipo' => 4, // Tipo Reclamação
                    'TIpo_notificacaoID_TipoNotificacao' => 5 // Nova reclamação
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Reclamação criada com sucesso',
                'reclamacao' => $reclamacao
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Erro ao criar reclamação: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar reclamações do usuário
     */
    public function minhasReclamacoes()
    {
        $user = Auth::user();

        $reclamacoes = DB::table('Reclamacao')
            ->join('Compra_Reclamacao', 'Reclamacao.ID_Reclamacao', '=', 'Compra_Reclamacao.ReclamacaoID_Reclamacao')
            ->join('Compra', 'Compra_Reclamacao.CompraID_Compra', '=', 'Compra.ID_Compra')
            ->join('Status_Reclamacao', 'Reclamacao.Status_ReclamacaoID_Status_Reclamacao', '=', 'Status_Reclamacao.ID_Status_Reclamacao')
            ->where('Compra.UtilizadorID_User', $user->ID_User)
            ->select(
                'Reclamacao.*',
                'Status_Reclamacao.Descricao_status_reclamacao as status',
                'Compra.ID_Compra as compra_id'
            )
            ->orderBy('Reclamacao.DataReclamacao', 'desc')
            ->get();

        return response()->json($reclamacoes);
    }
} 