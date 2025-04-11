# Script para corrigir erros de sintaxe no frontend do NeighborTradeMarket
# Este script atualiza as configurações do Babel e reinstala as dependências necessárias

Write-Host "Iniciando correção de erros de sintaxe no frontend..." -ForegroundColor Cyan

# Verificar se estamos no diretório correto
if (-not (Test-Path "frontend")) {
    Write-Host "ERRO: Diretório 'frontend' não encontrado. Execute este script no diretório raiz do projeto." -ForegroundColor Red
    exit 1
}

# Entrar no diretório frontend
Set-Location frontend

# Verificar se o package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "ERRO: Arquivo package.json não encontrado no diretório frontend." -ForegroundColor Red
    exit 1
}

# Backup do package.json original
Write-Host "Fazendo backup do package.json..." -ForegroundColor Yellow
Copy-Item "package.json" "package.json.bak"

# Ler o conteúdo do package.json
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

# Verificar e atualizar as dependências do Babel
Write-Host "Verificando e atualizando dependências do Babel..." -ForegroundColor Yellow

# Lista de dependências do Babel necessárias
$babelDependencies = @{
    "@babel/core" = "^7.22.5"
    "@babel/preset-env" = "^7.22.5"
    "@babel/preset-react" = "^7.22.5"
    "babel-loader" = "^9.1.2"
}

# Verificar se as dependências já existem
$devDependencies = $packageJson.devDependencies
if (-not $devDependencies) {
    $packageJson | Add-Member -NotePropertyName "devDependencies" -NotePropertyValue ([PSCustomObject]@{})
    $devDependencies = $packageJson.devDependencies
}

# Adicionar ou atualizar as dependências do Babel
foreach ($dep in $babelDependencies.GetEnumerator()) {
    $name = $dep.Key
    $version = $dep.Value
    
    if (-not ($devDependencies | Get-Member -Name $name)) {
        $devDependencies | Add-Member -NotePropertyName $name -NotePropertyValue $version
        Write-Host "Adicionada dependência: $name $version" -ForegroundColor Green
    } else {
        $devDependencies.$name = $version
        Write-Host "Atualizada dependência: $name para $version" -ForegroundColor Yellow
    }
}

# Salvar as alterações no package.json
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
Write-Host "Arquivo package.json atualizado com sucesso!" -ForegroundColor Green

# Criar ou atualizar o arquivo .babelrc
Write-Host "Criando/atualizando arquivo .babelrc..." -ForegroundColor Yellow
$babelrcContent = @"
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": [">0.25%", "not ie 11", "not op_mini all"]
      },
      "useBuiltIns": "usage",
      "corejs": 3
    }],
    "@babel/preset-react"
  ],
  "plugins": []
}
"@
Set-Content -Path ".babelrc" -Value $babelrcContent
Write-Host "Arquivo .babelrc criado/atualizado com sucesso!" -ForegroundColor Green

# Verificar se o arquivo jsconfig.json existe e criar se não existir
if (-not (Test-Path "jsconfig.json")) {
    Write-Host "Criando arquivo jsconfig.json..." -ForegroundColor Yellow
    $jsconfigContent = @"
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "jsx": "react",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
"@
    Set-Content -Path "jsconfig.json" -Value $jsconfigContent
    Write-Host "Arquivo jsconfig.json criado com sucesso!" -ForegroundColor Green
}

# Corrigir o arquivo anuncioService.js
Write-Host "Verificando e corrigindo o arquivo anuncioService.js..." -ForegroundColor Yellow
$anuncioServicePath = "src\services\anuncioService.js"
if (Test-Path $anuncioServicePath) {
    $anuncioServiceContent = Get-Content $anuncioServicePath -Raw
    
    # Verificar se o conteúdo contém a sintaxe problemática
    if ($anuncioServiceContent -match "catch \(error\)") {
        Write-Host "Encontrada sintaxe problemática em anuncioService.js. Corrigindo..." -ForegroundColor Yellow
        
        # Fazer backup do arquivo original
        Copy-Item $anuncioServicePath "$anuncioServicePath.bak"
        
        # Corrigir a sintaxe
        $correctedContent = $anuncioServiceContent -replace "catch \(error\)", "catch (error) {"
        $correctedContent = $correctedContent -replace "return \[\];", "return [];};"
        $correctedContent = $correctedContent -replace "return \{ resultados: \[\], total: 0 \};", "return { resultados: [], total: 0 };};"
        
        # Salvar o conteúdo corrigido
        Set-Content -Path $anuncioServicePath -Value $correctedContent
        Write-Host "Arquivo anuncioService.js corrigido com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Arquivo anuncioService.js não contém a sintaxe problemática." -ForegroundColor Green
    }
} else {
    Write-Host "Arquivo anuncioService.js não encontrado." -ForegroundColor Yellow
}

# Corrigir o arquivo api.js
Write-Host "Verificando e corrigindo o arquivo api.js..." -ForegroundColor Yellow
$apiPath = "src\services\api.js"
if (Test-Path $apiPath) {
    $apiContent = Get-Content $apiPath -Raw
    
    # Verificar se o conteúdo contém a sintaxe problemática
    if ($apiContent -match "catch \(error\)") {
        Write-Host "Encontrada sintaxe problemática em api.js. Corrigindo..." -ForegroundColor Yellow
        
        # Fazer backup do arquivo original
        Copy-Item $apiPath "$apiPath.bak"
        
        # Corrigir a sintaxe - garantir que todos os blocos catch tenham chaves
        $correctedContent = $apiContent -replace "catch \(error\)([^{])", "catch (error) {$1"
        $correctedContent = $correctedContent -replace "throw error\.response\?\.(data|message);", "throw error.response?.$1;};"
        $correctedContent = $correctedContent -replace "throw error;", "throw error;};"
        $correctedContent = $correctedContent -replace "throw error\.response\?\.(data|message) \|\| error\.message;", "throw error.response?.$1 || error.message;};"
        
        # Salvar o conteúdo corrigido
        Set-Content -Path $apiPath -Value $correctedContent
        Write-Host "Arquivo api.js corrigido com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Arquivo api.js não contém a sintaxe problemática." -ForegroundColor Green
    }
} else {
    Write-Host "Arquivo api.js não encontrado." -ForegroundColor Yellow
}

# Instalar dependências
Write-Host "Instalando dependências do frontend..." -ForegroundColor Cyan
npm install

# Retornar ao diretório raiz
Set-Location ..

Write-Host "`nCorreção de erros de sintaxe no frontend concluída!" -ForegroundColor Green
Write-Host "`nPróximos passos:" -ForegroundColor Cyan
Write-Host "1. Inicie o servidor Laravel: php artisan serve" -ForegroundColor White
Write-Host "2. Inicie o frontend React: cd frontend && npm start" -ForegroundColor White
Write-Host "3. Acesse o frontend em: http://localhost:3000" -ForegroundColor White
Write-Host "`nSe o problema persistir, verifique os logs no console do navegador." -ForegroundColor White
