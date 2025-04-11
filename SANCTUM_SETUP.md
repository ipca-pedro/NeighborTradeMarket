# Configuração do Laravel Sanctum após clonar o repositório

Este guia é para quem está clonando o projeto NeighborTrade onde o Laravel Sanctum já está instalado. O Sanctum é o sistema de autenticação utilizado para proteger as rotas da API e gerenciar tokens de acesso.

## Pré-requisitos

- XAMPP com PHP 8.1 ou superior
- Composer instalado
- Node.js e npm instalados

## Passos após clonar o repositório

### 1. Instalar dependências do PHP

O Sanctum já está incluído no `composer.json`, então você só precisa instalar as dependências:

```bash
composer install
```

### 2. Executar as migrations

O banco de dados já deve ter sido criado conforme as instruções no README principal. Agora execute as migrations para criar todas as tabelas necessárias, incluindo a tabela `personal_access_tokens` usada pelo Sanctum:

```bash
php artisan migrate
```

Alternativamente, você pode importar o arquivo `database_dump.sql` que já contém todas as tabelas necessárias:

```bash
php database_dump.php import
```

### 3. Limpar o cache de configuração

Para garantir que todas as configurações sejam carregadas corretamente:

```bash
php artisan config:clear
php artisan cache:clear
```

### 4. Verificar configurações do CORS

O arquivo `config/cors.php` já deve estar configurado corretamente, mas é bom verificar se contém:

```php
'supports_credentials' => true
```

E se o domínio do seu frontend está incluído em `allowed_origins`:

```php
'allowed_origins' => ['http://localhost:3000']
```

### 5. Verificar configurações no .env

Certifique-se de que as seguintes configurações estão no arquivo `.env` (o arquivo já deve estar incluído no repositório):

```
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

## Script de configuração rápida (PowerShell)

Para facilitar a configuração após clonar o repositório, execute o script PowerShell incluído:

```powershell
.\setup_after_clone.ps1
```

Este script vai:
1. Instalar as dependências do Composer
2. Executar as migrations
3. Limpar o cache de configuração
4. Verificar as configurações do CORS e do .env

## Testando a autenticação

Para verificar se o Sanctum está funcionando corretamente:

1. Inicie o servidor Laravel:
   ```bash
   php artisan serve
   ```

2. Inicie o frontend React:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Tente fazer login com as credenciais de teste:
   - **Admin**: admin@example.com / senha123
   - **Usuário**: user@example.com / senha123

## Solução de problemas comuns

### Erro de CORS

Se você estiver enfrentando problemas de CORS:

1. Verifique se o frontend está rodando em `http://localhost:3000`
2. Certifique-se de que o backend está rodando em `http://localhost:8000`
3. Verifique se o `supports_credentials` está definido como `true` no arquivo `config/cors.php`

### Tokens não funcionando

Se os tokens não estiverem funcionando:

1. Verifique se a tabela `personal_access_tokens` existe no banco de dados
2. Limpe o cache de configuração com `php artisan config:clear`
3. Verifique se o modelo `Utilizador` usa o trait `HasApiTokens`

### Erro 401 Unauthorized

Se você estiver recebendo erro 401 ao acessar rotas protegidas:

1. Certifique-se de que o token foi gerado corretamente no login
2. Verifique se o token está sendo enviado no header Authorization
3. Verifique se a rota está protegida com o middleware `auth:sanctum`

### Problemas com o banco de dados

Se houver problemas relacionados ao banco de dados:

1. Verifique se o banco de dados `db_nt` foi criado
2. Certifique-se de que as credenciais no arquivo `.env` estão corretas
3. Tente importar o arquivo `database_dump.sql` usando o script:
   ```bash
   php database_dump.php import
   ```

## Recursos adicionais

- [Documentação oficial do Laravel Sanctum](https://laravel.com/docs/10.x/sanctum)
- [Autenticação SPA com Laravel Sanctum](https://laravel.com/docs/10.x/sanctum#spa-authentication)
