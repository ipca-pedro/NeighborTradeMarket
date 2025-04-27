@echo off
setlocal enabledelayedexpansion

echo Executando testes unitarios...
php artisan test --testsuite=Unit
echo (Errolevel = %ERRORLEVEL%)

echo.
echo Executando testes de API...
php artisan test --testsuite=Feature
echo (Errolevel = %ERRORLEVEL%)

echo.
echo Testes concluidos!

pause
