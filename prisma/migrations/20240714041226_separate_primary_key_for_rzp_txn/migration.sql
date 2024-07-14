/*
  Warnings:

  - Added the required column `id` to the `RazorPayTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RazorPayTransaction_paymentId_key";

-- AlterTable
ALTER TABLE "RazorPayTransaction" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RazorPayTransaction_pkey" PRIMARY KEY ("id");
