# CourseCompass - Student Registration System

A modern, full-stack web application for managing student course registrations. Built with React, TypeScript, Express, and PostgreSQL, featuring a clean interface for managing course types, courses, course offerings, and student enrollments with persistent data storage.

## 🚀 Features

### Core Functionality

- **Course Types Management**: Create, edit, and delete course categories (Individual, Group, Special)
- **Course Management**: Manage course catalog with language specifications
- **Course Offerings**: Associate courses with types and manage capacity
- **Student Registration**: Enroll students with automatic capacity management
- **Real-time Dashboard**: Overview statistics and recent activity monitoring
- **Persistent Data Storage**: All data stored in PostgreSQL database with Neon

### Advanced Features

- **Database Integration**: PostgreSQL with Neon serverless for scalable data storage
- **Capacity Management**: Automatic enrollment limits with real-time updates
- **Smart Filtering**: Filter course offerings by type for better organization
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive client and server-side validation with Zod
- **Error Handling**: User-friendly error messages and state management
- **Type Safety**: End-to-end TypeScript for robust development

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript for robust type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management
- **React Hook Form** with Zod validation for forms
- **Radix UI + shadcn/ui** for accessible, modern components
- **Tailwind CSS** for responsive styling
- **Vite** for fast development and building

### Backend

- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** with Neon serverless driver
- **Neon Database** for scalable PostgreSQL hosting

### Development Tools

- **TypeScript** for end-to-end type safety
- **Drizzle Kit** for database migrations
- **ESLint** and **Prettier** for code quality
- **Path aliases** for clean imports
- **Hot reload** development environment

## Project Structure

```
CourseCompass/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── forms/         # Form components for CRUD operations
│   │   │   ├── layout/        # Layout components (header, navigation)
│   │   │   └── ui/            # Base UI components (shadcn/ui)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and API client
│   │   ├── pages/             # Page components for routing
│   │   └── main.tsx           # Application entry point
│   └── index.html             # HTML template
├── server/                    # Backend Express application
│   ├── index.ts              # Server entry point with environment setup
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # In-memory storage interface (legacy)
│   ├── database-storage.ts   # Database storage implementation
│   └── vite.ts               # Vite integration for development
├── shared/                    # Shared TypeScript types and schemas
│   └── schema.ts             # Database schema with Drizzle ORM
├── .env                      # Environment variables (DATABASE_URL)
├── drizzle.config.ts         # Drizzle ORM configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Neon Database Account** (free tier available at [neon.tech](https://neon.tech))
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CourseCompass
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Database Setup**

   Create a Neon PostgreSQL database:

   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

4. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   PORT=5000
   NODE_ENV=development
   ```

   **Important**: Replace the DATABASE_URL with your actual Neon connection string.

5. **Database Migration**

   The database schema is automatically created when you first run the application. The tables include:

   - `course_types` - Course categories (Individual, Group, Special)
   - `courses` - Course catalog with language specifications
   - `course_offerings` - Course-type associations with capacity management
   - `student_registrations` - Student enrollment records

6. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at **http://localhost:5000**

### Production Deployment

```bash
npm run build
npm start
```

## 🗄️ Database Schema

### Tables Overview

```sql
-- Course Types (Individual, Group, Special)
CREATE TABLE course_types (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Courses (English, Hindi, Urdu, etc.)
CREATE TABLE courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Course Offerings (Course + Type combinations)
CREATE TABLE course_offerings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR NOT NULL REFERENCES courses(id),
  course_type_id VARCHAR NOT NULL REFERENCES course_types(id),
  max_capacity INTEGER NOT NULL DEFAULT 15,
  current_enrollment INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Student Registrations
CREATE TABLE student_registrations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  course_offering_id VARCHAR NOT NULL REFERENCES course_offerings(id),
  status TEXT NOT NULL DEFAULT 'confirmed',
  registration_date TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## API Endpoints

### Course Types

- `GET /api/course-types` - List all course types
- `POST /api/course-types` - Create new course type
- `PUT /api/course-types/:id` - Update course type
- `DELETE /api/course-types/:id` - Delete course type

### Courses

- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Course Offerings

- `GET /api/course-offerings` - List all course offerings with details
- `POST /api/course-offerings` - Create new course offering
- `PUT /api/course-offerings/:id` - Update course offering
- `DELETE /api/course-offerings/:id` - Delete course offering

### Student Registrations

- `GET /api/student-registrations` - List all registrations
- `GET /api/student-registrations/by-offering/:id` - Get registrations by offering
- `POST /api/student-registrations` - Register new student
- `DELETE /api/student-registrations/:id` - Cancel registration

### Statistics

- `GET /api/stats` - Get system overview statistics

## 📚 Usage Guide

### Managing Course Types

1. Navigate to "Course Types" in the main navigation
2. Click "Add Course Type" to create new categories (Individual, Group, Special)
3. Use the edit button to modify existing types
4. Delete unused types (Note: Cannot delete types with associated course offerings)

### Creating Courses

1. Go to "Courses" section
2. Click "Add Course" and fill in course details:
   - **Course Name**: e.g., "English Grammar", "Hindi Literature"
   - **Language**: Primary language of instruction
3. Edit or delete courses as needed (Cannot delete courses with existing offerings)

### Setting Up Course Offerings

1. Visit "Course Offerings" page
2. Click "Create Offering" to associate a course with a course type
3. Configure offering settings:
   - **Max Capacity**: Maximum number of students (default: 15)
   - **Status**: Active, Inactive, or Full
4. Use filters to view offerings by course type
5. Monitor enrollment levels in real-time

### Student Registration Process

1. Navigate to "Registrations"
2. Fill out the student registration form:
   - **Student Name**: Full name of the student
   - **Email**: Primary contact email
   - **Phone**: Optional contact number
3. Select **Course Type** to filter available offerings
4. Choose from available **Course Offerings**
5. Submit to register (automatically updates enrollment count)

### Dashboard Overview

- **Statistics**: Real-time counts of course types, courses, active offerings, and total students
- **Recent Activity**: Latest registrations and course offerings
- **Quick Actions**: Direct links to create new entries

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes (Drizzle)

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push     # Apply schema changes to database
```

### Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Management

The application uses **Drizzle ORM** with **Neon PostgreSQL**:

- **Schema Definition**: `shared/schema.ts` contains all table definitions
- **Database Storage**: `server/database-storage.ts` implements all database operations
- **Auto-Migration**: Tables are created automatically on first run
- **Type Safety**: Full TypeScript support for database operations

### Adding New Features

1. **Database Changes**: Update `shared/schema.ts` for new tables/columns
2. **API Routes**: Add new endpoints in `server/routes.ts`
3. **Storage Layer**: Implement database operations in `server/database-storage.ts`
4. **Frontend Components**: Create React components in `client/src/components/`
5. **API Integration**: Update `client/src/lib/api.ts` for new endpoints

## 🔄 Data Flow

```
Frontend (React)
    ↓ TanStack Query
API Routes (Express)
    ↓ Storage Interface
Database Storage (Drizzle ORM)
    ↓ Neon Driver
PostgreSQL Database (Neon)
```

### Key Features of Data Layer

- **Type Safety**: End-to-end TypeScript from database to frontend
- **Real-time Updates**: Optimistic updates with server sync
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Validation**: Zod schemas for request/response validation
- **Performance**: Efficient queries with proper indexing

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Build Configuration**

   ```json
   {
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server/index.ts"
       }
     ]
   }
   ```

2. **Environment Variables**
   - Add `DATABASE_URL` in Vercel dashboard
   - Set `NODE_ENV=production`

### Other Platforms

- **Railway**: Direct deployment with automatic PostgreSQL
- **Heroku**: Works with Heroku Postgres addon
- **DigitalOcean**: App Platform compatible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards:
   - TypeScript strict mode
   - ESLint configuration
   - Proper error handling
   - Update tests if applicable
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the established project structure
- Add proper error handling and validation
- Update documentation for new features
- Test database operations thoroughly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify `DATABASE_URL` format: `postgresql://user:password@host/database?sslmode=require`
   - Check Neon database is active and accessible
   - Ensure environment variables are loaded properly

2. **Development Server Issues**

   - Make sure port 5000 is available
   - Check Node.js version (requires v18+)
   - Verify all dependencies are installed

3. **Build Failures**
   - Run `npm run check` for TypeScript errors
   - Ensure all environment variables are set
   - Check for any missing dependencies

### Getting Help

- Open an issue in the GitHub repository
- Check existing issues for similar problems
- Provide detailed error messages and steps to reproduce

### Performance Tips

- Database indexes are automatically created for foreign keys
- Use the filtering features to reduce data loading
- Monitor Neon database usage in their dashboard
- Consider implementing pagination for large datasets

---

**Built with ❤️ for educational course management**
