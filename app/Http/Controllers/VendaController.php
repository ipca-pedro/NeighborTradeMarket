<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VendaController extends Controller
{
    /**
     * Listar vendas do usuário autenticado
     */
    public function minhasVendas()
    {
        $user = Auth::user();

        $vendas = Compra::with(['anuncio', 'comprador'])
            ->whereHas('anuncio', function ($query) use ($user) {
                $query->where('UtilizadorID_User', $user->ID_User);
            })
            ->orderBy('Data_compra', 'desc')
            ->get();

        return response()->json($vendas);
    }

    /**
     * Confirmar uma venda
     */
    public function confirmarVenda($id)
    {
        try {
            $user = Auth::user();
            
            $venda = Compra::with('anuncio')
                ->whereHas('anuncio', function ($query) use ($user) {
                    $query->where('UtilizadorID_User', $user->ID_User);
                })
                ->where('ID_Compra', $id)
                ->firstOrFail();

            if ($venda->StatusID_Status !== 1) { // Se não estiver pendente
                return response()->json([
                    'error' => 'Esta venda não pode ser confirmada pois não está pendente'
                ], 400);
            }

            DB::beginTransaction();

            // Atualizar status da compra para confirmado (2)
            $venda->StatusID_Status = 2;
            $venda->save();

            // Criar notificação para o comprador
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Sua compra #' . $id . ' foi confirmada pelo vendedor',
                'DataNotificacao' => now(),
                'ReferenciaID' => $venda->ID_Compra,
                'UtilizadorID_User' => $venda->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 2, // Tipo Compra
                'TIpo_notificacaoID_TipoNotificacao' => 2 // Confirmação de compra
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Venda confirmada com sucesso'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Erro ao confirmar venda: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marcar uma venda como enviada
     */
    public function marcarComoEnviado($id)
    {
        try {
            $user = Auth::user();
            
            $venda = Compra::with('anuncio')
                ->whereHas('anuncio', function ($query) use ($user) {
                    $query->where('UtilizadorID_User', $user->ID_User);
                })
                ->where('ID_Compra', $id)
                ->firstOrFail();

            if ($venda->StatusID_Status !== 2) { // Se não estiver confirmado
                return response()->json([
                    'error' => 'Esta venda não pode ser marcada como enviada pois não está confirmada'
                ], 400);
            }

            DB::beginTransaction();

            // Atualizar status da compra para enviado (3)
            $venda->StatusID_Status = 3;
            $venda->save();

            // Criar notificação para o comprador
            DB::table('Notificacao')->insert([
                'Mensagem' => 'Sua compra #' . $id . ' foi enviada pelo vendedor',
                'DataNotificacao' => now(),
                'ReferenciaID' => $venda->ID_Compra,
                'UtilizadorID_User' => $venda->UtilizadorID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 2, // Tipo Compra
                'TIpo_notificacaoID_TipoNotificacao' => 3 // Envio de produto
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Venda marcada como enviada com sucesso'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Erro ao marcar venda como enviada: ' . $e->getMessage()
            ], 500);
        }
    }
} 