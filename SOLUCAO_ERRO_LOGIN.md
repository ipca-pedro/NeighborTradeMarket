# Solução para Erro de Login no NeighborTradeMarket

Este guia contém instruções específicas para resolver o problema de erro 403 (Forbidden) ao tentar fazer login na aplicação.

## Problema

Seus amigos estão enfrentando erro 403 (Forbidden) ao tentar fazer login na aplicação. Isso geralmente ocorre porque:

1. Arquivos importantes de middleware não foram incluídos no repositório Git
2. Configurações de CORS não estão corretas
3. A tabela `personal_access_tokens` não foi criada no banco de dados

## Solução Rápida

Execute o script de correção de problemas de autenticação:

```bash
.\fix_auth_issues.ps1
```

Este script irá:
- Criar/atualizar o middleware `ApiMiddleware.php`
- Criar/atualizar a configuração de CORS
- Criar/atualizar a configuração do Sanctum
- Verificar e atualizar o arquivo bootstrap/app.php
- Adicionar configurações necessárias ao .env
- Criar a migração para a tabela `personal_access_tokens` (se necessário)
- Executar as migrações
- Limpar o cache da aplicação

## Solução Manual

Se o script não resolver o problema, siga estes passos manualmente:

### 1. Verifique se o ApiMiddleware.php existe

O arquivo deve estar em `app/Http/Middleware/ApiMiddleware.php` com o seguinte conteúdo:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiMiddleware
{
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
```

### 2. Verifique a configuração de CORS

O arquivo `config/cors.php` deve ter o seguinte conteúdo:

```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 3. Verifique o bootstrap/app.php

O arquivo `bootstrap/app.php` deve ter o middleware de CORS registrado:

```php
// Configurar os middlewares para API
$middleware->api([
    \Illuminate\Http\Middleware\HandleCors::class,
    \App\Http\Middleware\ApiMiddleware::class,
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
]);
```

### 4. Verifique o arquivo .env

Adicione estas linhas ao arquivo `.env`:

```
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

### 5. Verifique se a tabela personal_access_tokens existe

Execute o comando:

```bash
php artisan migrate:status
```

Se a migração `create_personal_access_tokens_table` não estiver presente ou não tiver sido executada, crie-a:

```bash
php artisan make:migration create_personal_access_tokens_table
```

E adicione o seguinte conteúdo ao arquivo de migração criado:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
```

Depois execute:

```bash
php artisan migrate
```

### 6. Limpe o cache da aplicação

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 7. Reinicie o servidor Laravel

```bash
php artisan serve
```

## Verificação do Problema

Para verificar se o problema foi resolvido, tente fazer login usando:

```bash
Invoke-WebRequest -Uri http://localhost:8000/api/auth/login -Method POST -ContentType "application/json" -Body '{"Email":"admin@example.com","Password":"password"}' -UseBasicParsing
```

Se receber um código de status 200, o problema foi resolvido.

## Verificação de Logs

Se o problema persistir, verifique os logs do Laravel:

```bash
Get-Content storage\logs\laravel.log -Tail 50
```

## Observação Importante

Este projeto foi adaptado para o Laravel 11. Certifique-se de que todos os arquivos necessários estão presentes e configurados corretamente para esta versão.

## Credenciais de Teste

- **Admin**: admin@example.com / senha123
- **Usuário**: user@example.com / senha123
