import express from "express";
import { Request, Response } from "express";
import prisma from "../db/index";
import { RequestCreateProject, RequestUpdateProject } from "../types/requests";
import { isAuthenticated } from "../middleware/jwt.middleware";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        techStack: {
          include: { technology: true },
        },
      },
    });
    res.json(projects);
  } catch (err) {
    console.log("Error retrieving all projects...", err);
    res.status(500).json({ message: "Error retrieving all projects" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Project ID is required" });
  }
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        techStack: {
          include: { technology: true },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    console.log("Error retrieving the project...", err);
    res.status(500).json({ message: "Error retrieving the project" });
  }
});

router.post("/", isAuthenticated, async (req: RequestCreateProject, res: Response) => {
  const {
    name,
    description_short,
    client_github_url,
    client_deploy_url,
    server_github_url,
    server_deploy_url,
    image_url,
    technologyIds,
  } = req.body;

  if (!name || !description_short || !client_github_url || !client_deploy_url || !image_url) {
    res.status(400).json({ message: "Error: some fields are missing" });
    return;
  }

  try {
    const createdProject = await prisma.project.create({
      data: {
        name,
        description_short,
        client_github_url,
        client_deploy_url,
        server_github_url,
        server_deploy_url,
        image_url,
        techStack: {
          create: technologyIds.map((techId) => ({ technologyId: techId })),
        },
      },
      include: {
        techStack: true,
      },
    });
    res.json(createdProject);
  } catch (err) {
    console.log("Error creating project...", err);
    res.status(500).json({ message: "Error creating project" });
  }
});

router.put("/:id", isAuthenticated, async (req: RequestUpdateProject, res: Response) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Project ID is required" });
  }

  const {
    name,
    description_short,
    client_github_url,
    client_deploy_url,
    server_github_url,
    server_deploy_url,
    image_url,
    technologyIds,
  } = req.body;

  if (!name || !description_short || !client_github_url || !client_deploy_url || !image_url) {
    res.status(400).json({ message: "Error: some fields are missing" });
    return;
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name,
        description_short,
        client_github_url,
        client_deploy_url,
        server_github_url,
        server_deploy_url,
        image_url,
        techStack: {
          deleteMany: {}, // ← delete all previous relations
          create: technologyIds.map((techId) => ({
            technologyId: techId,
          })),
        },
      },
      include: {
        techStack: {
          include: { technology: true },
        },
      },
    });
    res.json(updatedProject);
  } catch (err) {
    console.log("Error updating project...", err);
    res.status(500).json({ message: "Error updating project" });
  }
});

router.delete("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const deletedProject = await prisma.project.delete({
      where: {
        id: req.params.id,
      },
    });
    res.json(deletedProject);
  } catch (err) {
    console.log("Error deleting project...", err);
    res.status(500).json({ message: "Error deleting project" });
  }
});

export default router;
