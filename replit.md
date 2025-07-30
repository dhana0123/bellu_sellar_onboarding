# Bellu Seller Onboarding Platform

## Overview

This is a production-ready full-stack web application built for Bellu's seller onboarding platform. The application allows D2C brands to activate Bellu's 10-minute delivery infrastructure without creating a storefront. It features a modern React frontend with a Node.js/Express backend, PostgreSQL database integration via Drizzle ORM, and Brevo email verification service.

**Current Status**: ✅ Complete with email verification flow using Brevo, professional tech company UI (black background, white buttons), and simplified 2-step onboarding process. Successfully migrated from MongoDB to PostgreSQL for Replit compatibility.

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
- **Styling**: Professional tech company theme with black background and white primary buttons

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for PostgreSQL integration
- **Database**: PostgreSQL with connection pooling (migrated from MongoDB)
- **Session Management**: Memory-based sessions for development
- **Development**: tsx for TypeScript execution in development

### Migration Notes
- **Original Database**: MongoDB with Mongoose ODM
- **Current Database**: PostgreSQL with Drizzle ORM
- **Migration Date**: 2025-01-30
- **Reason**: Replit environment compatibility and enhanced type safety

### Authentication & Verification
- **Brevo Integration**: Used for email verification with 300 free emails/day
- **OTP System**: 6-digit email verification codes with 10-minute expiration
- **Verification Flow**: 2-step process: Details → Email Verification → Success
- **Email Service**: Real email delivery via Brevo API with branded templates
- **Database Storage**: Email verification tokens stored in MongoDB with automatic expiration

## Key Components

### Database Schema (`shared/schema.ts`)
- **Sellers Table**: Comprehensive seller information including:
  - Brand details (name, website, category)
  - Contact information (email, phone)
  - Business metrics (monthly orders)
  - API credentials (unique API keys)
  - Verification status (email verification timestamp)
- **Email Verification Tokens Table**: Temporary OTP storage with automatic expiration
- **Users Table**: Authentication system for admin access

### Frontend Pages
- **Navigation Bar**: Fixed navbar with Bellu Kart branding and page navigation
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
   - Email verification initiated via Brevo
   - 6-digit OTP sent to email with branded template
   - Email verification completes the registration
   - Unique API key generated and stored
   - Seller redirected to success page

2. **API Integration**:
   - Success page displays API key and webhook URL
   - Documentation provides integration examples
   - Postman collection available for download

3. **Database Operations**:
   - All seller data persisted to MongoDB
   - Mongoose ODM ensures data validation and type safety
   - Automatic schema indexing and TTL for token expiration

## External Dependencies

### Core Dependencies
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Brevo (formerly Sendinblue) for email verification
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Validation**: Zod for runtime type checking and form validation

### Development Tools
- **Mongoose**: MongoDB object modeling and validation
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
- **Database**: MongoDB connection established automatically on startup

### Environment Configuration
- **Development**: Local development with tsx and Vite dev server
- **Production**: Node.js server serving static assets and API routes
- **Database**: MONGODB_URI required for MongoDB connection

### Key Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build production assets
- `npm run start`: Start production server
- Database schemas are automatically synced via Mongoose models

The application is designed to be deployed on platforms like Replit, with appropriate environment variable configuration for PostgreSQL connections and Brevo email service credentials.

## Recent Changes (2025-01-30)
- ✅ Successfully migrated from MongoDB + Mongoose to PostgreSQL + Drizzle ORM
- ✅ Updated branding from "Bellu Kart" to "Bellu" 
- ✅ Redesigned UI for serious tech company aesthetic (black background, white buttons, no gradients)
- ✅ All database operations now use Drizzle with PostgreSQL
- ✅ Removed all MongoDB dependencies and files
- ✅ Created documentation for environment variables including original MongoDB setup for reference