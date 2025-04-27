@echo off
setlocal

cd /d C:\xampp\htdocs\NT

echo Executando testes unitarios...
php artisan test --testsuite=Unit > resultado_unit.txt

echo Executando testes de API...
php artisan test --testsuite=Feature > resultado_api.txt

echo Unindo os resultados...
type resultado_unit.txt > resultado_final.txt
echo. >> resultado_final.txt
type resultado_api.txt >> resultado_final.txt

echo Gerando PDF via PHP...
php C:\xampp\htdocs\NT\scripts\gerar_relatorio.php  // Caminho absoluto para o arquivo PHP

echo Testes concluidos! Resultado em relatorio_testes.pdf
pause
