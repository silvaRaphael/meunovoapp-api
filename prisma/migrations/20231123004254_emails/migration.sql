/*
  Warnings:

  - You are about to drop the column `sended_at` on the `Email` table. All the data in the column will be lost.
  - The `to` column on the `Email` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `created_at` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "sended_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
DROP COLUMN "to",
ADD COLUMN     "to" TEXT[];
