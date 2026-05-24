#!/usr/bin/env bash
set -euo pipefail

sudo apt update
sudo apt install -y nginx git curl

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

sudo mkdir -p /var/www/dheeras-brownie-and-cookies
sudo mkdir -p /var/log/dheeras-bakery-api
sudo chown -R "$USER":"$USER" /var/www/dheeras-brownie-and-cookies /var/log/dheeras-bakery-api

echo "Server base packages installed. Clone the repository into /var/www/dheeras-brownie-and-cookies next."
