# Finance+ Client

Modern finance management application built with React and Vite.

## Features

- 💰 Track Income & Expenses
- 📊 Dashboard with Statistics
- 🔄 Recurring Payments
- 📅 Month/Year Filtering
- 🌓 Dark/Light Theme
- 📱 Fully Responsive
- 🔐 Secure Authentication
- 🔒 Rate-Limited API

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

For production, set this to your Render backend URL.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment on Vercel

1. Push your code to GitHub
2. Import project on Vercel
3. Set **Root Directory** to `client`
4. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com`)
5. Deploy!

## Tech Stack

- React 18
- Vite
- Axios
- Lucide Icons
- CSS Variables for Theming
