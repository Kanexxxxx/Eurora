#!/usr/bin/env bash
set -euo pipefail

# Prepara uma VPS Ubuntu/Debian para rodar a EURORA LOVE.
# Seguro para rodar em servidor com projeto existente: nao apaga arquivos,
# nao altera repositorio Git e nao reinicia o app automaticamente.

if [[ "${EUID}" -ne 0 ]]; then
  echo "Rode como root: sudo bash infra/vps-setup-ubuntu.sh"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "==> Atualizando lista de pacotes"
apt-get update

echo "==> Instalando ferramentas base"
apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  git \
  build-essential \
  unzip \
  nginx \
  certbot \
  python3-certbot-nginx \
  postgresql \
  postgresql-contrib \
  ufw

install_node=false
if ! command -v node >/dev/null 2>&1; then
  install_node=true
else
  node_major="$(node -v | sed 's/^v//' | cut -d. -f1)"
  if [[ "${node_major}" -lt 20 ]]; then
    install_node=true
  fi
fi

if [[ "${install_node}" == "true" ]]; then
  echo "==> Instalando Node.js 22 LTS"
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
    > /etc/apt/sources.list.d/nodesource.list
  apt-get update
  apt-get install -y nodejs
else
  echo "==> Node.js ja instalado: $(node -v)"
fi

echo "==> Instalando PM2"
npm install -g pm2

echo "==> Habilitando Nginx"
systemctl enable nginx
systemctl start nginx

echo "==> Habilitando PostgreSQL"
systemctl enable postgresql
systemctl start postgresql

echo "==> Criando pasta de uploads"
mkdir -p /var/www/eurora/uploads
chown -R "${SUDO_USER:-root}:${SUDO_USER:-root}" /var/www/eurora/uploads
chmod -R 755 /var/www/eurora/uploads

echo "==> Preparando firewall sem ativar automaticamente"
ufw allow OpenSSH
ufw allow "Nginx Full"

echo ""
echo "VPS preparada."
echo "Versoes:"
node -v
npm -v
pm2 -v
nginx -v
psql --version
echo ""
echo "Proximos passos:"
echo "1. Confira acesso SSH antes de ativar firewall: sudo ufw enable"
echo "2. Crie usuario/banco PostgreSQL conforme DEPLOY_VPS.md"
echo "3. Configure .env dentro da pasta do projeto"
echo "4. Rode: npm ci && npm run prisma:generate && npx prisma db push && npm run build"
echo "5. Suba com PM2: PORT=3000 pm2 start npm --name eurora-love -- run start:prod"
