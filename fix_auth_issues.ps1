# Script para corrigir problemas de autenticação no NeighborTradeMarket
# Este script verifica e corrige os problemas comuns de autenticação

Write-Host "Iniciando correção de problemas de autenticação..." -ForegroundColor Cyan

# Verificar e criar diretório de middleware se não existir
$middlewarePath = "app/Http/Middleware"
if (-not (Test-Path $middlewarePath)) {
    Write-Host "Criando diretório de middleware..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $middlewarePath -Force
}

# Verificar e criar ApiMiddleware.php
$apiMiddlewarePath = "app/Http/Middleware/ApiMiddleware.php"
if (-not (Test-Path $apiMiddlewarePath)) {
    Write-Host "Criando ApiMiddleware.php..." -ForegroundColor Yellow
    $apiMiddlewareContent = @'
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Responder imediatamente a requisições OPTIONS (pre-flight)
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            // Processar a requisição normalmente
            $response = $next($request);
        }
        
        // Configurar cabeçalhos CORS para todas as respostas
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400'); // 24 horas
        
        return $response;
    }
}
'@
    Set-Content -Path $apiMiddlewarePath -Value $apiMiddlewareContent
    Write-Host "ApiMiddleware.php criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "ApiMiddleware.php já existe. Verificando conteúdo..." -ForegroundColor Cyan
    $currentContent = Get-Content -Path $apiMiddlewarePath -Raw
    if (-not ($currentContent -match "Access-Control-Allow-Headers")) {
        Write-Host "Atualizando ApiMiddleware.php..." -ForegroundColor Yellow
        $apiMiddlewareContent = @'
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Responder imediatamente a requisições OPTIONS (pre-flight)
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            // Processar a requisição normalmente
            $response = $next($request);
        }
        
        // Configurar cabeçalhos CORS para todas as respostas
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, X-Token-Auth, Authorization, Accept');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '86400'); // 24 horas
        
        return $response;
    }
}
'@
        Set-Content -Path $apiMiddlewarePath -Value $apiMiddlewareContent
        Write-Host "ApiMiddleware.php atualizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "ApiMiddleware.php está configurado corretamente." -ForegroundColor Green
    }
}

# Verificar e criar config/cors.php
$corsPath = "config/cors.php"
if (-not (Test-Path $corsPath)) {
    Write-Host "Criando config/cors.php..." -ForegroundColor Yellow
    $corsContent = @'
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
'@
    Set-Content -Path $corsPath -Value $corsContent
    Write-Host "config/cors.php criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "config/cors.php já existe. Verificando conteúdo..." -ForegroundColor Cyan
    $currentContent = Get-Content -Path $corsPath -Raw
    if (-not ($currentContent -match "'supports_credentials' => true")) {
        Write-Host "Atualizando config/cors.php..." -ForegroundColor Yellow
        $corsContent = @'
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
'@
        Set-Content -Path $corsPath -Value $corsContent
        Write-Host "config/cors.php atualizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "config/cors.php está configurado corretamente." -ForegroundColor Green
    }
}

# Verificar e criar config/sanctum.php
$sanctumPath = "config/sanctum.php"
if (-not (Test-Path $sanctumPath)) {
    Write-Host "Criando config/sanctum.php..." -ForegroundColor Yellow
    $sanctumContent = @'
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Requests from the following domains / hosts will receive stateful API
    | authentication cookies. Typically, these should include your local
    | and production domains which access your API via a frontend SPA.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate a request. If none of these guards
    | are able to authenticate the request, Sanctum will use the bearer
    | token that's present on an incoming request for authentication.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. This will override any values set in the token's
    | "expires_at" attribute, but first-party sessions are not affected.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix new tokens in order to take advantage of numerous
    | security scanning initiatives maintained by open source platforms
    | that notify developers if they commit tokens into repositories.
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | When authenticating your first-party SPA with Sanctum you may need to
    | customize some of the middleware Sanctum uses while processing the
    | request. You may change the middleware listed below as required.
    |
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    ],

];
'@
    Set-Content -Path $sanctumPath -Value $sanctumContent
    Write-Host "config/sanctum.php criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "config/sanctum.php já existe." -ForegroundColor Green
}

# Verificar e atualizar bootstrap/app.php
$bootstrapPath = "bootstrap/app.php"
if (Test-Path $bootstrapPath) {
    Write-Host "Verificando bootstrap/app.php..." -ForegroundColor Cyan
    $bootstrapContent = Get-Content -Path $bootstrapPath -Raw
    
    # Verificar se o middleware HandleCors está registrado
    if (-not ($bootstrapContent -match "HandleCors")) {
        Write-Host "O middleware HandleCors não está registrado no bootstrap/app.php." -ForegroundColor Yellow
        Write-Host "Por favor, verifique manualmente o arquivo bootstrap/app.php e adicione o middleware HandleCors." -ForegroundColor Yellow
        Write-Host "Exemplo:" -ForegroundColor Yellow
        Write-Host '$middleware->api([' -ForegroundColor Yellow
        Write-Host '    \Illuminate\Http\Middleware\HandleCors::class,' -ForegroundColor Yellow
        Write-Host '    \App\Http\Middleware\ApiMiddleware::class,' -ForegroundColor Yellow
        Write-Host '    \Illuminate\Routing\Middleware\SubstituteBindings::class,' -ForegroundColor Yellow
        Write-Host ']);' -ForegroundColor Yellow
    } else {
        Write-Host "O middleware HandleCors está registrado corretamente no bootstrap/app.php." -ForegroundColor Green
    }
    
    # Verificar se o middleware ApiMiddleware está registrado
    if (-not ($bootstrapContent -match "ApiMiddleware")) {
        Write-Host "O middleware ApiMiddleware não está registrado no bootstrap/app.php." -ForegroundColor Yellow
        Write-Host "Por favor, verifique manualmente o arquivo bootstrap/app.php e adicione o middleware ApiMiddleware." -ForegroundColor Yellow
    } else {
        Write-Host "O middleware ApiMiddleware está registrado corretamente no bootstrap/app.php." -ForegroundColor Green
    }
} else {
    Write-Host "AVISO: bootstrap/app.php não encontrado!" -ForegroundColor Red
}

# Verificar e atualizar .env
if (Test-Path .env) {
    Write-Host "Verificando .env..." -ForegroundColor Cyan
    $envContent = Get-Content -Path .env -Raw
    $needsUpdate = $false
    
    if (-not ($envContent -match "SANCTUM_STATEFUL_DOMAINS")) {
        $needsUpdate = $true
        Write-Host "SANCTUM_STATEFUL_DOMAINS não encontrado no .env" -ForegroundColor Yellow
    }
    
    if (-not ($envContent -match "SESSION_DOMAIN")) {
        $needsUpdate = $true
        Write-Host "SESSION_DOMAIN não encontrado no .env" -ForegroundColor Yellow
    }
    
    if ($needsUpdate) {
        Write-Host "Adicionando configurações do Sanctum ao .env..." -ForegroundColor Yellow
        Add-Content -Path .env -Value "`nSANCTUM_STATEFUL_DOMAINS=localhost:3000`nSESSION_DOMAIN=localhost"
        Write-Host "Configurações adicionadas ao .env" -ForegroundColor Green
    } else {
        Write-Host "Configurações do Sanctum no .env estão corretas." -ForegroundColor Green
    }
} else {
    Write-Host "AVISO: Arquivo .env não encontrado!" -ForegroundColor Red
}

# Verificar migração do Sanctum
$migrationExists = $false
$migrationFiles = Get-ChildItem -Path "database/migrations" -Filter "*_create_personal_access_tokens_table.php" -ErrorAction SilentlyContinue
if ($migrationFiles.Count -gt 0) {
    $migrationExists = $true
    Write-Host "Migração do Sanctum encontrada: $($migrationFiles[0].Name)" -ForegroundColor Green
} else {
    Write-Host "Migração do Sanctum não encontrada. Criando..." -ForegroundColor Yellow
    
    # Criar diretório de migrações se não existir
    if (-not (Test-Path "database/migrations")) {
        New-Item -ItemType Directory -Path "database/migrations" -Force
    }
    
    $timestamp = Get-Date -Format "yyyy_MM_dd_HHmmss"
    $migrationPath = "database/migrations/${timestamp}_create_personal_access_tokens_table.php"
    $migrationContent = @'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
'@
    Set-Content -Path $migrationPath -Value $migrationContent
    Write-Host "Migração do Sanctum criada: $migrationPath" -ForegroundColor Green
}

# Executar migrações
Write-Host "Executando migrações..." -ForegroundColor Cyan
php artisan migrate

# Limpar cache
Write-Host "Limpando cache..." -ForegroundColor Cyan
php artisan config:clear
php artisan cache:clear
php artisan route:clear

Write-Host "`nVerificação e correção de problemas de autenticação concluídas!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Reinicie o servidor Laravel: php artisan serve" -ForegroundColor White
Write-Host "2. Tente fazer login novamente no frontend" -ForegroundColor White
Write-Host "`nSe o problema persistir, verifique os logs em storage/logs/laravel.log" -ForegroundColor White
