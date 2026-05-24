# AWS Deployment Guide

This guide deploys the frontend to S3 + CloudFront and the backend to EC2 with NGINX + PM2. MongoDB runs on MongoDB Atlas.

## 1. GitHub Setup

```bash
git init
git add .
git commit -m "Initial bakery ecommerce app"
git remote add origin https://github.com/YOUR_USERNAME/dheeras-brownie-and-cookies.git
git branch -M main
git push -u origin main
```

## 2. MongoDB Atlas

1. Create a free Atlas cluster.
2. Create a database user.
3. Allow your EC2 public IP in Network Access.
4. Copy the connection string.
5. Set `MONGODB_URI` in `backend/.env` on EC2.

## 3. Full-Stack App on EC2 Public IP

This project can run on one EC2 instance:

- Nginx serves `frontend/dist` on public port `80`.
- Nginx proxies `/api` to Express on internal port `5000`.
- PM2 keeps the Express backend alive after crashes and reboot.
- MongoDB should be MongoDB Atlas, not installed publicly on EC2.

After creating the EC2 instance and SSHing into it, run:

```bash
sudo apt update
sudo apt install -y git
cd /var/www
sudo git clone https://github.com/balakumaris015-cloud/dheeras-brownie-and-cookies.git
sudo chown -R ubuntu:ubuntu dheeras-brownie-and-cookies
cd dheeras-brownie-and-cookies
```

Then deploy with one command. Replace both placeholders first:

```bash
MONGODB_URI='mongodb+srv://USER:PASSWORD@cluster0.mongodb.net/dheeras-bakery' \
CLIENT_URL='http://YOUR_EC2_PUBLIC_IP' \
bash scripts/ec2-deploy-fullstack.sh
```

Verify:

```bash
pm2 status
curl http://localhost:5000/api/health
curl http://YOUR_EC2_PUBLIC_IP
sudo systemctl status nginx
```

To update later:

```bash
cd /var/www/dheeras-brownie-and-cookies
git pull origin main
MONGODB_URI='mongodb+srv://USER:PASSWORD@cluster0.mongodb.net/dheeras-bakery' \
CLIENT_URL='http://YOUR_EC2_PUBLIC_IP' \
bash scripts/ec2-deploy-fullstack.sh
```

## 4. Backend on EC2 Only

Recommended beginner instance: `t3.micro` or `t4g.micro` Ubuntu 22.04.

Security group inbound rules:

| Type | Port | Source |
| --- | --- | --- |
| SSH | 22 | Your IP only |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

Server setup:

```bash
chmod +x scripts/setup-ec2-backend.sh
./scripts/setup-ec2-backend.sh
cd /var/www
git clone https://github.com/YOUR_USERNAME/dheeras-brownie-and-cookies.git
cd dheeras-brownie-and-cookies
npm install --prefix backend --omit=dev
cp backend/.env.example backend/.env
nano backend/.env
```

Production `.env` example:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.mongodb.net/dheeras-bakery
CLIENT_URL=https://yourdomain.com,https://www.yourdomain.com
AUTO_SEED=true
```

Start with PM2:

```bash
sudo mkdir -p /var/log/dheeras-bakery-api
sudo chown -R $USER:$USER /var/log/dheeras-bakery-api
pm2 start deploy/ecosystem.config.js --env production
pm2 save
pm2 startup
```

NGINX reverse proxy:

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/dheeras-bakery-api
sudo ln -s /etc/nginx/sites-available/dheeras-bakery-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

For HTTPS on EC2, the easiest beginner option is Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## 4. Frontend on S3 + CloudFront

Build locally:

```bash
cp frontend/.env.example frontend/.env
nano frontend/.env
npm install --prefix frontend
npm run build --prefix frontend
```

Frontend production `.env`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_UPI_ID=dheera@upi
VITE_UPI_PAYEE_NAME=Dheera's Brownie and Cookies
```

Create S3 bucket:

```bash
aws s3 mb s3://your-frontend-bucket-name
aws s3 website s3://your-frontend-bucket-name --index-document index.html --error-document index.html
aws s3 sync frontend/dist s3://your-frontend-bucket-name --delete
```

Bucket policy for static hosting:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-frontend-bucket-name/*"
    }
  ]
}
```

CloudFront:

1. Create a distribution.
2. Use the S3 website endpoint or S3 origin.
3. Set default root object to `index.html`.
4. Add a custom error response: 403 and 404 return `/index.html` with HTTP 200 for React Router.
5. Attach an ACM certificate for HTTPS.

## 5. Custom Domain and SSL

1. In Route53, create a hosted zone for your domain.
2. Request an ACM certificate in `us-east-1` for CloudFront.
3. Validate certificate through DNS.
4. Add an `A` alias record for `yourdomain.com` pointing to CloudFront.
5. Add a `CNAME` or `A` alias record for `api.yourdomain.com` pointing to the EC2 public DNS or load balancer.

## 6. GitHub Actions Secrets

Frontend workflow secrets:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
VITE_API_BASE_URL
VITE_UPI_ID
VITE_UPI_PAYEE_NAME
```

Backend workflow secrets:

```text
EC2_HOST
EC2_USER
EC2_SSH_KEY
```

## 7. Low Traffic Monthly Cost Estimate

Approximate starter cost in `us-east-1`:

| Service | Estimate |
| --- | ---: |
| S3 static hosting | $1 to $3 |
| CloudFront low traffic | $0 to $5 |
| EC2 t3.micro/t4g.micro | $8 to $12, often free-tier eligible |
| Elastic IP | $3 to $4 if allocated |
| Route53 hosted zone | $0.50 |
| MongoDB Atlas M0 | Free |
| ACM SSL certificate | Free |

Expected low traffic total: about `$10-$25/month`, lower if AWS free tier applies.

## 8. Beginner Recommendations

- Use S3 + CloudFront for the frontend.
- Use EC2 + PM2 first for the backend because it is easy to understand.
- Use MongoDB Atlas M0 while validating the business.
- Move to Elastic Beanstalk, ECS, or an Application Load Balancer when traffic grows.

## 9. Troubleshooting

- Frontend shows blank page: check CloudFront custom error responses for React Router.
- API blocked by CORS: set `CLIENT_URL` to your exact CloudFront/domain URL and restart PM2.
- Orders fail: check `pm2 logs dheeras-bakery-api` and verify `MONGODB_URI`.
- QR does not scan: confirm UPI ID and amount in the checkout page.
- Changes not visible: invalidate CloudFront with `/*`.
- EC2 cannot connect to MongoDB: add EC2 public IP to MongoDB Atlas Network Access.
