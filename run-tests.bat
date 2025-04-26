@echo off
echo Executando testes unitarios...
php artisan test --testsuite=Unit

echo.
echo Executando testes de API...
php artisan test --testsuite=Feature

echo.
echo Testes concluidos! 