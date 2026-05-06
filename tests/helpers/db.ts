import bcrypt from 'bcrypt';
import prisma from '../../src/db/index';

export const TEST_ADMIN_EMAIL = 'admin@portfolio.com';
export const TEST_ADMIN_PASSWORD = 'TestAdminPassword123!';

// Stable IDs for the minimal seed. Tests can reference these directly
// instead of querying for them.
export const SEED = {
  admin: { id: 'test_user_admin', email: TEST_ADMIN_EMAIL, name: 'Admin' },
  categories: {
    frontend: 'test_cat_frontend',
    backend: 'test_cat_backend',
  },
  technologies: {
    react: 'test_tech_react',
    node: 'test_tech_node',
    postgres: 'test_tech_postgres',
  },
  projects: {
    one: 'test_project_one',
  },
  manuals: {
    active: 'test_manual_active',
  },
  steps: {
    first: 'test_step_first',
    second: 'test_step_second',
  },
};

export async function truncateAll(): Promise<void> {
  // TRUNCATE ... CASCADE wipes everything in one statement and resets sequences.
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "ManualStep",
      "ProjectManual",
      "ProjectTechStack",
      "Project",
      "Technology",
      "TechCategory",
      "User"
    RESTART IDENTITY CASCADE
  `);
}

// Minimal seed: just enough rows to exercise the API surface.
// Tests that need more should add via factories.ts.
export async function seed(): Promise<void> {
  const hashedPassword = bcrypt.hashSync(TEST_ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      id: SEED.admin.id,
      email: SEED.admin.email,
      password: hashedPassword,
      name: SEED.admin.name,
    },
  });

  await prisma.techCategory.createMany({
    data: [
      { id: SEED.categories.frontend, name: 'front-end' },
      { id: SEED.categories.backend, name: 'back-end' },
    ],
  });

  await prisma.technology.createMany({
    data: [
      {
        id: SEED.technologies.react,
        name: 'React',
        logo_url: 'https://example.com/react.png',
        official_site_url: 'https://react.dev',
        categoryId: SEED.categories.frontend,
        sort_order: 1,
      },
      {
        id: SEED.technologies.node,
        name: 'Node.js',
        logo_url: 'https://example.com/node.png',
        official_site_url: 'https://nodejs.org',
        categoryId: SEED.categories.backend,
        sort_order: 2,
      },
      {
        id: SEED.technologies.postgres,
        name: 'PostgreSQL',
        logo_url: 'https://example.com/postgres.png',
        official_site_url: 'https://postgresql.org',
        categoryId: SEED.categories.backend,
        sort_order: 3,
      },
    ],
  });

  await prisma.project.create({
    data: {
      id: SEED.projects.one,
      name: 'Test Project',
      description_short: 'A project for tests',
      image_url: 'https://example.com/image.png',
      client_github_url: 'https://github.com/test/client',
      client_deploy_url: 'https://test.example.com',
      sort_order: 1,
      techStack: {
        create: [
          { technologyId: SEED.technologies.react },
          { technologyId: SEED.technologies.node },
        ],
      },
    },
  });

  await prisma.projectManual.create({
    data: {
      id: SEED.manuals.active,
      projectId: SEED.projects.one,
      title: 'Getting Started',
      description: 'Initial manual',
      version: '1.0',
      isActive: true,
      steps: {
        create: [
          {
            id: SEED.steps.first,
            step_number: 1,
            description: 'First step',
            image_url: 'https://example.com/step1.png',
          },
          {
            id: SEED.steps.second,
            step_number: 2,
            description: 'Second step',
            image_url: 'https://example.com/step2.png',
          },
        ],
      },
    },
  });
}

export async function resetAndSeed(): Promise<void> {
  await truncateAll();
  await seed();
}

export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}

export { prisma };
