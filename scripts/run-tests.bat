@echo off
setlocal

cd /d C:\xampp\htdocs\NT
echo Diretorio atual: %CD%
pause

echo Executando testes unitários...
php artisan test --testsuite=Unit > resultado_unit.txt
echo Testes unitários concluídos.
pause

echo Executando testes de API...
php artisan test --testsuite=Feature > resultado_api.txt
echo Testes de API concluídos.
pause

echo Executando todos os testes (suite Basic)...
php artisan test --testsuite=Basic > resultado_basic.txt
echo Testes da suite Basic concluídos.
pause

echo Unindo todos os resultados...
type resultado_unit.txt > resultado_final.txt
echo. >> resultado_final.txt
type resultado_api.txt >> resultado_final.txt
echo. >> resultado_final.txt
type resultado_basic.txt >> resultado_final.txt
echo Resultados unidos em resultado_final.txt
pause

echo [DEBUG] Antes de gerar relatorio HTML…
if exist resultado_final.txt (
    echo [DEBUG] resultado_final.txt encontrado!
) else (
    echo [ERRO] resultado_final.txt NAO encontrado! O ficheiro PHP NAO sera executado.
    pause
    exit /b 1
)
echo [DEBUG] A executar o comando PHP...
php "%CD%\scripts\gerar_relatorio_html.php"
echo [DEBUG] Comando PHP terminou com errolevel %ERRORLEVEL%.
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
