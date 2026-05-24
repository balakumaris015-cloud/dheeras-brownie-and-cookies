#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/balakumaris015-cloud/dheeras-brownie-and-cookies.git}"
APP_DIR="${APP_DIR:-/var/www/dheeras-brownie-and-cookies}"
APP_NAME="${APP_NAME:-dheeras-bakery-api}"
BACKEND_PORT="${BACKEND_PORT:-5000}"
CLIENT_URL="${CLIENT_URL:-http://YOUR_EC2_PUBLIC_IP}"

if [[ "${MONGODB_URI:-}" == "" ]]; then
  echo "ERROR: Set MONGODB_URI before running this script."
  echo "Example:"
  echo "MONGODB_URI='mongodb+srv://USER:PASSWORD@cluster0.mongodb.net/dheeras-bakery' CLIENT_URL='http://YOUR_EC2_PUBLIC_IP' bash scripts/ec2-deploy-fullstack.sh"
  exit 1
fi

echo "Installing system packages..."
sudo apt update
sudo apt install -y git curl nginx

if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js LTS..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Installing PM2..."
  sudo npm install -g pm2
fi

echo "Preparing app directory..."
sudo mkdir -p /var/www
sudo chown -R "$USER":"$USER" /var/www

if [[ -d "$APP_DIR/.git" ]]; then
  cd "$APP_DIR"
  git pull origin main
else
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

echo "Writing environment files..."
cat > backend/.env <<EOF
PORT=$BACKEND_PORT
NODE_ENV=production
MONGODB_URI=$MONGODB_URI
CLIENT_URL=$CLIENT_URL
AUTO_SEED=true
EOF

cat > frontend/.env.production <<EOF
VITE_API_BASE_URL=/api
VITE_UPI_ID=dheera@upi
VITE_UPI_PAYEE_NAME=Dheera's Brownie and Cookies
EOF

echo "Installing dependencies..."
npm install --prefix backend --omit=dev
npm install --prefix frontend

echo "Building frontend..."
npm run build --prefix frontend

echo "Starting backend with PM2..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start backend/src/server.js --name "$APP_NAME" --update-env
fi
pm2 save

echo "Configuring Nginx..."
sudo cp deploy/nginx-fullstack-ip.conf /etc/nginx/sites-available/dheeras-bakery
sudo ln -sf /etc/nginx/sites-available/dheeras-bakery /etc/nginx/sites-enabled/dheeras-bakery
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "Deployment complete."
echo "Check backend: curl http://localhost:$BACKEND_PORT/api/health"
echo "Check public site: curl $CLIENT_URL"
