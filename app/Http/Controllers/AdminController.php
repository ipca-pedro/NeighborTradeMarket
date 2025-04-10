<?php

namespace App\Http\Controllers;

use App\Models\Utilizador;
use App\Models\Aprovacao;
use App\Models\StatusUtilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Listar utilizadores pendentes de aprovação
     */
    public function getPendingUsers()
    {
        // Verificar se o utilizador autenticado é administrador
        $user = Auth::user();
        if ($user->TipoUserID_TipoUser != 1) { // Assumindo que 1 é o ID para administradores
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        // Buscar utilizadores pendentes (status 1 = pendente)
        $pendingUsers = Utilizador::where('Status_UtilizadorID_status_utilizador', 1)
            ->with(['morada', 'imagem'])
            ->get();
            
        return response()->json($pendingUsers);
    }
    
    /**
     * Aprovar um utilizador
     */
    public function approveUser(Request $request, $userId)
    {
        // Verificar se o utilizador autenticado é administrador
        $user = Auth::user();
        if ($user->TipoUserID_TipoUser != 1) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        DB::beginTransaction();
        
        try {
            // Buscar o utilizador a ser aprovado
            $targetUser = Utilizador::find($userId);
            
            if (!$targetUser) {
                return response()->json([
                    'message' => 'Utilizador não encontrado'
                ], 404);
            }
            
            // Verificar se o utilizador já está aprovado
            if ($targetUser->Status_UtilizadorID_status_utilizador == 2) {
                return response()->json([
                    'message' => 'Utilizador já está aprovado'
                ], 400);
            }
            
            // Criar registro de aprovação
            $aprovacao = new Aprovacao([
                'Data_Aprovacao' => now(),
                'UtilizadorID_Admin' => $user->ID_User
            ]);
            
            $aprovacao->save();
            
            // Atualizar o utilizador
            $targetUser->Status_UtilizadorID_status_utilizador = 2; // 2 = Aprovado
            $targetUser->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $targetUser->save();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Utilizador aprovado com sucesso'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao aprovar utilizador: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Rejeitar um utilizador
     */
    public function rejectUser(Request $request, $userId)
    {
        // Verificar se o utilizador autenticado é administrador
        $user = Auth::user();
        if ($user->TipoUserID_TipoUser != 1) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        $request->validate([
            'motivo' => 'required|string'
        ]);
        
        DB::beginTransaction();
        
        try {
            // Buscar o utilizador a ser rejeitado
            $targetUser = Utilizador::find($userId);
            
            if (!$targetUser) {
                return response()->json([
                    'message' => 'Utilizador não encontrado'
                ], 404);
            }
            
            // Verificar se o utilizador já está aprovado
            if ($targetUser->Status_UtilizadorID_status_utilizador == 2) {
                return response()->json([
                    'message' => 'Utilizador já está aprovado e não pode ser rejeitado'
                ], 400);
            }
            
            // Criar registro de rejeição (usando a mesma tabela de aprovação)
            $aprovacao = new Aprovacao([
                'Data_Aprovacao' => now(),
                'UtilizadorID_Admin' => $user->ID_User,
                'Motivo_Rejeicao' => $request->motivo
            ]);
            
            $aprovacao->save();
            
            // Atualizar o utilizador
            $targetUser->Status_UtilizadorID_status_utilizador = 3; // 3 = Rejeitado
            $targetUser->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            $targetUser->save();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Utilizador rejeitado com sucesso'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao rejeitar utilizador: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Listar todos os utilizadores
     */
    public function getAllUsers()
    {
        // Verificar se o utilizador autenticado é administrador
        $user = Auth::user();
        if ($user->TipoUserID_TipoUser != 1) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        // Buscar todos os utilizadores com suas relações
        $users = Utilizador::with(['morada', 'status_utilizador', 'tipouser', 'imagem'])
            ->get();
            
        return response()->json($users);
    }
}
