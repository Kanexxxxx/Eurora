# Deploy em VPS

Checklist para colocar a EURORA LOVE em producao.

## 1. Variaveis obrigatorias

Crie `.env` no servidor com:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
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
```

Nao coloque chaves reais no Git.

## 2. Instalar e gerar build

```bash
npm ci
npm run prisma:generate
npm run build
```

## 3. Subir o app

Com PM2:

```bash
PORT=3000 pm2 start npm --name eurora-love -- run start:prod
pm2 save
```

## 4. Nginx

Exemplo:

```nginx
server {
  server_name eurora.site www.eurora.site;

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

Depois ative HTTPS com Certbot.

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

## 7. Verificacao final

```bash
npm run lint
npm run build
curl -I https://eurora.site
```
