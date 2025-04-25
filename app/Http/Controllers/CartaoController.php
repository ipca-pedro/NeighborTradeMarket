<?php

namespace App\Http\Controllers;

use App\Models\Cartao;
use App\Models\Utilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartaoController extends Controller
{
    /**
     * Listar cartões do utilizador
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $cartoes = Cartao::whereHas('utilizadores', function($query) use ($user) {
                $query->where('ID_User', $user->ID_User);
            })->get();

            return response()->json($cartoes);
        } catch (\Exception $e) {
            \Log::error('Erro ao listar cartões: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao listar cartões',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Adicionar novo cartão
     */
    public function store(Request $request)
    {
        \Log::info('Requisição para adicionar cartão:', [
            'payload' => $request->all(),
            'user_id' => Auth::id()
        ]);
        
        $validator = Validator::make($request->all(), [
            'Numero' => 'required|string|size:16',
            'CVC' => 'required|string|size:3',
            'Data' => 'required|date|after:today'
        ]);

        if ($validator->fails()) {
            \Log::error('Validação falhou ao adicionar cartão:', [
                'errors' => $validator->errors()->toArray()
            ]);
            
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user = Auth::user();
            if (!$user) {
                throw new \Exception('Usuário não autenticado');
            }
            
            \Log::info('Usuário autenticado:', [
                'user_id' => $user->ID_User
            ]);

            // Criar novo cartão
            $cartao = new Cartao([
                'Numero' => $request->Numero,
                'CVC' => $request->CVC,
                'Data' => $request->Data
            ]);
            
            \Log::info('Novo cartão criado:', [
                'numero' => $cartao->Numero,
                'cvc' => $cartao->CVC,
                'data' => $cartao->Data
            ]);
            
            $cartao->save();
            
            \Log::info('Cartão salvo no banco:', [
                'id_cartao' => $cartao->ID_Cartao
            ]);

            // Associar cartão ao utilizador
            $user->cartaoID_Cartao = $cartao->ID_Cartao;
            $user->save();
            
            \Log::info('Cartão associado ao usuário');

            DB::commit();

            return response()->json([
                'message' => 'Cartão adicionado com sucesso',
                'cartao' => $cartao
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao adicionar cartão: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao adicionar cartão',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remover cartão
     */
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $user = Auth::user();
            $cartao = Cartao::findOrFail($id);

            // Verificar se o cartão pertence ao utilizador
            if ($user->cartaoID_Cartao !== $cartao->ID_Cartao) {
                return response()->json([
                    'message' => 'Cartão não encontrado'
                ], 404);
            }

            // Remover associação do cartão com o utilizador
            $user->cartaoID_Cartao = null;
            $user->save();

            // Remover cartão
            $cartao->delete();

            DB::commit();

            return response()->json([
                'message' => 'Cartão removido com sucesso'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao remover cartão: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erro ao remover cartão',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
} 