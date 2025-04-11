git # Script de configuração após clonar o repositório NeighborTrade
# Este script configura o ambiente após o clone, sem reinstalar o Sanctum

Write-Host "Configurando o ambiente após clonar o repositório..." -ForegroundColor Cyan

# Verificar se o PHP está no PATH
try {
    $phpVersion = php -v
    Write-Host "PHP encontrado: $phpVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: PHP não encontrado no PATH. Verifique se o XAMPP está instalado e o PHP está no PATH." -ForegroundColor Red
    exit 1
}

# Verificar se o Composer está instalado
try {
    $composerVersion = composer --version
    Write-Host "Composer encontrado: $composerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Composer não encontrado. Instale o Composer antes de continuar." -ForegroundColor Red
    exit 1
}

# Instalar dependências do Composer
Write-Host "Instalando dependências do Composer..." -ForegroundColor Cyan
composer install

# Verificar se o banco de dados existe
Write-Host "Verificando conexão com o banco de dados..." -ForegroundColor Cyan
$dbExists = $false
try {
    # Usar as configurações do .env para verificar o banco de dados
    if (Test-Path .env) {
        $envContent = Get-Content .env -Raw
        $dbName = ""
        $dbUser = ""
        $dbPass = ""
        
        if ($envContent -match "DB_DATABASE=([^\r\n]+)") {
            $dbName = $matches[1]
        }
        if ($envContent -match "DB_USERNAME=([^\r\n]+)") {
            $dbUser = $matches[1]
        }
        if ($envContent -match "DB_PASSWORD=([^\r\n]+)") {
            $dbPass = $matches[1]
        }
        
        Write-Host "Verificando banco de dados: $dbName" -ForegroundColor Cyan
        
        # Verificar se o MySQL está rodando
        $mysqlRunning = $false
        try {
            $processes = Get-Process -Name "mysqld" -ErrorAction SilentlyContinue
            if ($processes) {
                $mysqlRunning = $true
            }
        } catch {
            # Ignorar erros
        }
        
        if (-not $mysqlRunning) {
            Write-Host "AVISO: O MySQL não parece estar em execução. Inicie o MySQL no painel de controle do XAMPP." -ForegroundColor Yellow
        }
    } else {
        Write-Host "AVISO: Arquivo .env não encontrado." -ForegroundColor Yellow
    }
} catch {
    Write-Host "AVISO: Não foi possível verificar o banco de dados. Certifique-se de que o MySQL está em execução." -ForegroundColor Yellow
}

# Perguntar se deseja importar o dump do banco de dados
$importDump = Read-Host "Deseja importar o dump do banco de dados? (S/N)"
if ($importDump -eq "S" -or $importDump -eq "s") {
    Write-Host "Importando dump do banco de dados..." -ForegroundColor Cyan
    php database_dump.php import
}

# Executar migrations
Write-Host "Executando migrations..." -ForegroundColor Cyan
php artisan migrate

# Limpar cache
Write-Host "Limpando cache..." -ForegroundColor Cyan
php artisan config:clear
php artisan cache:clear

# Verificar configurações do CORS
Write-Host "Verificando configurações do CORS..." -ForegroundColor Cyan
$corsPath = "config/cors.php"
if (Test-Path $corsPath) {
    $corsContent = Get-Content $corsPath -Raw
    if ($corsContent -match "'supports_credentials' => true") {
        Write-Host "Configuração do CORS está correta." -ForegroundColor Green
    } else {
        Write-Host "AVISO: A configuração 'supports_credentials' pode não estar definida como 'true' no arquivo config/cors.php." -ForegroundColor Yellow
        Write-Host "Isso pode causar problemas de CORS. Verifique o arquivo manualmente." -ForegroundColor Yellow
    }
    
    if ($corsContent -match "'allowed_origins' => \[.*'http://localhost:3000'.*\]") {
        Write-Host "Frontend localhost:3000 está nas origens permitidas." -ForegroundColor Green
    } else {
        Write-Host "AVISO: O frontend 'http://localhost:3000' pode não estar nas origens permitidas no arquivo config/cors.php." -ForegroundColor Yellow
        Write-Host "Isso pode causar problemas de CORS. Verifique o arquivo manualmente." -ForegroundColor Yellow
    }
} else {
    Write-Host "AVISO: Arquivo de configuração do CORS não encontrado." -ForegroundColor Yellow
}

# Verificar configurações do .env para o Sanctum
Write-Host "Verificando configurações do Sanctum no .env..." -ForegroundColor Cyan
if (Test-Path .env) {
    $envContent = Get-Content .env -Raw
    $needsUpdate = $false
    
    if (-not ($envContent -match "SANCTUM_STATEFUL_DOMAINS")) {
        $needsUpdate = $true
        Write-Host "AVISO: SANCTUM_STATEFUL_DOMAINS não encontrado no .env" -ForegroundColor Yellow
    }
    
    if (-not ($envContent -match "SESSION_DOMAIN")) {
        $needsUpdate = $true
        Write-Host "AVISO: SESSION_DOMAIN não encontrado no .env" -ForegroundColor Yellow
    }
    
    if ($needsUpdate) {
        $addToEnv = Read-Host "Deseja adicionar as configurações do Sanctum ao .env? (S/N)"
        if ($addToEnv -eq "S" -or $addToEnv -eq "s") {
            Add-Content -Path .env -Value "`nSANCTUM_STATEFUL_DOMAINS=localhost:3000`nSESSION_DOMAIN=localhost"
            Write-Host "Configurações adicionadas ao .env" -ForegroundColor Green
        }
    } else {
        Write-Host "Configurações do Sanctum no .env estão corretas." -ForegroundColor Green
    }
} else {
    Write-Host "AVISO: Arquivo .env não encontrado." -ForegroundColor Yellow
}

# Criar link simbólico para storage
Write-Host "Criando link simbólico para storage..." -ForegroundColor Cyan
php artisan storage:link

Write-Host "`nConfiguração concluída com sucesso!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Inicie o servidor Laravel: php artisan serve" -ForegroundColor White
Write-Host "2. Inicie o frontend React: cd frontend && npm install && npm start" -ForegroundColor White
Write-Host "3. Acesse o frontend em: http://localhost:3000" -ForegroundColor White
Write-Host "4. Faça login com as credenciais de teste:" -ForegroundColor White
Write-Host "   - Admin: admin@example.com / senha123" -ForegroundColor White
Write-Host "   - Usuário: user@example.com / senha123" -ForegroundColor White
