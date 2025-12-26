# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CronogramaTropa is a monorepo application for generating study schedules from course data synchronized from Memberkit API. It consists of a TypeScript backend following Clean Architecture/DDD principles and a React frontend.

## Development Commands

### Backend (Express + Prisma)

```bash
cd backend
npm install
npm run dev                                    # Start development server with auto-reload
npx prisma generate                            # Generate Prisma client after schema changes
npx prisma migrate dev --name <migration_name> # Create and apply database migration
npx prisma studio                              # Open Prisma Studio to browse database

# Sync scripts (CLI)
npm run sync:all        # Sync all entities sequentially (courses → sections → videos → classrooms)
npm run sync:courses    # Sync only courses and categories
npm run sync:sections   # Sync only sections and lessons
npm run sync:videos     # Sync only videos
npm run sync:classrooms # Sync only classrooms
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev      # Start Vite development server
npm run build    # Build for production (runs TypeScript check + build)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Environment Setup

Backend requires a `.env` file (see `backend/.env.example`):
- `DATABASE_URL`: PostgreSQL connection string
- `MEMBERKIT_API_URL`: Memberkit API base URL
- `MEMBERKIT_API_KEY`: Memberkit API authentication token
- `PORT`: Server port (default: 3333)

## Architecture

### Backend: Clean Architecture + Domain-Driven Design

The backend follows SOLID principles with clear separation of concerns across three layers:

**Domain Layer** (`src/domains/`)
- Contains business entities (Schedule, ScheduleItem)
- Defines repository interfaces (contracts) - e.g., `ICourseRepository`, `ILessonRepository`
- Houses use cases (business logic) - e.g., `CreateScheduleUseCase`, `SyncMemberkitDataUseCase`
- Zero infrastructure dependencies

**Infrastructure Layer** (`src/infra/`)
- **Database**: Prisma ORM with PostgreSQL adapter
  - Repository implementations (e.g., `PrismaCourseRepository implements ICourseRepository`)
  - Connection management in `prisma.ts`
- **HTTP**: Express.js routes, controllers, and middleware
  - Routes perform manual dependency injection
  - Controllers handle HTTP concerns, delegate business logic to use cases
  - Error handling middleware catches all exceptions
- **Providers**: External integrations
  - `MemberkitProvider`: Syncs courses, lessons, videos from Memberkit API
  - `PDFProvider`: Generates schedule PDFs (placeholder implementation)

**Shared Layer** (`src/shared/`)
- `AppError`: Custom error class with HTTP status codes
- Provider interfaces (`IMemberkitProvider`, `IPDFProvider`)

### Key Architectural Patterns

**Dependency Injection (Manual)**
Route files instantiate dependencies and wire them together:
```
Repository → Provider → Use Case → Controller → Route
```

**Repository Pattern**
- Interfaces defined in domain layer
- Implementations in infrastructure layer use Prisma
- All operations typed with domain entities

**Mapper Pattern**
External API data transformed via explicit mappers (e.g., `CourseMapper.toDomain()`) to keep domain clean.

## Database Schema

Hierarchical structure synced from Memberkit:
- `Category` → `Course` → `Section` → `Lesson` → `Video` (1:1)
- `Classroom` (independent)
- `Schedule` → `ScheduleItem` (references Lesson and Schedule)

All relationships use CASCADE delete. Entity IDs come from Memberkit as integers. Schedule and ScheduleItem use UUID strings for their own IDs.

## API Documentation

Interactive Swagger/OpenAPI documentation available at `http://localhost:3333/api-docs` when server is running.

**Schedule Endpoints** (`/api/schedules`):
- `POST /` - Create manual schedule with selected lessons from multiple courses
  - Accepts: title, description, startDate, endDate, items array
  - Each item: lessonId, scheduledDate (YYYY-MM-DD), startTime (HH:mm), duration (minutes)
  - Returns: schedule object + created items array
- `GET /` - List all schedules (basic info only)
- `GET /:id` - Get schedule with detailed items (includes lesson data for each item)
  - Returns enriched items with full lesson information
- `DELETE /:id` - Remove schedule and all its items (CASCADE)
- `GET /:id/export/pdf` - Export schedule to PDF format

**Sync Endpoints** (`/api/sync`):
- `POST /courses` - Sync courses and categories (Memberkit endpoint: `/courses`)
- `POST /sections` - Sync sections and lessons (Memberkit endpoint: `/courses/{id}`)
- `POST /videos` - Sync videos (Memberkit endpoint: `/courses/{courseId}/lessons/{id}`)
- `POST /classrooms` - Sync classrooms (Memberkit endpoint: `/classrooms`)

All endpoints are **decoupled** and group entities that come from the same Memberkit API endpoint, avoiding duplicate API calls. They can be called independently without dependencies on other endpoints.

Swagger annotations live in route files using JSDoc. See `backend/SWAGGER.md` for usage examples.

## Working with the Codebase

### Adding New Features (Backend)

When adding new business logic:
1. Define repository interface in `src/domains/<entity>/repositories/`
2. Create use case in `src/domains/<entity>/usecases/`
3. Implement repository in `src/infra/database/prisma/repositories/`
4. Create controller in `src/infra/http/controllers/`
5. Wire dependencies in route file (`src/infra/http/routes/`)
6. Add Swagger documentation annotations to routes

### Adding New Features (Frontend)

When adding new UI features:
1. **Create DTOs** in `src/dtos/` if dealing with API data
2. **Create Service** method in `src/services/` for API calls
3. **Create Hook** in `src/hooks/` to encapsulate data fetching logic
4. **Create Components**:
   - Reusable UI in `src/shared/ui/`
   - Page-specific in `src/components/<feature>/`
   - Pages in `src/pages/<Feature>/`
5. **Add Validation** in `src/utils/validation/` if needed
6. **Follow Principles**:
   - Single Responsibility (one component, one purpose)
   - Reusability (prefer existing components)
   - Type Safety (TypeScript interfaces for all props)
   - Clean Code (descriptive names, small functions)

### Working with Prisma

After modifying `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name descriptive_name  # Creates migration + applies + regenerates client
npx prisma generate                              # Only regenerate client (no schema changes)
```

Schema changes require updating:
- Repository interfaces (domain layer)
- Repository implementations (infrastructure layer)
- DTOs/mappers if syncing from Memberkit

### Memberkit Synchronization

**Available API Endpoints:**
- `GET /courses` - Lists all courses (includes category info for each course)
- `GET /courses/{id}` - Returns course details (includes sections with lessons)
- `GET /courses/{course_id}/lessons/{id}` - Returns specific lesson (includes video)
- `GET /classrooms` - Lists all classrooms
- `GET /classrooms/{id}` - Returns specific classroom

**Sync Architecture:**
The synchronization system has been redesigned to be **decoupled** with independent use cases for each type of sync:

1. **`SyncCoursesAndCategoriesUseCase`**:
   - Fetches `/courses` endpoint once
   - Extracts and saves unique categories
   - Saves all courses
   - Can be run independently via API (`POST /api/sync/courses`) or CLI (`npm run sync:courses`)

2. **`SyncSectionsAndLessonsUseCase`**:
   - Fetches `/courses/{id}` for each course in the database
   - Extracts and saves sections with their lessons
   - Can be run independently via API (`POST /api/sync/sections`) or CLI (`npm run sync:sections`)
   - **Now works independently** - no longer requires section sync to sync lessons

3. **`SyncVideosUseCase`**:
   - Fetches `/courses/{courseId}/lessons/{id}` for each lesson in the database
   - Saves video data for lessons that have videos
   - Can be run independently via API (`POST /api/sync/videos`) or CLI (`npm run sync:videos`)

4. **`SyncClassroomsUseCase`**:
   - Fetches `/classrooms` endpoint once
   - Saves all classrooms
   - Can be run independently via API (`POST /api/sync/classrooms`) or CLI (`npm run sync:classrooms`)

**CLI Scripts** are available in `backend/src/scripts/sync/` and can be executed with the npm commands above. Each script uses the corresponding use case.

All sync operations use `api_key` query parameter for authentication, map DTOs to domain entities via mappers, and upsert with `skipDuplicates: true` to avoid duplicates.

### Error Handling

- Throw `AppError` for business logic violations (include HTTP status)
- Controllers catch errors and pass to error middleware via `next(error)`
- Error middleware returns consistent JSON responses
- Uncaught errors default to 500 status

### Repository Conventions

- Methods use domain entity types for parameters and returns
- Query results ordered by domain-relevant fields (e.g., courses by position)
- Bulk operations use `skipDuplicates: true` for idempotent syncs
- All entities instantiated using constructors (not plain objects)

## Technology Stack

**Backend:**
- Node.js with TypeScript 5.9.3
- Express 5.2.1 (HTTP server)
- Prisma 7.2.0 (ORM + PostgreSQL adapter)
- Swagger (swagger-jsdoc + swagger-ui-express)
- ts-node-dev (development with hot reload)

**Frontend:**
- React 19.2.0
- Vite 7.2.4 (build tool)
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- ESLint for linting

**Database:**
- PostgreSQL (via Prisma adapter)

## Frontend Architecture

### Component Structure

The frontend follows a clean, modular architecture with reusable components following SOLID principles.

**Pages** (`src/pages/`):
- `HomePage` - Landing page with feature highlights and quick navigation
- `ScheduleListPage` - Lists all schedules with cards showing summary info
- `ScheduleDetailPage` - Detailed view of a schedule with statistics and daily breakdown
- `CreateSchedulePage` - Manual schedule creation with drag-and-drop calendar

**Reusable UI Components** (`src/shared/ui/`):
- `Button` - Primary, secondary, danger, ghost variants with loading states
- `Card` - Container component with padding variants and optional onClick
- `Icon` - Bootstrap Icons wrapper with size variants
- `Spinner` - Loading indicator
- `LoadingOverlay` - Full-page loading state

**Layout Components** (`src/shared/layout/`):
- `Layout` - Main layout wrapper with header
- `Header` - Navigation bar with active state highlighting

**Schedule-Specific Components** (`src/components/schedule/`):
- `ManualScheduleForm/` - Multi-step form for creating schedules
  - `ScheduleBasicInfo` - Title, description, date range
  - `CourseAndLessonSelector` - Browse and select lessons
  - `SelectedLessonsPanel` - View selected lessons
  - `UnallocatedLessonsPanel` - Drag source for lessons
  - `WeekCalendar` - Drag-and-drop weekly calendar view
  - `LessonCard` - Draggable lesson item
  - `EditAllocationModal` - Edit time/duration of allocated lessons

**Hooks** (`src/hooks/schedule/`):
- `useCreateSchedule` - Create new schedule
- `useListSchedules` - Fetch all schedules
- `useScheduleDetails` - Fetch schedule with enriched items (includes lessons)

**Context** (`src/contexts/`):
- `ManualScheduleContext` - State management for schedule creation
- `ToastContext` - Global toast notifications

**Validation** (`src/utils/validation/`):
- `manualScheduleValidation` - Client-side validation for schedule creation
- `scheduleValidation` - Common schedule validation rules

**Date Utilities** (`src/utils/date/`):
- `dateHelpers` - Date manipulation and formatting
- `formatDate` - Date formatting with date-fns

### State Management

- **Local State**: React useState for component-specific state
- **Context API**: For cross-component state (ManualSchedule, Toast)
- **Custom Hooks**: Encapsulate API calls and data fetching logic

### Styling

- **Tailwind CSS 4.1.18**: Utility-first styling
- **Military Theme**: Custom color palette defined in `src/styles/theme.css`
  - Primary: Military green (#4a5d23)
  - Secondary: Military khaki (#bdb76b)
  - Accent: Camouflage brown/sand
- **Design System**: Consistent spacing, shadows, and border radius

### Key Features Implemented

**Manual Schedule Creation**:
- Multi-step wizard interface (Basic Info → Lesson Selection → Calendar Allocation)
- Drag-and-drop lessons onto weekly calendar
- Real-time validation with user-friendly error messages
- Support for lessons from multiple courses
- Date-only storage for scheduledDate (no timezone issues)

**Schedule List**:
- Grid layout with responsive cards
- Summary statistics per schedule
- Date formatting in Brazilian Portuguese
- Loading and error states
- Empty state with call-to-action

**Schedule Detail**:
- Header with title, description, date range
- Statistics cards: total lessons, completed, duration, progress %
- Lessons grouped by date with full calendar formatting
- Each lesson shows: title, start time, duration, completion status
- Visual indicators for completed vs pending lessons
- Mark lessons as complete/incomplete (UI ready, backend pending)
