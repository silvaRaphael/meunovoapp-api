/*
  Warnings:

  - You are about to drop the column `date` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `labels` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `participant1_id` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participant2_id` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_receiver_id_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "date",
DROP COLUMN "labels",
DROP COLUMN "read",
DROP COLUMN "receiver_id",
DROP COLUMN "text",
DROP COLUMN "user_id",
ADD COLUMN     "participant1_id" TEXT NOT NULL,
ADD COLUMN     "participant2_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "read" BOOLEAN,
    "labels" TEXT[],

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "Message"("id");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participant1_id_fkey" FOREIGN KEY ("participant1_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participant2_id_fkey" FOREIGN KEY ("participant2_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
