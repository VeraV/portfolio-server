import express from "express";
import { Request, Response } from "express";
import prisma from "../db/index";
import { Result } from "@prisma/client/runtime/library";
import { isAuthenticated } from "../middleware/jwt.middleware";
import { RequestCreateManual, RequestUpdateManual } from "../types/requests";

const router = express.Router();

//Get all project manuals, no need for steps (active manual steps are fetching with Project). Select id, title, description, version, isActive fields
router.get("/:projectId", async (req: Request, res: Response) => {
  if (!req.params.projectId) {
    return res.status(400).json({ message: "Project ID is required" });
  }
  try {
    const projectManuals = await prisma.projectManual.findMany({
      where: { projectId: req.params.projectId },
      select: { id: true, title: true, description: true, version: true, isActive: true },
      orderBy: { version: "desc" },
    });
    res.json(projectManuals);
  } catch (err) {
    console.log("Error retrieving project's manuals...", err);
    res
      .status(500)
      .json({ message: "Error retrieving project's manuals" });
  }
});

//CHECK: save particular Manual data: title, description, version (ProjectId and isActive remain untouched)
router.patch(
  "/:id",
  isAuthenticated,
  async (req: RequestUpdateManual, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Manual ID is required" });
    }

    const { title, description, version } = req.body;

    if (!title || !description || !version) {
      res.status(400).json({ message: "Error: some fields are missing" });
      return;
    }

    try {
      const updatedManual = await prisma.projectManual.update({
        where: { id: req.params.id },
        data: { title, description, version },
      });
      res.status(200).json(updatedManual);
    } catch (error) {
      console.log("Error updateing project's manual...", error);
      res.status(500).json({ message: "Error updating project's manual" });
    }
  }
);

//CHECK: update all Manuals -- all's isActive status becomes False, and just ones (whose id in params) set to True
//Make sure the frontend is updated and showing active manual steps
router.patch(
  "/:projectId/:id/set-active",
  isAuthenticated,
  async (req: Request, res: Response) => {
    if (!req.params.id || !req.params.projectId) {
      return res
        .status(400)
        .json({ message: "Manual ID and Project ID are required" });
    }

    try {
      const [, activeManual] = await prisma.$transaction([
        prisma.projectManual.updateMany({
          where: {
            projectId: req.params.projectId,
          },
          data: {
            isActive: false,
          },
        }),

        prisma.projectManual.update({
          where: {
            id: req.params.id,
          },
          data: {
            isActive: true,
          },
          include: { steps: true },
        }),
      ]);
      res.status(201).json(activeManual);
    } catch (error) {
      console.log("Error setting active project's manual...", error);
      res
        .status(500)
        .json({ message: "Error setting active project's manual" });
    }
  }
);

//CHECK: need to remove particular Manual with all the corresponding Manual Steps
router.delete("/:id", isAuthenticated, async (req: Request, res: Response) => {
  try {
    const deletedManual = await prisma.projectManual.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(deletedManual);
  } catch (err) {
    console.log("Error deleting manual...", err);
    res.status(500).json({ message: "Error deleting manual" });
  }
});

//CHECK: need to create a Manual (title, description, version, isActive set to false by default)
router.post(
  "/",
  isAuthenticated,
  async (req: RequestCreateManual, res: Response) => {
    const { projectId, title, description, version } = req.body;

    if (!projectId || !title || !description || !version) {
      res.status(400).json({ message: "Error: some fields are missing" });
      return;
    }

    try {
      const createdManual = await prisma.projectManual.create({
        data: { projectId, title, description, version, isActive: false },
        include: { steps: true },
      });
      res.status(201).json(createdManual);
    } catch (error) {
      console.log("Error creating project's manual...", error);
      res.status(500).json({ message: "Error creating project's manual" });
    }
  }
);

export default router;
