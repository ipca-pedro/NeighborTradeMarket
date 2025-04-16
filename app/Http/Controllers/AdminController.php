<?php

namespace App\Http\Controllers;

use App\Models\Utilizador;
use App\Models\Aprovacao;
use App\Models\StatusUtilizador;
use App\Models\Anuncio;
use App\Models\StatusAnuncio;
use App\Models\Notificacao;
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
                'Data_Submissao' => now(),
                'Comentario' => $request->motivo,
                'UtilizadorID_Admin' => $user->ID_User,
                'Status_AprovacaoID_Status_Aprovacao' => 3 // Status de rejeição na tabela Aprovação
            ]);
            
            $aprovacao->save();
            
            // Atualizar o utilizador
            $targetUser->Status_UtilizadorID_status_utilizador = 8; // 8 = Rejeitado
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
    
    /**
     * Obter contagem de utilizadores pendentes para notificações
     */
    public function getPendingUsersCount()
    {
        // Verificar se o utilizador autenticado é administrador
        $user = Auth::user();
        if ($user->TipoUserID_TipoUser != 1) { // Assumindo que 1 é o ID para administradores
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }
        
        // Contar utilizadores pendentes (status 1 = pendente)
        $count = Utilizador::where('Status_UtilizadorID_status_utilizador', 1)->count();
            
        return response()->json([
            'count' => $count
        ]);
    }

    /**
     * Listar todos os anúncios para gestão (com filtros)
     */
    public function getAllAnuncios(Request $request)
    {
        // Authorization Check (Admin Only)
        if (Auth::user()->TipoUserID_TipoUser != 1) {
            return response()->json(['message' => 'Acesso não autorizado'], 403);
        }

        try {
            $query = Anuncio::with([
                'utilizador:ID_User,Name,User_Name', // Select specific user fields
                'categorium:ID_Categoria,Descricao_Categoria',
                'tipo_item:ID_Tipo,Descricao_TipoItem',
                'status_anuncio:ID_Status_Anuncio,Descricao_status_anuncio',
                'item_imagems.imagem' // Load all images for modal
            ]);

            // --- Filtering ---
            if ($request->filled('search_term')) {
                $searchTerm = $request->input('search_term');
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('Titulo', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('Descricao', 'LIKE', "%{$searchTerm}%")
                      ->orWhereHas('utilizador', function ($uq) use ($searchTerm) {
                          $uq->where('Name', 'LIKE', "%{$searchTerm}%")
                             ->orWhere('User_Name', 'LIKE', "%{$searchTerm}%");
                      });
                });
            }

            if ($request->filled('status') && is_numeric($request->input('status'))) {
                 $query->where('Status_AnuncioID_Status_Anuncio', $request->input('status'));
            }

            if ($request->filled('category') && is_numeric($request->input('category'))) {
                 $query->where('CategoriaID_Categoria', $request->input('category'));
            }

            if ($request->filled('type') && is_numeric($request->input('type'))) {
                 $query->where('Tipo_ItemID_Tipo', $request->input('type'));
            }
            // --- End Filtering ---

            // Get all results for now, implement pagination later if needed
            $anuncios = $query->orderBy('ID_Anuncio', 'desc')->get();

            return response()->json($anuncios);

        } catch (\Exception $e) {
            \Log::error('Erro ao buscar todos os anúncios para admin:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Erro ao buscar anúncios.'], 500);
        }
    }

    /**
     * Atualizar o status de um anúncio pelo admin
     */
    public function updateAnuncioStatus(Request $request, $anuncioId)
    {
        // Authorization Check (Admin Only)
        if (Auth::user()->TipoUserID_TipoUser != 1) {
            return response()->json(['message' => 'Acesso não autorizado'], 403);
        }

        $request->validate([
            'status' => 'required|integer|exists:status_anuncio,ID_Status_Anuncio'
        ]);

        DB::beginTransaction();
        
        try {
            $anuncio = Anuncio::find($anuncioId);
            
            if (!$anuncio) {
                return response()->json(['message' => 'Anúncio não encontrado'], 404);
            }
            
            // Correctly update the anuncio status
            $anuncio->Status_AnuncioID_Status_Anuncio = $request->status; 
            $anuncio->save();

            // Se o status for Aprovado (ID 1), atualiza a aprovação também
            if ($request->status == StatusAnuncio::STATUS_ATIVO && $anuncio->AprovacaoID_aprovacao) {
                 $aprovacao = Aprovacao::find($anuncio->AprovacaoID_aprovacao);
                 if ($aprovacao) {
                     $aprovacao->Status_AprovacaoID_Status_Aprovacao = 2; // Aprovado na tabela de aprovação
                     $aprovacao->Data_Aprovacao = now();
                     // Use Auth::user()->getKey() to get the numeric admin ID
                     $aprovacao->UtilizadorID_Admin = Auth::user()->getKey(); 
                     $aprovacao->Comentario = null; // Limpa comentário de rejeição prévio
                     $aprovacao->save();
                 }
            }
            // Considerar atualizar Aprovacao se for rejeitado (ID 7) também?
            // else if ($request->status == StatusAnuncio::STATUS_REJEITADO && ...) { ... }
            
            DB::commit();
            
             // Retornar o anúncio atualizado com o status
            $anuncio->load('status_anuncio'); // Carregar a relação atualizada
            return response()->json([
                'message' => 'Estado do anúncio atualizado com sucesso!',
                'anuncio' => $anuncio // Enviar de volta o anúncio atualizado
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erro ao atualizar estado do anúncio (Admin):', [
                 'anuncioId' => $anuncioId,
                 'status' => $request->status,
                 'error' => $e->getMessage(),
                 'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Erro ao atualizar estado do anúncio.'], 500);
        }
    }

    /**
     * Contar utilizadores pendentes e notificações não lidas para o admin autenticado
     */
    public function pendingUsersCount()
    {
        $user = Auth::user();
        if (!$user || $user->TipoUserID_TipoUser != 1) {
            return response()->json([
                'message' => 'Acesso não autorizado'
            ], 403);
        }

        // Contar utilizadores pendentes (ajuste o status conforme o seu sistema, ex: 1 ou 4)
        $pendingCount = Utilizador::where('Status_UtilizadorID_status_utilizador', 1)->count();

        // Contar notificações não lidas para o admin autenticado
        $unreadNotifications = Notificacao::where('UtilizadorID_User', $user->ID_User)
            ->where('Lida', 0)
            ->count();

        return response()->json([
            'pending_users' => $pendingCount,
            'unread_notifications' => $unreadNotifications
        ]);
    }
}
