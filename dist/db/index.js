"use strict";
// src/db/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient(); // no options needed
exports.default = prisma;
/*import { PrismaClient } from "@prisma/client";

//const prisma = new PrismaClient();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/*  export default async function handler(req, res) {
      // ... your code ...
     }*/
/*

      import { PrismaClient } from '@prisma/client'
     
    const globalForPrisma = globalThis as unknown as {
    
      prisma: PrismaClient | undefined
    
    }
     
    export const prisma = globalForPrisma.prisma ?? new PrismaClient()
    
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

    */
