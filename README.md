# CourseCompass - Student Registration System

A modern, full-stack web application for managing student course registrations. Built with React, TypeScript, and Express, featuring a clean interface for managing course types, courses, course offerings, and student enrollments.

## Features

### Core Functionality

- **Course Types Management**: Create, edit, and delete course categories (Individual, Group, Special)
- **Course Management**: Manage course catalog with language specifications
- **Course Offerings**: Associate courses with types and manage capacity
- **Student Registration**: Enroll students with automatic capacity management and waitlist support
- **Real-time Dashboard**: Overview statistics and recent activity monitoring

### Advanced Features

- **Capacity Management**: Automatic enrollment limits with waitlist functionality
- **Smart Filtering**: Filter course offerings by type for better organization
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive client and server-side validation
- **Error Handling**: User-friendly error messages and state management

## Technology Stack

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
- **Session management** with PostgreSQL storage

### Development Tools

- **TypeScript** for end-to-end type safety
- **ESLint** and **Prettier** for code quality
- **Path aliases** for clean imports
- **Hot reload** development environment

## Project Structure

```
CourseCompass/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── forms/      # Form components
│   │   │   ├── layout/     # Layout components
│   │   │   └── ui/         # Base UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and API client
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema and types
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (or Neon account)
- npm or yarn package manager

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

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**

   ```bash
   npm run db:push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Build

```bash
npm run build
npm start
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

## Usage Guide

### Managing Course Types

1. Navigate to "Course Types" in the main navigation
2. Click "Add Course Type" to create new categories
3. Use the edit button to modify existing types
4. Delete unused types (ensure no associated courses exist)

### Creating Courses

1. Go to "Courses" section
2. Click "Add Course" and fill in course details
3. Specify the course name and primary language
4. Edit or delete courses as needed

### Setting Up Course Offerings

1. Visit "Course Offerings" page
2. Click "Create Offering" to associate a course with a type
3. Set the maximum capacity for the offering
4. Use filters to view offerings by course type

### Student Registration

1. Navigate to "Registrations"
2. Fill out the student registration form
3. Select course type to filter available offerings
4. Choose from available course offerings
5. Submit to register (confirmed or waitlisted based on capacity)

## Data Model

### Course Types

- Unique identifier and name
- Used to categorize different learning formats

### Courses

- Course name and language specification
- Foundation for creating offerings

### Course Offerings

- Links courses with course types
- Manages enrollment capacity and current enrollment
- Tracks status (active, full, inactive)

### Student Registrations

- Student contact information
- Links to specific course offerings
- Enrollment status (confirmed, waitlisted, cancelled)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the GitHub repository.
