# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js/Express/TypeScript backend API for a portfolio website developed by Vera. It manages projects, technologies, and tech categories using Prisma ORM with PostgreSQL.

## Development Commands

```bash
# Development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server (requires build first)
npm start
```

## Database Commands

```bash
# Apply pending migrations
npx prisma migrate dev

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Reset database (caution: deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate

# Open Prisma Studio to view/edit data
npx prisma studio
```

## Architecture

### Hybrid Module System
The codebase uses a **mix of CommonJS and ES modules**:
- **CommonJS**: `src/config/index.js`, `src/error-handling/index.js`, `src/middleware/jwt.middleware.js`, `src/routes/auth.routes.js`, `src/server.ts`, `src/app.ts`
- **ES Modules**: `src/routes/project.routes.ts`, `src/routes/tech-category.routes.ts`, `src/routes/technology.routes.ts`, `src/db/index.ts`, `src/types/requests.ts`

When working with files:
- Use `module.exports` / `require()` for CommonJS files
- Use `export default` / `import` for ES module files
- `tsconfig.json` is configured with `"module": "commonjs"` and `"esModuleInterop": true`

### Application Flow
1. **Entry point**: `src/server.ts` - Starts the Express server on port 5005
2. **App setup**: `src/app.ts` - Configures middleware and routes
3. **Middleware**: `src/config/index.js` - Sets up CORS, body parsers, cookie parser, and morgan logger
4. **Routes**: All routes are prefixed:
   - `/api/projects` - Project CRUD operations
   - `/api/tech-category` - Technology categories (read-only)
   - `/api` - Health check endpoint
   - `/auth` - Authentication routes
5. **Error handling**: `src/error-handling/index.js` - 404 and 500 error handlers

### Database Architecture
Prisma ORM is used with PostgreSQL. The schema is defined in `prisma/schema.prisma`:

**Data Models:**
- `TechCategory` - Categories for technologies (e.g., "Frontend", "Backend")
- `Technology` - Individual technologies with name, logo URL, and official site URL
- `Project` - Portfolio projects with GitHub/deploy URLs and descriptions
- `ProjectTechStack` - Junction table linking projects to technologies (many-to-many)

**Key Relationships:**
- Technologies belong to one TechCategory
- Projects have many Technologies through ProjectTechStack
- **Cascade delete**: When a Project is deleted, all its ProjectTechStack relations are automatically deleted (`onDelete: Cascade`)

**Prisma Client:**
- Singleton instance exported from `src/db/index.ts`
- Import as: `import prisma from "../db/index"`

### Route Patterns
All route files follow similar patterns:
- Use async/await for Prisma operations
- Wrap database calls in try/catch blocks
- Return appropriate HTTP status codes (400, 404, 500)
- Use `res.json()` for success responses
- Log errors with `console.log()` before sending error responses

**Project routes** (`src/routes/project.routes.ts`) handle nested tech stack relations:
- GET requests use `include: { techStack: { include: { technology: true } } }`
- POST creates project and tech stack relations in a single transaction
- PUT deletes all existing tech stack relations then recreates them
- DELETE relies on cascade to remove tech stack relations

### Type Definitions
Custom request types are in `src/types/requests.ts`:
- `RequestCreateProject` - Typed request for creating projects with `technologyIds: string[]`
- `RequestUpdateProject` - Typed request for updating projects with `technologyIds: string[]`

### Environment Variables
Configuration in `.env` (not committed):
- `PORT` - Server port (default: 5005)
- `ORIGIN` - Frontend URL for CORS (default: http://localhost:3000)
- `TOKEN_SECRET` - JWT secret for authentication
- `DATABASE_URL` - PostgreSQL connection string

## Important Notes

- The codebase is in active development with mixed TypeScript/JavaScript files
- Authentication routes exist (`src/routes/auth.routes.js`) but may not be fully implemented
- When creating new route files, follow the ES module pattern used in recent routes (`.ts` files with `export default`)
- Always validate required fields before database operations
- Use Prisma's nested create/update operations for managing related data
