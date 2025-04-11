# Script de instalação do Laravel Sanctum para o NeighborTrade
# Este script automatiza o processo de instalação e configuração do Sanctum

# Instalar o Sanctum
Write-Host "Instalando Laravel Sanctum..." -ForegroundColor Green
composer require laravel/sanctum

# Publicar os arquivos de configuração
Write-Host "Publicando arquivos de configuração..." -ForegroundColor Green
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Executar as migrations
Write-Host "Executando migrations..." -ForegroundColor Green
php artisan migrate

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

# Configurar o CORS
Write-Host "Configurando CORS..." -ForegroundColor Green
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

# Verificar se o modelo Utilizador usa HasApiTokens
Write-Host "Verificando modelo de usuário..." -ForegroundColor Green
$modelPath = "app/Models/Utilizador.php"
if (Test-Path $modelPath) {
    $modelContent = Get-Content $modelPath -Raw
    if (-not ($modelContent -match "use Laravel\\Sanctum\\HasApiTokens")) {
        Write-Host "O modelo Utilizador precisa ser atualizado manualmente para usar HasApiTokens." -ForegroundColor Yellow
        Write-Host "Adicione 'use Laravel\Sanctum\HasApiTokens;' aos imports" -ForegroundColor Yellow
        Write-Host "E adicione HasApiTokens aos traits: 'use HasApiTokens, HasFactory, Notifiable;'" -ForegroundColor Yellow
    } else {
        Write-Host "Modelo Utilizador já está configurado corretamente." -ForegroundColor Green
    }
} else {
    Write-Host "Modelo Utilizador não encontrado. Verifique o caminho do arquivo." -ForegroundColor Red
}

# Limpar o cache de configuração
Write-Host "Limpando cache..." -ForegroundColor Green
php artisan config:clear
php artisan cache:clear

# Adicionar variáveis ao .env se necessário
Write-Host "Verificando configurações no .env..." -ForegroundColor Green
$envPath = ".env"
$envContent = Get-Content $envPath -Raw

if (-not ($envContent -match "SANCTUM_STATEFUL_DOMAINS")) {
    Write-Host "Adicionando configurações do Sanctum ao .env..." -ForegroundColor Yellow
    Add-Content -Path $envPath -Value "`nSANCTUM_STATEFUL_DOMAINS=localhost:3000`nSESSION_DOMAIN=localhost"
    Write-Host "Configurações adicionadas ao .env" -ForegroundColor Green
} else {
    Write-Host "Configurações do Sanctum já existem no .env" -ForegroundColor Green
}

Write-Host "`nInstalação do Laravel Sanctum concluída com sucesso!" -ForegroundColor Green
Write-Host "Leia o arquivo SANCTUM_SETUP.md para mais informações e solução de problemas." -ForegroundColor Cyan
