-- CreateTable
CREATE TABLE "UserPreferences" (
    "user_id" TEXT NOT NULL,
    "email_notification" BOOLEAN NOT NULL,
    "console_notification" BOOLEAN NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_user_id_key" ON "UserPreferences"("user_id");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
