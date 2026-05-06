import prisma from '../../src/db/index';

let counter = 0;
const uid = (prefix: string) => `test_${prefix}_${Date.now()}_${++counter}`;

export async function createTechCategory(
  overrides: Partial<{ id: string; name: string }> = {}
) {
  return prisma.techCategory.create({
    data: {
      id: overrides.id ?? uid('cat'),
      name: overrides.name ?? uid('cat-name'),
    },
  });
}

export async function createTechnology(
  overrides: Partial<{
    id: string;
    name: string;
    logo_url: string;
    official_site_url: string;
    categoryId: string;
    sort_order: number | null;
  }> = {}
) {
  let categoryId = overrides.categoryId;
  if (!categoryId) {
    const cat = await createTechCategory();
    categoryId = cat.id;
  }
  return prisma.technology.create({
    data: {
      id: overrides.id ?? uid('tech'),
      name: overrides.name ?? uid('tech-name'),
      logo_url: overrides.logo_url ?? 'https://example.com/logo.png',
      official_site_url:
        overrides.official_site_url ?? 'https://example.com',
      categoryId,
      sort_order: overrides.sort_order ?? null,
    },
  });
}

export async function createProject(
  overrides: Partial<{
    id: string;
    name: string;
    description_short: string;
    image_url: string;
    client_github_url: string;
    client_deploy_url: string;
    server_github_url: string | null;
    server_deploy_url: string | null;
    sort_order: number | null;
    technologyIds: string[];
  }> = {}
) {
  const technologyIds = overrides.technologyIds ?? [];
  return prisma.project.create({
    data: {
      id: overrides.id ?? uid('project'),
      name: overrides.name ?? uid('project-name'),
      description_short: overrides.description_short ?? 'desc',
      image_url: overrides.image_url ?? 'https://example.com/image.png',
      client_github_url:
        overrides.client_github_url ?? 'https://github.com/x/y',
      client_deploy_url:
        overrides.client_deploy_url ?? 'https://example.com',
      server_github_url: overrides.server_github_url ?? null,
      server_deploy_url: overrides.server_deploy_url ?? null,
      sort_order: overrides.sort_order ?? null,
      techStack: {
        create: technologyIds.map((technologyId) => ({ technologyId })),
      },
    },
    include: { techStack: { include: { technology: true } } },
  });
}

export async function createManual(
  overrides: {
    projectId: string;
    id?: string;
    title?: string;
    description?: string;
    version?: string;
    isActive?: boolean;
  }
) {
  return prisma.projectManual.create({
    data: {
      id: overrides.id ?? uid('manual'),
      projectId: overrides.projectId,
      title: overrides.title ?? 'Manual',
      description: overrides.description ?? 'desc',
      version: overrides.version ?? '1.0',
      isActive: overrides.isActive ?? false,
    },
  });
}

export async function createStep(overrides: {
  manualId: string;
  step_number: number;
  id?: string;
  description?: string;
  image_url?: string;
}) {
  return prisma.manualStep.create({
    data: {
      id: overrides.id ?? uid('step'),
      manualId: overrides.manualId,
      step_number: overrides.step_number,
      description: overrides.description ?? 'step description',
      image_url: overrides.image_url ?? 'https://example.com/step.png',
    },
  });
}
