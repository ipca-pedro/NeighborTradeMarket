# Script para configuração apenas do Sanctum no projeto NeighborTrade
# Este script configura apenas o Sanctum, assumindo que o resto do ambiente já está configurado

Write-Host "Configurando apenas o Laravel Sanctum..." -ForegroundColor Cyan

# Instalar o Sanctum
Write-Host "Instalando Laravel Sanctum..." -ForegroundColor Green
composer require laravel/sanctum

# Publicar os arquivos de configuração
Write-Host "Publicando arquivos de configuração do Sanctum..." -ForegroundColor Green
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Executar as migrations específicas do Sanctum
Write-Host "Executando migrations do Sanctum..." -ForegroundColor Green
php artisan migrate --path=/database/migrations/2019_12_14_000001_create_personal_access_tokens_table.php

# Configurar o middleware no Kernel.php se ainda não estiver configurado
Write-Host "Verificando configuração do middleware..." -ForegroundColor Green
$kernelPath = "app/Http/Kernel.php"
$kernelContent = Get-Content $kernelPath -Raw

if (-not ($kernelContent -match "Laravel\\Sanctum\\Http\\Middleware\\EnsureFrontendRequestsAreStateful")) {
    Write-Host "Adicionando middleware do Sanctum ao Kernel.php..." -ForegroundColor Yellow
    $kernelContent = $kernelContent -replace "'api' => \[\s*", "'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        "
    Set-Content -Path $kernelPath -Value $kernelContent
    Write-Host "Middleware adicionado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Middleware do Sanctum já está configurado." -ForegroundColor Green
}

# Configurar o CORS para o Sanctum
Write-Host "Configurando CORS para o Sanctum..." -ForegroundColor Green
$corsPath = "config/cors.php"
$corsContent = Get-Content $corsPath -Raw

if (-not ($corsContent -match "'supports_credentials' => true")) {
    Write-Host "Atualizando configuração do CORS..." -ForegroundColor Yellow
    $corsContent = $corsContent -replace "'supports_credentials' => false", "'supports_credentials' => true"
    Set-Content -Path $corsPath -Value $corsContent
    Write-Host "CORS configurado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "CORS já está configurado corretamente." -ForegroundColor Green
}

# Adicionar variáveis do Sanctum ao .env se necessário
Write-Host "Verificando configurações do Sanctum no .env..." -ForegroundColor Green
$envPath = ".env"
$envContent = Get-Content $envPath -Raw

if (-not ($envContent -match "SANCTUM_STATEFUL_DOMAINS")) {
    Write-Host "Adicionando configurações do Sanctum ao .env..." -ForegroundColor Yellow
    Add-Content -Path $envPath -Value "`nSANCTUM_STATEFUL_DOMAINS=localhost:3000`nSESSION_DOMAIN=localhost"
    Write-Host "Configurações adicionadas ao .env" -ForegroundColor Green
} else {
    Write-Host "Configurações do Sanctum já existem no .env" -ForegroundColor Green
}

# Limpar o cache de configuração
Write-Host "Limpando cache..." -ForegroundColor Green
php artisan config:clear
php artisan cache:clear

Write-Host "`nConfiguração do Sanctum concluída com sucesso!" -ForegroundColor Green
Write-Host "`nO Laravel Sanctum está pronto para uso no seu projeto." -ForegroundColor Cyan
