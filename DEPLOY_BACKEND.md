# 🚀 Guia de Deploy: WhatsApp Microservice

Este guia explica como instalar o novo backend `backend-whatsapp` no seu
servidor Linux (Ubuntu/Debian).

## 1. Preparar o Servidor

Acesse seu servidor via SSH e instale Node.js e PM2 (se ainda não tiver):

```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 Globalmente
sudo npm install -g pm2
```

## 2. Enviar os Arquivos

Copie a pasta `backend-whatsapp` do seu computador para o servidor (pode ser via
FileZilla ou SCP). Sugestão de destino: `/var/www/backend-whatsapp`

## 3. Instalar Dependências e Rodar

No servidor, entre na pasta e inicie o serviço:

```bash
cd /var/www/backend-whatsapp
npm install --production

# Iniciar com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

O backend estará rodando na porta **3000**.

## 4. Atualizar o Frontend (Build)

Agora você precisa apontar o seu Frontend (React) para o IP do seu servidor.

1. No seu computador local, abra o arquivo
   `c:\repositorioflutter\Strong-sales\.env`.
2. Altere a variável:
   ```
   VITE_WHATSAPP_API_URL=http://SEU_IP_DO_SERVIDOR:3000
   ```
   _(Substitua `SEU_IP_DO_SERVIDOR` pelo IP real, ex: 147.182.199.133)_

3. Gere o build do Frontend novamente e faça deploy do Frontend.
   ```bash
   npm run build
   ```

---

**Teste:** Acesse `http://SEU_IP_DO_SERVIDOR:3000/` no navegador. Deve responder
`{"status":"online"}`.
