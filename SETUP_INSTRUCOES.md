# Instruções de Configuração do NeighborTradeMarket

Este documento contém instruções detalhadas para configurar o projeto NeighborTradeMarket após cloná-lo do repositório.

## Pré-requisitos

- XAMPP instalado (com PHP 8.1+ e MySQL)
- Composer instalado
- Node.js e npm instalados
- Git instalado

## Passos para Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/ipca-pedro/NeighborTradeMarket.git
cd NeighborTradeMarket
```

### 2. Verificar Arquivos Importantes

Certifique-se de que os seguintes arquivos estão presentes no seu projeto:

- `app/Http/Middleware/ApiMiddleware.php` - Middleware para configuração de CORS
- `app/Http/Middleware/VerifyCsrfToken.php` - Middleware para verificação de token CSRF
- `config/cors.php` - Configuração de CORS
- `config/sanctum.php` - Configuração do Laravel Sanctum
- `database/migrations/*_create_personal_access_tokens_table.php` - Migração para tabela de tokens

Se algum desses arquivos estiver faltando, você pode executar o script de configuração ou criá-los manualmente conforme as instruções abaixo.

### 3. Configurar o Ambiente

#### Opção 1: Usar o Script de Configuração Automática

Execute o script PowerShell de configuração:

```bash
.\setup_after_clone.ps1
```

Este script irá:
- Instalar as dependências do Composer
- Verificar a conexão com o banco de dados
- Executar as migrações
- Verificar as configurações de CORS
- Configurar o Sanctum no arquivo .env
- Criar o link simbólico para storage

#### Opção 2: Configuração Manual

1. **Instalar dependências do Composer**:
   ```bash
   composer install
   ```

2. **Configurar o arquivo .env**:
   - Copie o arquivo `.env.example` para `.env`
   - Configure as informações do banco de dados
   - Adicione as configurações do Sanctum:
     ```
     SANCTUM_STATEFUL_DOMAINS=localhost:3000
     SESSION_DOMAIN=localhost
     ```

3. **Executar migrações**:
   ```bash
   php artisan migrate
   ```

4. **Limpar cache**:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

5. **Criar link simbólico para storage**:
   ```bash
   php artisan storage:link
   ```

### 4. Verificar Configuração de CORS

O arquivo `config/cors.php` deve ter as seguintes configurações:

```php
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

### 5. Verificar Middleware API

O arquivo `app/Http/Middleware/ApiMiddleware.php` deve ter o seguinte conteúdo:

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

### 6. Iniciar o Servidor

```bash
php artisan serve
```

### 7. Iniciar o Frontend

```bash
cd frontend
npm install
npm start
```

## Solução de Problemas Comuns

### Erro 403 (Forbidden) ao fazer login

Se você estiver enfrentando erro 403 ao tentar fazer login, verifique:

1. Se o arquivo `ApiMiddleware.php` está presente e configurado corretamente
2. Se o arquivo `config/cors.php` está configurado corretamente
3. Se o middleware está registrado no arquivo `bootstrap/app.php`

### Erro de CORS

Se você estiver enfrentando erros de CORS, verifique:

1. Se o arquivo `config/cors.php` tem `'supports_credentials' => true`
2. Se o middleware CORS está registrado no arquivo `bootstrap/app.php`
3. Se o `ApiMiddleware.php` está configurado para permitir os cabeçalhos necessários

### Erro de Autenticação

Se você estiver enfrentando erros de autenticação, verifique:

1. Se a tabela `personal_access_tokens` foi criada no banco de dados
2. Se o modelo `Utilizador` usa o trait `HasApiTokens`
3. Se o arquivo `config/auth.php` está configurado corretamente

## Credenciais de Teste

- **Admin**: admin@example.com / senha123
- **Usuário**: user@example.com / senha123

## Notas Adicionais

Este projeto foi adaptado para o Laravel 11. As principais alterações incluíram:
1. Verificação e limpeza do arquivo de rotas api.php
2. Verificação dos arquivos web.php e console.php que já estavam compatíveis com Laravel 11
3. Verificação do AppServiceProvider que já estava no formato correto para Laravel 11
4. O bootstrap/app.php já estava usando a nova sintaxe do Laravel 11
