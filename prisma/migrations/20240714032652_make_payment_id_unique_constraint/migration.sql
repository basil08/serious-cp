/*
  Warnings:

  - The primary key for the `RazorPayTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[paymentId]` on the table `RazorPayTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RazorPayTransaction" DROP CONSTRAINT "RazorPayTransaction_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "RazorPayTransaction_paymentId_key" ON "RazorPayTransaction"("paymentId");
