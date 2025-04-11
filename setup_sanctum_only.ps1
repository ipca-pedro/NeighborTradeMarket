# Script para configuração apenas do Sanctum no projeto NeighborTrade
# Este script configura apenas o Sanctum, assumindo que o resto do ambiente já está configurado

Write-Host "Configurando apenas o Laravel Sanctum..." -ForegroundColor Cyan

# Verificar se está no diretório correto (raiz do projeto Laravel)
if (-not (Test-Path "artisan")) {
    Write-Host "ERRO: Este script deve ser executado na pasta raiz do projeto Laravel." -ForegroundColor Red
    Write-Host "Certifique-se de estar no diretório que contém o arquivo 'artisan'." -ForegroundColor Red
    exit 1
}

# Instalar o Sanctum
Write-Host "Instalando Laravel Sanctum..." -ForegroundColor Green
try {
    composer require laravel/sanctum
} catch {
    Write-Host "ERRO ao instalar o Sanctum. Verifique se o Composer está instalado e configurado corretamente." -ForegroundColor Red
    Write-Host "Erro: $_" -ForegroundColor Red
    exit 1
}

# Publicar os arquivos de configuração
Write-Host "Publicando arquivos de configuração do Sanctum..." -ForegroundColor Green
try {
    php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
} catch {
    Write-Host "ERRO ao publicar os arquivos de configuração do Sanctum." -ForegroundColor Red
    Write-Host "Erro: $_" -ForegroundColor Red
}

# Executar as migrations
Write-Host "Executando migrations..." -ForegroundColor Green
try {
    # Primeiro verificar se a migration existe
    $migrationPath = Get-ChildItem -Path "database/migrations" -Filter "*_create_personal_access_tokens_table.php" -Recurse
    
    if ($migrationPath) {
        Write-Host "Migration do Sanctum encontrada: $($migrationPath.Name)" -ForegroundColor Green
        php artisan migrate
    } else {
        Write-Host "Migration do Sanctum não encontrada. Executando todas as migrations..." -ForegroundColor Yellow
        php artisan migrate
    }
} catch {
    Write-Host "ERRO ao executar as migrations." -ForegroundColor Red
    Write-Host "Erro: $_" -ForegroundColor Red
}

# Configurar o middleware no Kernel.php se ainda não estiver configurado
Write-Host "Verificando configuração do middleware..." -ForegroundColor Green
$kernelPath = "app/Http/Kernel.php"

if (Test-Path $kernelPath) {
    try {
        $kernelContent = Get-Content $kernelPath -Raw -ErrorAction Stop
        
        if (-not ($kernelContent -match "Laravel\\Sanctum\\Http\\Middleware\\EnsureFrontendRequestsAreStateful")) {
            Write-Host "Adicionando middleware do Sanctum ao Kernel.php..." -ForegroundColor Yellow
            
            # Abordagem mais segura para modificar o arquivo
            if ($kernelContent -match "'api' => \[([^\]]*?)\]") {
                $apiMiddlewareContent = $matches[1]
                $newApiMiddlewareContent = "\n        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class," + $apiMiddlewareContent
                $kernelContent = $kernelContent -replace "'api' => \[([^\]]*?)\]", "'api' => [$newApiMiddlewareContent]"
                
                # Salvar as alterações
                Set-Content -Path $kernelPath -Value $kernelContent -ErrorAction Stop
                Write-Host "Middleware adicionado com sucesso!" -ForegroundColor Green
            } else {
                Write-Host "AVISO: Não foi possível encontrar o grupo de middleware 'api' no Kernel.php." -ForegroundColor Yellow
                Write-Host "Você precisará adicionar o middleware manualmente:" -ForegroundColor Yellow
                Write-Host "\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class" -ForegroundColor White
            }
        } else {
            Write-Host "Middleware do Sanctum já está configurado." -ForegroundColor Green
        }
    } catch {
        Write-Host "ERRO ao modificar o arquivo Kernel.php: $_" -ForegroundColor Red
        Write-Host "Você precisará adicionar o middleware manualmente:" -ForegroundColor Yellow
        Write-Host "\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class" -ForegroundColor White
    }
} else {
    Write-Host "ERRO: Arquivo Kernel.php não encontrado em $kernelPath" -ForegroundColor Red
}

# Configurar o CORS para o Sanctum
Write-Host "Configurando CORS para o Sanctum..." -ForegroundColor Green
$corsPath = "config/cors.php"

if (Test-Path $corsPath) {
    try {
        $corsContent = Get-Content $corsPath -Raw -ErrorAction Stop
        
        # Verificar se já está configurado
        if (-not ($corsContent -match "'supports_credentials' => true")) {
            Write-Host "Atualizando configuração do CORS..." -ForegroundColor Yellow
            
            if ($corsContent -match "'supports_credentials' => false") {
                # Substituir false por true
                $corsContent = $corsContent -replace "'supports_credentials' => false", "'supports_credentials' => true"
                Set-Content -Path $corsPath -Value $corsContent -ErrorAction Stop
                Write-Host "CORS configurado com sucesso!" -ForegroundColor Green
            } else {
                Write-Host "AVISO: Não foi possível encontrar a configuração 'supports_credentials' no arquivo CORS." -ForegroundColor Yellow
                Write-Host "Verifique manualmente se o arquivo config/cors.php contém:" -ForegroundColor Yellow
                Write-Host "'supports_credentials' => true" -ForegroundColor White
            }
        } else {
            Write-Host "CORS já está configurado corretamente." -ForegroundColor Green
        }
        
        # Verificar também se as rotas do Sanctum estão incluídas nos paths
        if (-not ($corsContent -match "'paths' => \[.*?'sanctum/csrf-cookie'.*?\]")) {
            Write-Host "Adicionando 'sanctum/csrf-cookie' aos paths do CORS..." -ForegroundColor Yellow
            
            if ($corsContent -match "'paths' => \[(.*?)\]") {
                $pathsContent = $matches[1]
                # Verificar se já contém api/*
                if ($pathsContent -match "'api/\*'") {
                    # Adicionar sanctum/csrf-cookie após api/*
                    $newPathsContent = $pathsContent -replace "'api/\*'", "'api/*', 'sanctum/csrf-cookie'"
                    $corsContent = $corsContent -replace "'paths' => \[(.*?)\]", "'paths' => [$newPathsContent]"
                    Set-Content -Path $corsPath -Value $corsContent -ErrorAction Stop
                    Write-Host "Paths do CORS atualizados com sucesso!" -ForegroundColor Green
                }
            }
        }
    } catch {
        Write-Host "ERRO ao modificar o arquivo CORS: $_" -ForegroundColor Red
        Write-Host "Você precisará configurar o CORS manualmente:" -ForegroundColor Yellow
        Write-Host "1. Defina 'supports_credentials' => true" -ForegroundColor White
        Write-Host "2. Adicione 'sanctum/csrf-cookie' ao array 'paths'" -ForegroundColor White
    }
} else {
    Write-Host "ERRO: Arquivo de configuração CORS não encontrado em $corsPath" -ForegroundColor Red
}

# Adicionar variáveis do Sanctum ao .env se necessário
Write-Host "Verificando configurações do Sanctum no .env..." -ForegroundColor Green
$envPath = ".env"

if (Test-Path $envPath) {
    try {
        $envContent = Get-Content $envPath -Raw -ErrorAction Stop
        $needsUpdate = $false
        
        # Verificar SANCTUM_STATEFUL_DOMAINS
        if (-not ($envContent -match "SANCTUM_STATEFUL_DOMAINS")) {
            $needsUpdate = $true
            Write-Host "SANCTUM_STATEFUL_DOMAINS não encontrado no .env" -ForegroundColor Yellow
        }
        
        # Verificar SESSION_DOMAIN
        if (-not ($envContent -match "SESSION_DOMAIN")) {
            $needsUpdate = $true
            Write-Host "SESSION_DOMAIN não encontrado no .env" -ForegroundColor Yellow
        }
        
        if ($needsUpdate) {
            Write-Host "Adicionando configurações do Sanctum ao .env..." -ForegroundColor Yellow
            try {
                Add-Content -Path $envPath -Value "`n# Configurações do Sanctum`nSANCTUM_STATEFUL_DOMAINS=localhost:3000`nSESSION_DOMAIN=localhost" -ErrorAction Stop
                Write-Host "Configurações adicionadas ao .env" -ForegroundColor Green
            } catch {
                Write-Host "ERRO ao adicionar configurações ao .env: $_" -ForegroundColor Red
                Write-Host "Adicione manualmente as seguintes linhas ao arquivo .env:" -ForegroundColor Yellow
                Write-Host "SANCTUM_STATEFUL_DOMAINS=localhost:3000" -ForegroundColor White
                Write-Host "SESSION_DOMAIN=localhost" -ForegroundColor White
            }
        } else {
            Write-Host "Configurações do Sanctum já existem no .env" -ForegroundColor Green
        }
    } catch {
        Write-Host "ERRO ao ler o arquivo .env: $_" -ForegroundColor Red
    }
} else {
    Write-Host "ERRO: Arquivo .env não encontrado" -ForegroundColor Red
    Write-Host "Crie um arquivo .env na raiz do projeto e adicione:" -ForegroundColor Yellow
    Write-Host "SANCTUM_STATEFUL_DOMAINS=localhost:3000" -ForegroundColor White
    Write-Host "SESSION_DOMAIN=localhost" -ForegroundColor White
}

# Limpar o cache de configuração
Write-Host "Limpando cache..." -ForegroundColor Green
try {
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    php artisan view:clear
    Write-Host "Cache limpo com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO ao limpar o cache: $_" -ForegroundColor Red
}

# Resumo das ações realizadas
Write-Host "`n=== Resumo da configuração do Sanctum ===" -ForegroundColor Cyan
Write-Host "1. Sanctum instalado via Composer" -ForegroundColor White
Write-Host "2. Arquivos de configuração publicados" -ForegroundColor White
Write-Host "3. Migrations executadas" -ForegroundColor White
Write-Host "4. Middleware configurado no Kernel.php" -ForegroundColor White
Write-Host "5. CORS configurado para funcionar com o Sanctum" -ForegroundColor White
Write-Host "6. Variáveis de ambiente adicionadas ao .env" -ForegroundColor White
Write-Host "7. Cache limpo" -ForegroundColor White

Write-Host "`nConfiguração do Sanctum concluída com sucesso!" -ForegroundColor Green
Write-Host "O Laravel Sanctum está pronto para uso no seu projeto." -ForegroundColor Cyan

# Instruções adicionais
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Verifique se o modelo Utilizador usa o trait HasApiTokens" -ForegroundColor White
Write-Host "   use Laravel\Sanctum\HasApiTokens;" -ForegroundColor White
Write-Host "2. Certifique-se de que as rotas protegidas usam o middleware auth:sanctum" -ForegroundColor White
Write-Host "   Route::middleware('auth:sanctum')->group(function () { ... });" -ForegroundColor White
