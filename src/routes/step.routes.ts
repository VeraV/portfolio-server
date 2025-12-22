import express from "express";
import { Request, Response } from "express";
import prisma from "../db";
import { RequestCreateManualStep, RequestUpdateStep } from "../types/requests";

const router = express.Router();

router.post("/", async (req: RequestCreateManualStep, res: Response) => {
  const { manualId, description, image_url } = req.body;

  if (!manualId || !description || !image_url) {
    return res.status(400).json({ message: "All step fild are required." });
  }

  try {
    const newStep = await prisma.$transaction(async (tx) => {
      // Find last step number
      const max = await tx.manualStep.aggregate({
        where: { manualId },
        _max: { step_number: true },
      });

      const nextStepNumber = (max._max.step_number ?? 0) + 1;

      // Create new step at the end
      return await tx.manualStep.create({
        data: {
          manualId,
          step_number: nextStepNumber,
          description,
          image_url,
        },
      });
    });
    res.status(201).json(newStep);
  } catch (error) {
    console.log("Error while adding a new manual step", error);
    res.status(500).json({ message: "Error while adding a new manual step" });
  }
});

router.patch("/:stepId", async (req: RequestUpdateStep, res: Response) => {
  const { image_url, description } = req.body;
  if (!image_url || !description) {
    return res
      .status(400)
      .json({ message: "Description and image are required." });
  }
  try {
    const updatedStep = await prisma.manualStep.update({
      where: { id: req.params.stepId },
      data: { image_url, description },
    });
    res.status(200).json(updatedStep);
  } catch (error) {
    console.log("Error updating manual step...", error);
    res.status(500).json({ message: "Error updating manual step" });
  }
});

export default router;
