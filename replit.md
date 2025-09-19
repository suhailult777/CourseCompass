# Student Registration System

## Overview

A full-stack web application for managing student course registrations built with React, Express, and PostgreSQL. The system provides comprehensive management of course types, courses, course offerings, and student registrations with real-time data updates and a modern responsive interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Management**: React Hook Form with Zod validation for type-safe forms
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API with consistent JSON responses
- **Middleware**: Custom request logging and error handling
- **Development**: TSX for TypeScript execution in development

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless driver
- **Migrations**: Drizzle Kit for schema management and migrations
- **Schema**: Relational design with foreign key constraints for data integrity

### Data Model Design
- **Course Types**: Base categories for organizing courses
- **Courses**: Individual course definitions with name and language
- **Course Offerings**: Scheduled instances with capacity management
- **Student Registrations**: Enrollment records with status tracking
- **Relationships**: Properly normalized with cascading references

### Development Tooling
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Code Quality**: Path aliases for clean imports and consistent project structure
- **Hot Reload**: Vite HMR integration with Express server
- **Error Handling**: Comprehensive error boundaries and user feedback

### Authentication & Session Management
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple
- **Security**: Session-based authentication ready for implementation

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Environment Variables**: DATABASE_URL for secure database connectivity

### UI Framework Dependencies
- **Radix UI**: Complete set of accessible UI primitives for consistent components
- **Lucide React**: Icon library for modern, consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing

### Development Dependencies
- **Replit Integration**: Custom plugins for development environment optimization
- **Vite Plugins**: Runtime error overlay and development banner for enhanced DX
- **ESBuild**: Fast bundling for production server builds

### Utility Libraries
- **Date Management**: date-fns for date formatting and manipulation
- **Class Management**: clsx and class-variance-authority for conditional styling
- **Form Validation**: Zod schemas with Drizzle integration for end-to-end type safety
- **UUID Generation**: Crypto module for unique identifier generation