# Finance+ Server

Backend server for Finance+ application with rate limiting and security features.

## Features

- 🔐 JWT Authentication
- 🛡️ Rate Limiting (Brute Force Protection)
- 📊 Transaction Management
- 👥 Multi-user Support
- 🔄 Recurring Payments

## Rate Limiting

- **Auth Routes**: 5 attempts per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per IP

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A strong random secret key
     - `CLIENT_URL`: Your Vercel frontend URL

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/change-password` - Change password (authenticated)

### Transactions
- `GET /api/transactions` - Get all transactions (authenticated)
- `POST /api/transactions` - Create transaction (authenticated)

### Health Check
- `GET /health` - Server health status
