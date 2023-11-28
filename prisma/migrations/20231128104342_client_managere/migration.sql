/*
  Warnings:

  - You are about to drop the column `manager` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "manager",
ADD COLUMN     "is_manager" BOOLEAN;
