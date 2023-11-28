-- AlterTable
ALTER TABLE "User" ADD COLUMN     "client_id" TEXT,
ADD COLUMN     "manager" BOOLEAN;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "logotipo" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
