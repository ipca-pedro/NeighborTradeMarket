<?php

namespace App\Http\Controllers;

use App\Models\Utilizador;
use App\Models\Morada;
use App\Models\Imagem;
use App\Models\Aprovacao;
use App\Models\StatusUtilizador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;

class AuthController extends Controller
{
    /**
     * Login do utilizador
     */
    public function login(Request $request)
    {
        try {
            // Log para depuração
            \Illuminate\Support\Facades\Log::info('Requisição de login recebida no AuthController', [
                'headers' => $request->headers->all(),
                'body' => $request->all()
            ]);
            
            $credentials = $request->validate([
                'Email' => 'required|email',
                'Password' => 'required'
            ]);

            // Buscar o utilizador pelo email
            $user = Utilizador::where('Email', $credentials['Email'])->first();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Utilizador não encontrado.'
                ], 401);
            }
            
            // Log para depuração
            \Illuminate\Support\Facades\Log::info('Utilizador encontrado no AuthController', [
                'user' => $user->toArray()
            ]);
            
            // Verificar se a senha está correta
            if (!Hash::check($credentials['Password'], $user->Password)) {
                return response()->json([
                    'message' => 'Senha incorreta.'
                ], 401);
            }
            
            // Verificar se o utilizador está aprovado
            \Illuminate\Support\Facades\Log::info('Status do usuário no AuthController', [
                'status' => $user->Status_UtilizadorID_status_utilizador
            ]);
            
            // Temporariamente desativado para fins de teste
            // if ($user->Status_UtilizadorID_status_utilizador != 2) { // Assumindo que 2 é o ID para "Aprovado"
            //     return response()->json([
            //         'message' => 'A sua conta ainda não foi aprovada pelo administrador.'
            //     ], 403);
            // }
            
            // Gerar token de autenticação
            $token = $user->createToken('auth-token')->plainTextToken;
            
            // Carregar relações importantes
            $user->load(['morada', 'status_utilizador', 'tipouser', 'imagem']);
            
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Login realizado com sucesso'
            ]);
        } catch (\Exception $e) {
            // Log do erro para depuração
            \Illuminate\Support\Facades\Log::error('Erro no login do AuthController', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao processar o login: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Registo de novo utilizador
     */
    public function register(Request $request)
    {
        $request->validate([
            'User_Name' => 'required|string|max:255|unique:utilizador,User_Name',
            'Name' => 'required|string|max:255',
            'Email' => 'required|string|email|max:255|unique:utilizador,Email',
            'Password' => 'required|string|min:8',
            'Password_confirmation' => 'required|same:Password',
            'Data_Nascimento' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $minYear = 1900;
                    $maxYear = now()->year - 18; // Utilizador deve ter pelo menos 18 anos
                    $year = date('Y', strtotime($value));
    
                    if ($year < $minYear || $year > $maxYear) {
                        $fail("A data de nascimento deve estar entre $minYear e $maxYear.");
                    }
                },
            ],
            'CC' => 'required|string|max:20',
            'MoradaID_Morada' => 'required|integer|exists:morada,ID_Morada',
            'comprovativo_morada' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048'
        ]);

        DB::beginTransaction();
        
        try {
            // Usar a morada selecionada pelo utilizador
            $moradaId = $request->MoradaID_Morada;
            
            // Verificar se a morada existe
            $morada = Morada::find($moradaId);
            if (!$morada) {
                return response()->json([
                    'message' => 'Morada não encontrada'
                ], 400);
            }
            
            // Processar comprovativo de morada
            $imagemId = null;
            if ($request->hasFile('comprovativo_morada')) {
                // Obter o próximo ID para o nome do arquivo
                $nextId = DB::table('imagem')->max('ID_Imagem') + 1;
                $file = $request->file('comprovativo_morada');
                $extension = $file->getClientOriginalExtension();
                $filename = 'aprova' . $nextId . '.' . $extension;
                
                // Armazenar o arquivo no diretório public/storage/comprovativos
                // Isso garante que o arquivo seja acessível publicamente
                $path = $file->storeAs('public/comprovativos', $filename);
                
                // Criar registro na tabela imagem
                $imagem = new Imagem([
                    'Caminho' => $path
                ]);
                $imagem->save();
                $imagemId = $imagem->ID_Imagem;
                
                // Log para debug
                \Log::info('Comprovativo de morada armazenado:', [
                    'path' => $path,
                    'filename' => $filename,
                    'imagemId' => $imagemId
                ]);
            }
            
            // Verificar se temos uma imagem de perfil padrão para usar
            if (!$imagemId) {
                // Buscar a imagem padrão existente ou criar uma nova
                $imagem = Imagem::where('Caminho', 'public/perfil/default.png')->first();
                
                if (!$imagem) {
                    // Criar uma imagem padrão
                    $imagem = new Imagem([
                        'Caminho' => 'public/perfil/default.png' // Caminho para imagem padrão
                    ]);
                    $imagem->save();
                }
                
                $imagemId = $imagem->ID_Imagem;
            }
            
            // Criar registro de aprovação pendente
            $aprovacao = new Aprovacao([
                'Data_Aprovacao' => null,
                'Comentario' => null,
                'Status_AprovacaoID_Status_Aprovacao' => 1, // Status pendente
                'UtilizadorID_Admin' => 1 // ID do administrador padrão (conforme memória)
            ]);
            $aprovacao->save();
            
            // Criar utilizador com status pendente
            $user = new Utilizador([
                'Name' => $request->Name,
                'User_Name' => $request->User_Name,
                'Email' => $request->Email,
                'Password' => Hash::make($request->Password),
                'Data_Nascimento' => $request->Data_Nascimento,
                'CC' => $request->CC,
                'MoradaID_Morada' => $moradaId,
                'ImagemID_Imagem' => $imagemId,
                'AprovacaoID_aprovacao' => $aprovacao->ID_aprovacao, // Associar à aprovação criada
                'Status_UtilizadorID_status_utilizador' => 1, // Status pendente (ID 1)
                'TipoUserID_TipoUser' => 2 // Tipo utilizador normal (ID 2)
            ]);
            
            $user->save();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Registo realizado com sucesso. Aguarde a aprovação do administrador.'
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao registar utilizador: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout do utilizador
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }
    
    /**
     * Retorna todas as moradas disponíveis para registo
     */
    public function getMoradas()
    {
        try {
            // Buscar apenas os campos que existem na tabela
            $moradas = Morada::all();
            return response()->json($moradas);
        } catch (\Exception $e) {
            // Registrar o erro e retornar uma resposta amigável
            \Log::error('Erro ao buscar moradas: ' . $e->getMessage());
            return response()->json([
                'message' => 'Não foi possível obter a lista de moradas.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Obter dados do utilizador autenticado
     */
    public function me()
    {
        $user = Auth::user();
        
        // Carregar relações importantes
        $user->load(['morada', 'status_utilizador', 'tipouser', 'imagem']);
        
        return response()->json($user);
    }
    
    /**
     * Obter perfil do utilizador
     */
    public function getUserProfile()
    {
        $user = Auth::user();
        
        // Carregar relações importantes
        $user->load(['morada', 'status_utilizador', 'tipouser', 'imagem']);
        
        return response()->json($user);
    }
    
    /**
     * Atualizar perfil do utilizador
     */
    public function updateUserProfile(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'Name' => 'sometimes|string|max:255',
            'User_Name' => 'sometimes|string|max:255|unique:utilizador,User_Name,' . $user->ID_User . ',ID_User',
            'Email' => 'sometimes|string|email|max:255|unique:utilizador,Email,' . $user->ID_User . ',ID_User',
            'profile_image' => 'sometimes|file|mimes:jpeg,png,jpg|max:2048'
        ]);
        
        DB::beginTransaction();
        
        try {
            // Atualizar dados básicos
            if ($request->has('Name')) {
                $user->Name = $request->Name;
            }
            
            if ($request->has('User_Name')) {
                $user->User_Name = $request->User_Name;
            }
            
            if ($request->has('Email')) {
                $user->Email = $request->Email;
            }
            
            // Processar imagem de perfil
            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('public/perfil', $filename);
                
                $imagem = new Imagem([
                    'Caminho' => $path
                ]);
                $imagem->save();
                
                $user->ImagemID_Imagem = $imagem->ID_Imagem;
            }
            
            $user->save();
            
            DB::commit();
            
            // Recarregar o utilizador com suas relações
            $user->load(['morada', 'status_utilizador', 'tipouser', 'imagem']);
            
            return response()->json([
                'user' => $user,
                'message' => 'Perfil atualizado com sucesso'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar perfil: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Alterar senha do utilizador
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        $user = Auth::user();
        
        // Verificar senha atual
        if (!Hash::check($request->current_password, $user->Password)) {
            return response()->json([
                'message' => 'A senha atual está incorreta'
            ], 400);
        }
        
        // Atualizar senha
        $user->Password = Hash::make($request->password);
        $user->save();
        
        return response()->json([
            'message' => 'Senha alterada com sucesso'
        ]);
    }
    
    /**
     * Enviar link de redefinição de senha
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'Email' => 'required|email'
        ]);
        
        // Verificar se o utilizador existe
        $user = Utilizador::where('Email', $request->Email)->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'Não foi possível encontrar um utilizador com este endereço de e-mail.'
            ], 404);
        }
        
        // Gerar token de redefinição
        $token = Str::random(60);
        
        // Armazenar o token como uma notificação para o utilizador
        // Vamos usar o tipo de notificação para indicar que é um token de redefinição de senha
        // Assumindo que existe um tipo de notificação para redefinição de senha (ID 3)
        $tipoNotificacaoId = 3; // Tipo para redefinição de senha
        $referenciaTipoId = 1; // Tipo de referência para utilizador
        
        // Criar a notificação com o token
        DB::table('notificacao')->insert([
            'Mensagem' => Hash::make($token), // Armazenar o hash do token
            'DataNotificacao' => now(),
            'ReferenciaID' => $user->ID_User, // ID do utilizador como referência
            'UtilizadorID_User' => $user->ID_User,
            'ReferenciaTipoID_ReferenciaTipo' => $referenciaTipoId,
            'TIpo_notificacaoID_TipoNotificacao' => $tipoNotificacaoId
        ]);
        
        // Na implementação real, aqui você enviaria um e-mail com o link de redefinição
        // Mas para fins de teste, apenas retornamos o token
        
        return response()->json([
            'message' => 'Link de redefinição de senha enviado com sucesso.',
            'token' => $token // Em produção, não retorne o token na resposta
        ]);
    }
    
    /**
     * Mostrar formulário de redefinição de senha (verificar token)
     */
    public function showResetForm(Request $request, $token)
    {
        // Tipo de notificação para redefinição de senha (ID 3)
        $tipoNotificacaoId = 3;
        
        // Buscar notificações de redefinição de senha criadas nas últimas 24 horas
        $notificacoes = DB::table('notificacao')
            ->where('TIpo_notificacaoID_TipoNotificacao', $tipoNotificacaoId)
            ->where('DataNotificacao', '>=', now()->subHours(24))
            ->get();
        
        $tokenValido = false;
        $userId = null;
        
        // Verificar se alguma das notificações contém o token válido
        foreach ($notificacoes as $notificacao) {
            if (Hash::check($token, $notificacao->Mensagem)) {
                $tokenValido = true;
                $userId = $notificacao->UtilizadorID_User;
                break;
            }
        }
        
        if (!$tokenValido) {
            return response()->json([
                'message' => 'Este token de redefinição de senha é inválido ou expirou.'
            ], 400);
        }
        
        // Buscar o email do utilizador
        $user = Utilizador::find($userId);
        
        return response()->json([
            'message' => 'Token válido',
            'email' => $user->Email
        ]);
    }
    
    /**
     * Redefinir senha
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'Password' => 'required|min:8',
            'Password_confirmation' => 'required|same:Password'
        ]);
        
        // Tipo de notificação para redefinição de senha (ID 3)
        $tipoNotificacaoId = 3;
        
        // Buscar notificações de redefinição de senha criadas nas últimas 24 horas
        $notificacoes = DB::table('notificacao')
            ->where('TIpo_notificacaoID_TipoNotificacao', $tipoNotificacaoId)
            ->where('DataNotificacao', '>=', now()->subHours(24))
            ->get();
        
        $tokenValido = false;
        $userId = null;
        $notificacaoId = null;
        
        // Verificar se alguma das notificações contém o token válido
        foreach ($notificacoes as $notificacao) {
            if (Hash::check($request->token, $notificacao->Mensagem)) {
                $tokenValido = true;
                $userId = $notificacao->UtilizadorID_User;
                $notificacaoId = $notificacao->ID_Notificacao;
                break;
            }
        }
        
        if (!$tokenValido) {
            return response()->json([
                'message' => 'Este token de redefinição de senha é inválido ou expirou.'
            ], 400);
        }
        
        // Buscar o utilizador
        $user = Utilizador::find($userId);
        
        if (!$user) {
            return response()->json([
                'message' => 'Não foi possível encontrar o utilizador.'
            ], 404);
        }
        
        // Atualizar senha
        $user->Password = Hash::make($request->Password);
        $user->save();
        
        // Remover a notificação do token usado
        DB::table('notificacao')
            ->where('ID_Notificacao', $notificacaoId)
            ->delete();
        
        return response()->json([
            'message' => 'Senha redefinida com sucesso.'
        ]);
    }
}
