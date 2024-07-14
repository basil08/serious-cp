-- AlterTable
ALTER TABLE "User" ADD COLUMN     "orderIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "RazorPayTransaction" (
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "RazorPayTransaction_pkey" PRIMARY KEY ("paymentId")
);
