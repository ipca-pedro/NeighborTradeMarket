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
            
            // Verificar se já existe um registro de aprovação
            if ($targetUser->AprovacaoID_aprovacao) {
                // Atualizar o registro de aprovação existente
                $aprovacao = Aprovacao::find($targetUser->AprovacaoID_aprovacao);
                
                if ($aprovacao) {
                    $aprovacao->Data_Aprovacao = now();
                    $aprovacao->Status_AprovacaoID_Status_Aprovacao = 2; // Status aprovado
                    $aprovacao->UtilizadorID_Admin = $user->ID_User;
                    $aprovacao->save();
                } else {
                    // Se não encontrar o registro, criar um novo
                    $aprovacao = new Aprovacao([
                        'Data_Aprovacao' => now(),
                        'Status_AprovacaoID_Status_Aprovacao' => 2, // Status aprovado
                        'UtilizadorID_Admin' => $user->ID_User
                    ]);
                    $aprovacao->save();
                    $targetUser->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
                }
            } else {
                // Criar novo registro de aprovação
                $aprovacao = new Aprovacao([
                    'Data_Aprovacao' => now(),
                    'Status_AprovacaoID_Status_Aprovacao' => 2, // Status aprovado
                    'UtilizadorID_Admin' => $user->ID_User
                ]);
                
                $aprovacao->save();
                $targetUser->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            }
            
            // Atualizar o status do utilizador
            $targetUser->Status_UtilizadorID_status_utilizador = 2; // 2 = Aprovado
            $targetUser->save();
            
            // Log para debug
            \Log::info('Utilizador aprovado com sucesso:', [
                'userId' => $userId,
                'aprovacaoId' => $aprovacao->ID_aprovacao,
                'adminId' => $user->ID_User
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Utilizador aprovado com sucesso'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao aprovar utilizador:', [
                'userId' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
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
    
    /**
     * Atualizar o status de um utilizador
     */
    public function updateUserStatus(Request $request, $userId)
    {
        // Verificar se o utilizador autenticado é administrador
        $user = Auth::user();
        if ($user->TipoUserID_TipoUser != 1) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        $request->validate([
            'status' => 'required|integer|exists:status_utilizador,ID_status_utilizador'
        ]);
        
        DB::beginTransaction();
        
        try {
            // Buscar o utilizador a ser atualizado
            $targetUser = Utilizador::find($userId);
            
            if (!$targetUser) {
                return response()->json([
                    'message' => 'Utilizador não encontrado'
                ], 404);
            }
            
            // Atualizar o status do utilizador
            $targetUser->Status_UtilizadorID_status_utilizador = $request->status;
            $targetUser->save();
            
            // Log para debug
            \Log::info('Status do utilizador atualizado com sucesso:', [
                'userId' => $userId,
                'novoStatus' => $request->status,
                'adminId' => $user->ID_User
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Status do utilizador atualizado com sucesso'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao atualizar status do utilizador:', [
                'userId' => $userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao atualizar status do utilizador: ' . $e->getMessage()
            ], 500);
        }
    }
}
