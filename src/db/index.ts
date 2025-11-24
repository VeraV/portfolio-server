// src/db/index.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // no options needed
export default prisma;
