const express = require("express");

import { Request, Response, NextFunction } from "express";
const router = express.Router();

router.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

module.exports = router;
