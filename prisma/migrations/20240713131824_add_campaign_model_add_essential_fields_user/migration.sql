/*
  Warnings:

  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'ACTIVE', 'SUCCESS', 'FAIL');

-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cfHandle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cfVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasActiveCampaign" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Authenticator";

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "numProblems" TEXT NOT NULL,
    "targetDuration" INTEGER NOT NULL,
    "cfHandle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activatedOn" TIMESTAMP(3) NOT NULL,
    "hasPledgedAmount" BOOLEAN NOT NULL DEFAULT false,
    "pledgedAmount" INTEGER NOT NULL,
    "pledgeCurrency" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'CREATED',

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
