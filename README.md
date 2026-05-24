# Dheera's Brownie and Cookies

Modern full-stack e-commerce web application for a homemade bakery brand. It includes a React + Vite storefront, Tailwind CSS design system, cart persistence, UPI QR checkout, Express REST API, MongoDB models, seed data, and AWS deployment configuration.

## Features

- Bakery-themed responsive landing page
- Product listing with search and category filters
- Featured products carousel
- Add, remove, increase, and decrease cart items
- Cart persistence with `localStorage`
- Checkout form with customer name, phone, address, and notes
- Dynamic UPI QR payment using `dheera@upi`
- Order success animation
- Toast notifications
- Loading skeletons
- Empty cart page and 404 page
- MongoDB-backed products and orders
- Express middleware, CORS, Helmet, rate limiting, and centralized API errors
- AWS S3 + CloudFront frontend deployment guide
- EC2 + PM2 + NGINX backend deployment guide
- GitHub Actions workflows for CI/CD

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router |
| State | React Context API |
| Payment | Dynamic UPI QR code |
| Backend | Node.js, Express |
| Database | MongoDB Atlas or local MongoDB |
| Deployment | AWS S3, CloudFront, EC2, NGINX, PM2 |

## Project Structure

```text
.
+-- backend
|   +-- src
|   |   +-- config
|   |   +-- controllers
|   |   +-- middleware
|   |   +-- models
|   |   +-- routes
|   |   +-- utils
|   +-- .env.example
|   +-- package.json
+-- frontend
|   +-- public/assets
|   +-- src
|   |   +-- components
|   |   +-- context
|   |   +-- data
|   |   +-- pages
|   |   +-- utils
|   +-- .env.example
|   +-- package.json
+-- deploy
|   +-- AWS_DEPLOYMENT_GUIDE.md
|   +-- ecosystem.config.js
|   +-- nginx.conf
+-- scripts
+-- .github/workflows
```

## Screenshots

Add production screenshots here after deployment.

| Page | Screenshot |
| --- | --- |
| Home | `docs/screenshots/home.png` |
| Products | `docs/screenshots/products.png` |
| Cart | `docs/screenshots/cart.png` |
| Checkout | `docs/screenshots/checkout.png` |

## Local Setup

### 1. Install dependencies

```bash
npm install
npm run install:all
```

Or install separately:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dheeras-bakery
CLIENT_URL=http://localhost:5173
AUTO_SEED=true
```

### 3. Configure frontend environment

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_UPI_ID=dheera@upi
VITE_UPI_PAYEE_NAME=Dheera's Brownie and Cookies
```

### 4. Run development servers

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | Get all available products |
| POST | `/api/orders` | Create an order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/health` | API health check |

## UPI Payment

Checkout generates a QR code from:

```text
upi://pay?pa=dheera@upi&pn=Dheera's Brownie and Cookies&am=<total>&cu=INR
```

For real production use, manually verify payment in your UPI merchant app before fulfillment. A fully automated payment confirmation flow requires a payment gateway or bank/UPI provider webhook.

## Production Build

Frontend:

```bash
npm run build --prefix frontend
```

Backend:

```bash
npm install --prefix backend --omit=dev
npm start --prefix backend
```

## GitHub Commands

```bash
git init
git add .
git commit -m "Initial bakery ecommerce app"
git remote add origin https://github.com/YOUR_USERNAME/dheeras-brownie-and-cookies.git
git branch -M main
git push -u origin main
```

## AWS Deployment

Read the full beginner-friendly guide:

[deploy/AWS_DEPLOYMENT_GUIDE.md](deploy/AWS_DEPLOYMENT_GUIDE.md)

Create an EC2 instance from local PowerShell after AWS CLI is configured:

```powershell
.\scripts\aws-create-ec2.ps1 -Region ap-south-1 -InstanceType t3.micro
```

Recommended architecture:

- Frontend: AWS S3 static hosting + CloudFront CDN
- Backend: AWS EC2 with Node.js, PM2, and NGINX
- Database: MongoDB Atlas
- Domain: Route53
- SSL: AWS Certificate Manager for CloudFront and Certbot or ACM-backed load balancer for API

## Security Notes

- Never commit `.env` files.
- Restrict SSH access to your own IP.
- Use HTTPS for frontend and backend.
- Keep MongoDB Atlas network access limited to known IPs.
- Add admin authentication before exposing `/api/orders` publicly in a real store.
- Use a real payment gateway when you need automatic payment verification.

## Troubleshooting

- `MONGODB_URI is required`: create `backend/.env` and set the database URI.
- Products do not appear from API: run `npm run seed --prefix backend` or set `AUTO_SEED=true`.
- Browser blocks API calls: set `CLIENT_URL` in backend `.env` to the frontend URL.
- Checkout order fails: verify backend is running and MongoDB Atlas allows the server IP.
- CloudFront shows 404 on refresh: configure custom error response to return `/index.html`.
