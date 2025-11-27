/*
  Warnings:

  - Added the required column `image_url` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "image_url" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProjectManual" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "ProjectManual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualStep" (
    "id" TEXT NOT NULL,
    "manualId" TEXT NOT NULL,
    "step_number" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ManualStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManualStep_manualId_step_number_key" ON "ManualStep"("manualId", "step_number");

-- AddForeignKey
ALTER TABLE "ProjectManual" ADD CONSTRAINT "ProjectManual_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualStep" ADD CONSTRAINT "ManualStep_manualId_fkey" FOREIGN KEY ("manualId") REFERENCES "ProjectManual"("id") ON DELETE CASCADE ON UPDATE CASCADE;
