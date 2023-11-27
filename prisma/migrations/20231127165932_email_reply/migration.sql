/*
  Warnings:

  - You are about to drop the column `hasReply` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "hasReply",
ADD COLUMN     "has_reply" BOOLEAN;
