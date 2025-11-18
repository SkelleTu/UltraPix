# VideoAI Pro - Advanced AI Video Generation Platform

## Overview

VideoAI Pro is a comprehensive AI-powered video generation platform that enables users to create professional-quality videos through text-to-video and image-to-video generation. The platform features advanced AI effects (AI Hug, AI Kiss, transformations), professional camera controls, a visual timeline editor, and a template library. Built with a modern React frontend and Express backend, it provides an accessible yet powerful creative workspace for users of all skill levels.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 18, 2025)

### Critical Database Migration
- **Migrated from MemStorage to PgStorage**: Videos are now permanently stored in PostgreSQL database and will **never be lost** on server restart
- **Lazy Initialization Pattern**: Database tables and sample data (templates, effects) are initialized on first API call
- **Neon Driver Bug Workaround**: Implemented targeted error handling for empty table queries that return null instead of []
- **OpenAI Integration**: Configured and ready for real AI video generation with user-provided API key
- **WebSocket Progress System**: Real-time video generation progress updates working correctly

### Technical Implementation
- Created `server/db.ts` with Neon HTTP driver configuration
- Implemented `PgStorage` class replacing `MemStorage` in `server/storage.ts`
- Added error handling for all query methods that return arrays
- Configured fetchOptions to disable caching for Neon HTTP queries

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: wouter for lightweight client-side routing with pages for Home, Create, Gallery, and Effects.

**UI Component Library**: Radix UI primitives with custom shadcn/ui components following the "New York" style variant. Comprehensive component set includes forms, dialogs, cards, accordions, carousels, and data visualization components.

**Styling System**: 
- Tailwind CSS with custom configuration supporting dark/light themes
- Material Design 3 foundation with heavy customization
- Design tokens using CSS variables for colors, spacing, and elevation
- Custom utility classes for hover and active states (`hover-elevate`, `active-elevate-2`)
- Typography: Inter for UI elements, Space Grotesk for headers

**State Management**:
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod validation for form handling
- Context API for theme management (ThemeProvider)
- No global state management library - relying on React Query and local component state

**Key Design Patterns**:
- Compound component pattern for UI components (Card, Dialog, etc.)
- Hook-based architecture for reusable logic (useToast, useIsMobile, useTheme)
- Form composition with react-hook-form and zodResolver
- Separation of concerns: pages for routes, components for UI, hooks for logic

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with routes organized in `/api` namespace:
- `/api/videos` - Video project CRUD operations
- `/api/videos/generate` - Video generation endpoint
- `/api/templates` - Template library access
- `/api/effects` - Effects catalog

**Storage Layer**: Abstract storage interface (`IStorage`) with PostgreSQL implementation (`PgStorage`). Ensures permanent data persistence with:
- Video project management (CRUD operations with lazy initialization)
- Template retrieval and categorization (auto-populated on first run)
- Effects catalog with trending and category filtering (auto-populated on first run)
- Workaround for Neon HTTP driver bug (null result handling for empty queries)

**AI Integration**: OpenAI integration for video generation features:
- Text-to-video generation using GPT-5 (newest model)
- Image-to-video animation
- Prompt enhancement
- Thumbnail generation
- Fallback to mock data when API key is unavailable for development

**Middleware Stack**:
- JSON body parsing with raw body capture for webhook verification
- Request logging with duration tracking
- Vite development middleware integration in development mode
- Static file serving in production

**Development vs Production**:
- Development: Vite middleware for HMR, Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)
- Production: Pre-built static assets served from `dist/public`

### Data Models

**Database Schema** (Drizzle ORM with PostgreSQL):

1. **Video Projects** (`video_projects` table):
   - Stores user-generated video projects
   - Tracks generation status (draft, processing, completed, failed)
   - Supports multiple generation types (text-to-video, image-to-video, template-based)
   - JSON fields for effects array, camera controls, and metadata
   - Fields for source materials (prompt, image URL) and outputs (video URL, thumbnail)

2. **Templates** (`templates` table):
   - Pre-configured video generation templates
   - Categorized (social, marketing, cinematic, animation)
   - Includes default settings for prompt, style, effects, and camera controls
   - Popularity scoring for trending templates

3. **Effects** (`effects` table):
   - Catalog of AI effects and transformations
   - Categorized with preview media
   - Usage tracking and trending detection
   - Difficulty ratings and compatibility flags

**Schema Philosophy**: Uses UUID primary keys, JSON columns for flexible metadata, and text fields for enumerated types to allow easy extension without migrations.

### Authentication & Authorization

Currently no authentication system implemented. The architecture is prepared for future session-based authentication:
- `connect-pg-simple` dependency for PostgreSQL session storage
- Session middleware configuration ready in server setup
- User-specific data queries will need to be added when auth is implemented

### Build & Deployment

**Build Process**:
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js` as ESM
- Database: Drizzle Kit for schema management and migrations

**Environment Configuration**:
- `DATABASE_URL` required for PostgreSQL connection
- `OPENAI_API_KEY` optional (falls back to mock data for development)
- `NODE_ENV` for environment detection

**Scripts**:
- `dev`: Development server with tsx for hot-reloading
- `build`: Production build of both frontend and backend
- `start`: Production server
- `db:push`: Push schema changes to database

## External Dependencies

### Third-Party Services

1. **OpenAI API** (GPT-5):
   - Primary AI service for video generation
   - Text analysis and prompt enhancement
   - Graceful degradation with mock responses when unavailable

2. **PostgreSQL Database** (via Neon):
   - Primary data persistence layer
   - Configured through `@neondatabase/serverless` driver
   - Connection pooling and serverless optimization

### Key Libraries

**Frontend**:
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form** + **@hookform/resolvers**: Form handling and validation
- **zod** + **drizzle-zod**: Runtime type validation and schema generation
- **wouter**: Lightweight routing alternative to React Router
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Carousel/slider components
- **cmdk**: Command palette component
- **class-variance-authority** + **clsx** + **tailwind-merge**: Styling utilities

**Backend**:
- **drizzle-orm**: Type-safe SQL ORM
- **drizzle-kit**: Database migration toolkit
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **openai**: Official OpenAI SDK
- **express**: Web server framework

**Development**:
- **vite**: Build tool and dev server
- **typescript**: Type safety across the stack
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Design System Resources

**Fonts** (Google Fonts):
- Inter (weights 300-800): Primary UI font
- Space Grotesk (weights 400-700): Display/header font

**Component System**: shadcn/ui with extensive Radix UI primitives providing accessible, unstyled components that are styled with Tailwind CSS.