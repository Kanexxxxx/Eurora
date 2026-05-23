# Deploy em VPS

Checklist para colocar a EURORA LOVE em producao.

## 0. Preparar VPS sem apagar o projeto atual

Este projeto usa PostgreSQL local na VPS e salva fotos/QR codes em disco.

O script abaixo instala apenas dependencias do servidor:

- Node.js 22
- npm
- PM2
- Nginx
- Certbot
- PostgreSQL
- Git/build tools
- regras basicas de firewall

Ele nao apaga pasta, nao roda `git reset`, nao altera `.env` e nao reinicia app existente.

```bash
cd /caminho/do/projeto/eurora-love
sudo bash infra/vps-setup-ubuntu.sh
```

Se o projeto ainda nao estiver na VPS:

```bash
cd /var/www
git clone https://github.com/Kanexxxxx/Eurora.git eurora
cd /var/www/eurora/eurora-love
sudo bash infra/vps-setup-ubuntu.sh
```

Se ja existe projeto na VPS, antes de atualizar faca backup do `.env`:

```bash
cd /caminho/do/projeto/eurora-love
cp .env ".env.backup-$(date +%Y%m%d-%H%M%S)"
```

## 1. Variaveis obrigatorias

### PostgreSQL local

Crie banco e usuario na VPS:

```bash
sudo -u postgres psql
```

Dentro do prompt do PostgreSQL:

```sql
CREATE USER eurora WITH PASSWORD 'TROQUE_POR_UMA_SENHA_FORTE';
CREATE DATABASE eurora_love OWNER eurora;
GRANT ALL PRIVILEGES ON DATABASE eurora_love TO eurora;
\q
```

Guarde a senha para o `.env`.

### Uploads locais

Crie a pasta que vai guardar fotos e QR codes:

```bash
sudo mkdir -p /var/www/eurora/uploads
sudo chown -R root:root /var/www/eurora/uploads
sudo chmod -R 755 /var/www/eurora/uploads
```

Crie `.env` no servidor com:

```env
DATABASE_URL=postgresql://eurora:TROQUE_POR_UMA_SENHA_FORTE@127.0.0.1:5432/eurora_love
DIRECT_URL=postgresql://eurora:TROQUE_POR_UMA_SENHA_FORTE@127.0.0.1:5432/eurora_love
UPLOAD_DIR=/var/www/eurora/uploads
UPLOAD_PUBLIC_URL=https://eurora.site/uploads
ASAAS_API_KEY=
ASAAS_API_URL=https://api.asaas.com/v3
ASAAS_WEBHOOK_TOKEN=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=no-reply@eurora.site
CRON_SECRET=
NEXT_PUBLIC_APP_URL=https://eurora.site
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_SUPPORT_EMAIL=
ADMIN_PASSWORD=
NODE_ENV=production
```

Nao coloque chaves reais no Git.

## 2. Instalar e gerar build

```bash
npm ci
npm run prisma:generate
npx prisma db push
npm run build
```

## 3. Subir ou reiniciar o app

Com PM2:

```bash
PORT=3000 pm2 start npm --name eurora-love -- run start:prod
pm2 save
```

Se o app ja existir no PM2:

```bash
pm2 restart eurora-love --update-env
pm2 save
```

Ver logs:

```bash
pm2 logs eurora-love
```

## 4. Nginx

Exemplo:

```nginx
server {
  server_name eurora.site www.eurora.site;

  location /uploads/ {
    alias /var/www/eurora/uploads/;
    access_log off;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Salvar em:

```bash
sudo nano /etc/nginx/sites-available/eurora-love
sudo ln -s /etc/nginx/sites-available/eurora-love /etc/nginx/sites-enabled/eurora-love
sudo nginx -t
sudo systemctl reload nginx
```

Depois ative HTTPS com Certbot:

```bash
sudo certbot --nginx -d eurora.site -d www.eurora.site
```

## 5. Webhook Asaas

Configure no Asaas:

```text
https://eurora.site/api/asaas/webhook
```

Eventos principais:

```text
PAYMENT_CONFIRMED
PAYMENT_RECEIVED
```

O token configurado no painel deve ser igual ao `ASAAS_WEBHOOK_TOKEN`.

## 6. Mensagens programadas

Configure um cron externo para chamar:

```text
GET https://eurora.site/api/cron/enviar-mensagens
Authorization: Bearer SEU_CRON_SECRET
```

Sugestao: rodar a cada 5 minutos.

## 7. Backup local

Crie pasta de backups:

```bash
sudo mkdir -p /var/backups/eurora
```

Backup manual do banco e uploads:

```bash
pg_dump "postgresql://eurora:TROQUE_POR_UMA_SENHA_FORTE@127.0.0.1:5432/eurora_love" \
  > "/var/backups/eurora/db-$(date +%Y%m%d-%H%M%S).sql"

tar -czf "/var/backups/eurora/uploads-$(date +%Y%m%d-%H%M%S).tar.gz" \
  -C /var/www/eurora uploads
```

Cron diario sugerido:

```bash
sudo crontab -e
```

Adicionar:

```cron
15 3 * * * pg_dump "postgresql://eurora:TROQUE_POR_UMA_SENHA_FORTE@127.0.0.1:5432/eurora_love" > "/var/backups/eurora/db-$(date +\%Y\%m\%d-\%H\%M\%S).sql"
30 3 * * * tar -czf "/var/backups/eurora/uploads-$(date +\%Y\%m\%d-\%H\%M\%S).tar.gz" -C /var/www/eurora uploads
```

## 8. Verificacao final

```bash
npm run lint
npm run build
pm2 status
curl -I https://eurora.site
```
