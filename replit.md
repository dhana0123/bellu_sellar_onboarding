# Bellu Kart Seller Onboarding Platform

## Overview

This is a production-ready full-stack web application built for Bellu Kart's seller onboarding platform. The application allows D2C brands to activate Bellu Kart's 10-minute delivery infrastructure without creating a storefront. It features a modern React frontend with a Node.js/Express backend, PostgreSQL database integration via Drizzle ORM, and Firebase integration for email and phone verification services.

**Current Status**: ✅ Complete with full verification flow, premium dark UI (Ola/Uber-inspired), and Firebase Auth integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Dark theme with custom Bellu Kart brand colors (teal primary, gold accents)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Development**: tsx for TypeScript execution in development

### Authentication & Verification
- **Firebase Integration**: Used for email and phone verification with fallback demo mode
- **OTP System**: Custom OTP input component for phone verification
- **Verification Flow**: 4-step process: Details → Email Verification → Phone Verification → Success
- **Demo Mode**: Uses code `123456` when Firebase credentials aren't configured
- **Production Mode**: Full Firebase Auth with real SMS/Email when properly configured

## Key Components

### Database Schema (`shared/schema.ts`)
- **Users Table**: Basic user authentication with username/password
- **Sellers Table**: Comprehensive seller information including:
  - Brand details (name, website, category)
  - Contact information (email, phone)
  - Business metrics (monthly orders)
  - API credentials (unique API keys)
  - Verification status (email/phone timestamps)
  - Firebase integration (UID storage)

### Frontend Pages
- **Onboarding Page**: Multi-step form with progress indicator
- **Success Page**: API key display and integration instructions
- **API Documentation**: Comprehensive integration guide with code examples
- **404 Page**: Error handling for undefined routes

### Backend Services
- **Storage Layer**: Abstracted database operations with in-memory fallback
- **Route Handlers**: RESTful API endpoints for seller management
- **Verification Endpoints**: Integration with Firebase for OTP services

## Data Flow

1. **Seller Registration**:
   - User fills out onboarding form with brand information
   - Form data validated using Zod schemas
   - Email and phone verification initiated via Firebase
   - OTP verification completes the registration
   - Unique API key generated and stored
   - Seller redirected to success page

2. **API Integration**:
   - Success page displays API key and webhook URL
   - Documentation provides integration examples
   - Postman collection available for download

3. **Database Operations**:
   - All seller data persisted to PostgreSQL
   - Drizzle ORM ensures type safety
   - Migrations managed through drizzle-kit

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Firebase**: Authentication and phone verification services
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Validation**: Zod for runtime type checking and form validation

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production bundling for server code
- **PostCSS**: CSS processing with Autoprefixer

### Notable Features
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Type Safety**: End-to-end TypeScript coverage
- **Modern Tooling**: Vite for fast HMR and optimized builds
- **Component Library**: Comprehensive UI component system

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `npm run db:push`

### Environment Configuration
- **Development**: Local development with tsx and Vite dev server
- **Production**: Node.js server serving static assets and API routes
- **Database**: CONNECTION_STRING required for PostgreSQL connection

### Key Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build production assets
- `npm run start`: Start production server
- `npm run db:push`: Apply database schema changes

The application is designed to be deployed on platforms like Replit, with appropriate environment variable configuration for database connections and Firebase credentials.