/*
  Warnings:

  - Changed the type of `numProblems` on the `Campaign` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "numProblems",
ADD COLUMN     "numProblems" INTEGER NOT NULL;
