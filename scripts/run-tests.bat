@echo off
setlocal

cd /d C:\xampp\htdocs\NT
echo Diretorio atual: %CD%
pause

echo Executando testes unitarios...
echo (Os erros serao exibidos na tela)
php artisan test --testsuite=Unit
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Erro ao executar testes unitarios! Verifique as mensagens acima.
    pause
    exit /b %ERRORLEVEL%
)
php artisan test --testsuite=Unit > resultado_unit.txt
echo Testes unitarios concluidos e salvos.
pause

echo Executando testes de API...
echo (Os erros serao exibidos na tela)
php artisan test --testsuite=Feature
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Erro ao executar testes de API! Verifique as mensagens acima.
    pause
    exit /b %ERRORLEVEL%
)
php artisan test --testsuite=Feature > resultado_api.txt
echo Testes de API concluidos e salvos.
pause

echo Unindo os resultados...
type resultado_unit.txt > resultado_final.txt
echo. >> resultado_final.txt
type resultado_api.txt >> resultado_final.txt
if %ERRORLEVEL% NEQ 0 (
    echo Erro ao unir os resultados!
    pause
    exit /b %ERRORLEVEL%
)
echo Resultados unidos com sucesso.
pause

echo Gerando relatorio HTML...
php C:\xampp\htdocs\NT\scripts\gerar_relatorio_html.php
if %ERRORLEVEL% NEQ 0 (
    echo Erro ao gerar o relatorio HTML!
    pause
    exit /b %ERRORLEVEL%
)
echo Relatorio HTML gerado com sucesso.
pause

echo Abrindo o relatorio no navegador padrao...
if exist "relatorio_testes.html" (
    start "" "relatorio_testes.html"
    echo Relatorio aberto no navegador.
) else (
    echo ERRO: Arquivo relatorio_testes.html nao foi encontrado!
)

echo Testes concluidos! Pressione qualquer tecla para sair.
pause
