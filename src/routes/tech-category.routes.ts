import express from "express";
import { Request, Response, NextFunction } from "express";
import prisma from "../db/index";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const techCategories = await prisma.techCategory.findMany();
    res.json(techCategories);
  } catch (err) {
    console.log("Error getting Tech Categories from DB", err);
    res.status(500).json({ message: "Error getting Tech Categories from DB" });
  }
});

export default router;
