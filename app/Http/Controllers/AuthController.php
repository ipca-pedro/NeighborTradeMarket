<?php

namespace App\Http\Controllers;

use App\Models\Utilizador;
use App\Models\Morada;
use App\Models\Imagem;
use App\Models\Aprovacao;
use App\Models\StatusUtilizador;
use App\Models\Notificacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;

/**
 * @OA\Tag(
 *     name="Autenticação",
 *     description="API Endpoints para autenticação e gestão de utilizadores"
 * )
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     summary="Login do utilizador",
     *     description="Autentica um utilizador e retorna o token de acesso",
     *     operationId="login",
     *     tags={"Autenticação"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Credenciais do utilizador",
     *         @OA\JsonContent(
     *             required={"Email", "Password"},
     *             @OA\Property(property="Email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="Password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login realizado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", type="object", 
     *                 @OA\Property(property="ID_User", type="integer", example=1),
     *                 @OA\Property(property="Name", type="string", example="João Silva"),
     *                 @OA\Property(property="Email", type="string", format="email", example="user@example.com"),
     *                 @OA\Property(property="User_Name", type="string", example="joaosilva")
     *             ),
     *             @OA\Property(property="token", type="string", example="1|LzUVRjIoQmVXb8mWLRlHWt4H0FALvCx9PjCFFRlI"),
     *             @OA\Property(property="message", type="string", example="Login realizado com sucesso")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Credenciais inválidas",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Utilizador não encontrado ou senha incorreta")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Utilizador não aprovado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="A sua conta ainda está pendente de aprovação pelo administrador")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao processar o login")
     *         )
     *     )
     * )
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
            
            // Verificar se o utilizador está aprovado (status 2 = Aprovado)
            if ($user->Status_UtilizadorID_status_utilizador != 2) { 
                $statusMessage = '';
                
                // Mensagens personalizadas com base no status
                switch ($user->Status_UtilizadorID_status_utilizador) {
                    case 1: // Pendente
                        $statusMessage = 'A sua conta ainda está pendente de aprovação pelo administrador.';
                        break;
                    case 3: // Inativo
                        $statusMessage = 'A sua conta está inativa. Por favor, contacte o administrador.';
                        break;
                    case 8: // Rejeitado
                        $statusMessage = 'O seu pedido de registo foi rejeitado pelo administrador.';
                        break;
                    default:
                        $statusMessage = 'A sua conta não está autorizada a fazer login. Por favor, contacte o administrador.';
                }
                
                return response()->json([
                    'message' => $statusMessage
                ], 403);
            }
            
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
     * @OA\Post(
     *     path="/api/auth/register",
     *     summary="Registo de novo utilizador",
     *     description="Regista um novo utilizador no sistema, sujeito à aprovação por um administrador",
     *     operationId="register",
     *     tags={"Autenticação"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Dados do novo utilizador",
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"User_Name", "Name", "Email", "Password", "Password_confirmation", "Data_Nascimento", "CC", "MoradaID_Morada", "comprovativo_morada"},
     *                 @OA\Property(property="User_Name", type="string", example="joaosilva"),
     *                 @OA\Property(property="Name", type="string", example="João Silva"),
     *                 @OA\Property(property="Email", type="string", format="email", example="user@example.com"),
     *                 @OA\Property(property="Password", type="string", format="password", example="password123"),
     *                 @OA\Property(property="Password_confirmation", type="string", format="password", example="password123"),
     *                 @OA\Property(property="Data_Nascimento", type="string", format="date", example="1990-01-01"),
     *                 @OA\Property(property="CC", type="string", example="12345678"),
     *                 @OA\Property(property="MoradaID_Morada", type="integer", example=1),
     *                 @OA\Property(property="comprovativo_morada", type="string", format="binary")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Utilizador registado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Registo realizado com sucesso. Aguardando aprovação do administrador."),
     *             @OA\Property(property="user", type="object", 
     *                 @OA\Property(property="ID_User", type="integer", example=1),
     *                 @OA\Property(property="Name", type="string", example="João Silva"),
     *                 @OA\Property(property="Email", type="string", format="email", example="user@example.com"),
     *                 @OA\Property(property="User_Name", type="string", example="joaosilva")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Dados inválidos",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="O campo User_Name já está sendo utilizado"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao processar o registo")
     *         )
     *     )
     * )
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
            'comprovativo_morada' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120'
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
                try {
                    // Criar diretório de comprovativos se não existir
                    $diretorioBase = 'comprovativos';
                    if (!Storage::disk('public')->exists($diretorioBase)) {
                        Storage::disk('public')->makeDirectory($diretorioBase);
                    }
                    
                    // Criar diretório específico para o tipo de documento (PDF ou imagem)
                    $file = $request->file('comprovativo_morada');
                    $extension = $file->getClientOriginalExtension();
                    $isPdf = strtolower($extension) === 'pdf';
                    $tipoDir = $isPdf ? 'pdfs' : 'imagens';
                    $diretorioTipo = $diretorioBase . '/' . $tipoDir;
                    
                    if (!Storage::disk('public')->exists($diretorioTipo)) {
                        Storage::disk('public')->makeDirectory($diretorioTipo);
                    }
                    
                    // Gerar nome único para o arquivo
                    $userId = DB::table('utilizador')->max('ID_User') + 1; // Próximo ID de usuário
                    $timestamp = now()->format('YmdHis');
                    $filename = 'user_' . $userId . '_' . $timestamp . '.' . $extension;
                    
                    // Armazenar o arquivo no diretório apropriado
                    $path = $file->storeAs($diretorioTipo, $filename, 'public');
                    
                    // Criar registro na tabela imagem
                    $imagem = new Imagem();
                    $imagem->Caminho = $path;
                    $imagem->save();
                    $imagemId = $imagem->ID_Imagem;
                    
                    // Log para debug
                    \Log::info('Comprovativo de morada armazenado:', [
                        'path' => $path,
                        'filename' => $filename,
                        'tipo' => $isPdf ? 'PDF' : 'Imagem',
                        'imagemId' => $imagemId
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Erro ao salvar comprovativo de morada: ' . $e->getMessage());
                    throw $e; // Propagar o erro para ser capturado no bloco catch principal
                }
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

            // Criar notificação para todos os admins
            $admins = Utilizador::where('TipoUserID_TipoUser', 1)->get();
            foreach ($admins as $admin) {
                DB::table('notificacao')->insert([
                    'Mensagem' => 'Novo pedido de registo pendente: ' . $user->Name,
                    'DataNotificacao' => now(),
                    'ReferenciaID' => $user->ID_User,
                    'UtilizadorID_User' => $admin->ID_User,
                    'ReferenciaTipoID_ReferenciaTipo' => 1, // Utilizador
                    'TIpo_notificacaoID_TipoNotificacao' => 1, // Registo de Utilizador
                    'Estado_notificacaoID_estado_notificacao' => 1 // Não lida
                ]);
            }
            
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
     * @OA\Post(
     *     path="/api/auth/logout",
     *     summary="Logout do utilizador",
     *     description="Encerra a sessão do utilizador e revoga o token de acesso",
     *     operationId="logout",
     *     tags={"Autenticação"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout realizado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Logout realizado com sucesso")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso']);
    }

    /**
     * @OA\Get(
     *     path="/api/moradas",
     *     summary="Listar moradas disponíveis",
     *     description="Retorna uma lista de moradas disponíveis para selecionar durante o registo",
     *     operationId="getMoradas",
     *     tags={"Autenticação"},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de moradas recuperada com sucesso",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="ID_Morada", type="integer", example=1),
     *             @OA\Property(property="Rua", type="string", example="Rua da Juventude, nº 44")
     *         ))
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao buscar moradas")
     *         )
     *     )
     * )
     */
    public function getMoradas()
    {
        try {
            $moradas = Morada::select('ID_Morada', 'Rua')->get();
            return response()->json($moradas);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao buscar moradas: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/auth/me",
     *     summary="Obter dados do utilizador autenticado",
     *     description="Retorna os dados do utilizador atualmente autenticado",
     *     operationId="getAuthenticatedUser",
     *     tags={"Autenticação"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dados do utilizador recuperados com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="ID_User", type="integer", example=1),
     *             @OA\Property(property="Name", type="string", example="João Silva"),
     *             @OA\Property(property="Email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="User_Name", type="string", example="joaosilva"),
     *             @OA\Property(property="Data_Nascimento", type="string", format="date", example="1990-01-01")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function me()
    {
        return response()->json(Auth::user()->load(['morada', 'tipouser', 'imagem']));
    }

    /**
     * @OA\Get(
     *     path="/api/auth/profile",
     *     summary="Obter perfil do utilizador",
     *     description="Retorna o perfil completo do utilizador autenticado",
     *     operationId="getUserProfile",
     *     tags={"Autenticação"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Perfil do utilizador recuperado com sucesso",
     *         @OA\JsonContent(type="object")
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     )
     * )
     */
    public function getUserProfile()
    {
        return response()->json(Auth::user()->load(['morada', 'tipouser', 'imagem']));
    }

    /**
     * @OA\Post(
     *     path="/api/auth/reset-password",
     *     summary="Solicitar redefinição de senha",
     *     description="Envia um email com o link para redefinir a senha",
     *     operationId="requestPasswordReset",
     *     tags={"Autenticação"},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Email do utilizador",
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Email de redefinição enviado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Email de redefinição de senha enviado com sucesso")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Email não encontrado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não conseguimos encontrar um utilizador com esse endereço de email")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao processar a solicitação de redefinição de senha")
     *         )
     *     )
     * )
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
     * @OA\Post(
     *     path="/api/auth/change-password",
     *     summary="Alterar senha",
     *     description="Altera a senha do utilizador autenticado",
     *     operationId="changePassword",
     *     tags={"Autenticação"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Dados para alteração de senha",
     *         @OA\JsonContent(
     *             required={"current_password", "password", "password_confirmation"},
     *             @OA\Property(property="current_password", type="string", format="password", example="senhaAtual123"),
     *             @OA\Property(property="password", type="string", format="password", example="novaSenha123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="novaSenha123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Senha alterada com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Senha alterada com sucesso")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validação falhou",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="A senha atual está incorreta"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Não autorizado - usuário não autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Não autenticado")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Erro no servidor",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Erro ao alterar a senha")
     *         )
     *     )
     * )
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
}
