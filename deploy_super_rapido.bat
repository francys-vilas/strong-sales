@echo off
echo ==========================================
echo 🚀 DEPLOY AUTOMATICO BACKEND WHATSAPP
echo ==========================================
echo.
echo 1. Enviando arquivo ZIP para o servidor...
scp backend-whatsapp-deploy.zip root@147.182.199.133:/root/
echo.
echo 2. Conectando no servidor para instalar...
ssh -t root@147.182.199.133 "apt update && apt install -y unzip nodejs npm && npm install -g pm2 && unzip -o backend-whatsapp-deploy.zip -d /var/www/backend-whatsapp && cd /var/www/backend-whatsapp && npm install --production && pm2 delete whatsapp-api 2>/dev/null || true && pm2 start ecosystem.config.js && pm2 save && pm2 startup"
echo.
echo ==========================================
echo ✅ DEPLOY CONCLUIDO COM SUCESSO!
echo ==========================================
echo Agora atualize seu .env do frontend com:
echo VITE_WHATSAPP_API_URL=http://147.182.199.133:3000
echo ==========================================
pause
