@echo off
echo ===================================================
echo   DEPLOY DEFINITIVO - STRONG SALES WHATSAPP
echo ===================================================
echo.
echo 1. Enviando arquivos para o servidor...
scp -o StrictHostKeyChecking=no backend-unified.zip root@147.182.199.133:/root/
if %errorlevel% neq 0 (
    echo [ERRO] Falha no upload. Verifique a senha e tente novamente.
    pause
    exit /b
)

echo.
echo 2. Executando instalacao remota (Limpeza + Deploy)...
ssh -o StrictHostKeyChecking=no -t root@147.182.199.133 "apt install -y unzip && rm -rf /var/www/backend-whatsapp/backend-whatsapp && unzip -o /root/backend-unified.zip -d /var/www/backend-whatsapp && cd /var/www/backend-whatsapp/backend-whatsapp && docker rm -f whatsapp-api evolution-api whatsapp-manager-api whatsapp_postgres whatsapp_redis 2>/dev/null; docker-compose down --remove-orphans || true; docker-compose up -d --build"

echo.
echo ===================================================
echo   DEPLOY CONCLUIDO!
echo   Aguarde 30 segundos e teste o sistema.
echo ===================================================
pause
