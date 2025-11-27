import express from "express";
import { Request, Response } from "express";
import prisma from "../db/index";
import { RequestCreateTechnology } from "../types/requests";
import { isAuthenticated } from "../middleware/jwt.middleware";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const technologies = await prisma.technology.findMany({
      include: {
        category: true,
      },
    });
    res.json(technologies);
  } catch (err) {
    console.log("Error retrieving all technologies...", err);
    res.status(500).json({ message: "Error retrieving all technologies" });
  }
});

router.post("/", isAuthenticated, async (req: RequestCreateTechnology, res: Response) => {
  const { name, logo_url, official_site_url, categoryId } = req.body;

  if (!name || !logo_url || !official_site_url || !categoryId) {
    res.status(400).json({ message: "Error: some fields are missing" });
    return;
  }

  try {
    const createdTechnology = await prisma.technology.create({
      data: {
        name,
        logo_url,
        official_site_url,
        categoryId,
      },
      include: {
        category: true,
      },
    });
    res.json(createdTechnology);
  } catch (err) {
    console.log("Error creating technology...", err);
    res.status(500).json({ message: "Error creating technology" });
  }
});

export default router;
