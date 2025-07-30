# Bellu Kart Seller Onboarding Platform

A production-ready full-stack web application for Bellu Kart's seller onboarding platform, allowing D2C brands to activate 10-minute delivery infrastructure.

## Features

- 🎨 Modern React frontend with dark UI (Ola/Uber-inspired)
- ⚡ Fast TypeScript backend with Express.js
- 📧 Email verification using Brevo API
- 🔐 Secure API key generation for sellers
- 📱 Responsive design with Tailwind CSS
- 🛠️ Complete API documentation

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for fast development
- Tailwind CSS + shadcn/ui components
- Wouter for routing
- TanStack Query for state management
- React Hook Form + Zod validation

### Backend
- Node.js + Express.js + TypeScript
- PostgreSQL with Drizzle ORM
- Brevo for email services
- Session-based authentication

## Environment Variables

The project requires these environment variables:

### Database
```bash
# PostgreSQL (current implementation)
DATABASE_URL=postgresql://user:password@localhost:5432/database

# MongoDB (original implementation - for reference)
MONGODB_URI=mongodb://localhost:27017/bellu-kart-sellers
```

### Email Service
```bash
# Brevo API for email verification
BREVO_API_KEY=your_brevo_api_key_here
```

### Server
```bash
PORT=5000
NODE_ENV=development
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env`)

3. Push database schema:
```bash
npm run db:push
```

4. Start development server:
```bash
npm run dev
```

## Database Migration Notes

This project was originally built with MongoDB + Mongoose but has been migrated to PostgreSQL + Drizzle for Replit compatibility. The data models remain functionally identical:

- **Sellers**: Brand information, contact details, API keys
- **Email Verification Tokens**: OTP codes with automatic expiration

## API Endpoints

- `POST /api/sellers` - Create new seller
- `GET /api/sellers/:id` - Get seller by ID  
- `POST /api/sellers/:id/send-verification` - Send email verification
- `POST /api/sellers/:id/verify-email` - Verify email with OTP

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database

## License

MIT