# Healthcare Workflow Management System

## Overview

A comprehensive healthcare workflow management system built with React frontend and Express backend. The application manages clinical workflows, task assignments, staff scheduling, patient flow monitoring, and provides real-time collaboration features through WebSocket connections. The system uses PostgreSQL with Drizzle ORM for data persistence and includes an agile Kanban board for workflow management.



## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Real-time Communication**: WebSocket integration for live updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: WebSocket server for live notifications
- **API Design**: RESTful endpoints with type-safe schema validation

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express backend application
├── shared/          # Shared TypeScript schemas and types
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: Authentication and role management (nurse, technician, administrator)
- **Workflows**: Clinical process definitions with status tracking
- **Tasks**: Individual work items with priority and assignment
- **Patient Flow Stages**: Monitoring patient movement through care stages
- **Schedules**: Staff scheduling with shift management
- **User Stories**: Agile workflow management items
- **Notifications**: Real-time alert system

### Frontend Components
- **Dashboard**: Central monitoring view with statistics and real-time updates
- **Workflow Design**: Visual workflow creation and management
- **Task Management**: Assignment and tracking of individual tasks
- **Staff Scheduling**: Shift planning and resource allocation
- **Patient Flow**: Real-time patient movement monitoring
- **Analytics**: Performance metrics and reporting
- **Kanban Board**: Agile project management interface

### Backend Services
- **Storage Layer**: Comprehensive data access abstraction
- **WebSocket Handler**: Real-time communication management
- **API Routes**: RESTful endpoints for all major entities
- **Database Connection**: Neon serverless PostgreSQL integration

## Data Flow

### Real-time Updates
1. Frontend establishes WebSocket connection on load
2. Backend broadcasts changes to all connected clients
3. Frontend updates UI reactively based on WebSocket messages
4. TanStack Query manages cache invalidation and refetching

### API Communication
1. Frontend makes HTTP requests through TanStack Query
2. Backend validates requests using Zod schemas
3. Database operations performed through Drizzle ORM
4. Responses cached and synchronized across components

### Authentication & Authorization
- Role-based access control (nurse, technician, administrator)
- User sessions managed through database
- Default admin user for system initialization

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date/time operations

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: Drizzle ORM with Zod schema validation
- **WebSocket**: ws library for real-time communication
- **Session Management**: connect-pg-simple for PostgreSQL sessions

### Development Tools
- **Build**: Vite with TypeScript compilation
- **Database**: Drizzle Kit for migrations and schema management
- **Development**: tsx for TypeScript execution
- **Linting**: ESLint with TypeScript support

## Deployment Strategy

### Production Build
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Database migrations applied via Drizzle Kit
4. Static assets served from Express in production

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment specification (development/production)
- **REPL_ID**: Replit-specific configuration for development

### Development Workflow
- Hot module replacement via Vite dev server
- TypeScript compilation with strict mode enabled
- Real-time database schema synchronization
- WebSocket connections for live development updates

The system is designed for scalability and maintainability, with clear separation of concerns between frontend and backend, comprehensive type safety, and real-time collaboration features essential for healthcare workflow management.