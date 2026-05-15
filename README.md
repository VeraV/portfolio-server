# Portfolio — Server

The backend API for **[veramei.dev](https://veramei.dev/)** — built as a learning project exploring TypeScript on the server, Prisma + PostgreSQL, Docker, and CI/CD.

This is a **single-admin** system: there is only one user (me), and JWT-protected endpoints let me create and edit content directly through the live frontend. The API also powers a per-project **manuals** feature, so each project can have step-by-step walkthroughs that visitors can read without running the project themselves.

## Features

- REST API for projects, technologies, tech categories, manuals, and manual steps
- Single-admin JWT authentication with rate-limited login
- Cascade-delete relationships (deleting a project removes its tech stack rows, manuals, and manual steps)
- PostgreSQL via Prisma ORM
- Dockerized for deployment
- CI pipeline that runs the Jest + Supertest suite against a real `postgres:15` service container

## Tech stack

- Node.js + Express 5
- TypeScript
- Prisma ORM
- PostgreSQL 15
- JWT (`jsonwebtoken`, `express-jwt`) + `bcrypt`
- Jest + Supertest for integration tests
- Docker

## API endpoints

| Method | Path                                     | Auth | Description                                 |
| ------ | ---------------------------------------- | :--: | ------------------------------------------- |
| GET    | `/api/health`                            |  —   | Health check                                |
| GET    | `/api/projects`                          |  —   | List all projects                           |
| GET    | `/api/projects/:id`                      |  —   | Get a single project                        |
| POST   | `/api/projects`                          |  ✓   | Create a project                            |
| PUT    | `/api/projects/:id`                      |  ✓   | Update a project                            |
| DELETE | `/api/projects/:id`                      |  ✓   | Delete a project (cascades)                 |
| GET    | `/api/technology`                        |  —   | List technologies                           |
| POST   | `/api/technology`                        |  ✓   | Create a technology                         |
| GET    | `/api/tech-category`                     |  —   | List tech categories                        |
| GET    | `/api/manuals/:projectId`                |  —   | Get all manuals for a project               |
| POST   | `/api/manuals`                           |  ✓   | Create a manual                             |
| PATCH  | `/api/manuals/:id`                       |  ✓   | Update a manual's title/description/version |
| PATCH  | `/api/manuals/:projectId/:id/set-active` |  ✓   | Mark a manual as the active one             |
| DELETE | `/api/manuals/:id`                       |  ✓   | Delete a manual                             |
| POST   | `/api/steps`                             |  ✓   | Add a step to a manual                      |
| PATCH  | `/api/steps/:stepId`                     |  ✓   | Update a manual step                        |
| POST   | `/auth/login`                            |  —   | Admin login (rate-limited)                  |
| GET    | `/auth/verify`                           |  ✓   | Verify a JWT token                          |

## Data model

```
TechCategory ─< Technology ─< ProjectTechStack >─ Project ─< ProjectManual ─< ManualStep
                                                       │
                                              User (single admin)
```

- A `Project` has many `Technology` records (through `ProjectTechStack`) and many `ProjectManual` records.
- Each `ProjectManual` has multiple ordered `ManualStep` entries (numbered, with images and descriptions).
- Deleting a `Project` cascades to its tech-stack join rows and manuals; deleting a manual cascades to its steps.

See [`prisma/schema.prisma`](./prisma/schema.prisma) for the full schema.

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 15 (or use Docker — see below)

### Setup

```bash
git clone git@github.com:VeraV/portfolio-server.git
cd portfolio/server
npm install
```

### Environment variables

Create a `.env` file in `server/`:

```
PORT=5005
ORIGIN=http://localhost:3000
TOKEN_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
```

### Database

```bash
npx prisma migrate dev        # apply migrations and generate Prisma Client
npm run seed                  # seed initial data (optional)
```

### Run

```bash
npm run dev                   # development with auto-reload (ts-node-dev)
# or
npm run build && npm start    # production
```

Server runs on http://localhost:5005.

## Available scripts

| Command                   | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `npm run dev`             | Development server with auto-reload (port 5005) |
| `npm run build`           | Compile TypeScript to `dist/`                   |
| `npm start`               | Run the compiled server (production)            |
| `npm test`                | Run the Jest + Supertest suite                  |
| `npm run seed`            | Seed the database                               |
| `npm run change-password` | Change the admin password                       |

## Testing

The test suite runs against a real PostgreSQL instance — no database mocking. In CI, GitHub Actions spins up a `postgres:15` service container, applies migrations, and runs the suite.

```bash
npm test
```

Test files live in [`tests/`](./tests).

## Docker

```bash
docker compose up --build
```

Server available at http://localhost:5005. See [README.Docker.md](./README.Docker.md) for deployment notes.

## Related

- [Client](https://github.com/VeraV/portfolio-client) — React frontend
- [Tests](https://github.com/VeraV/portfolio-tests) — Playwright E2E test suite
