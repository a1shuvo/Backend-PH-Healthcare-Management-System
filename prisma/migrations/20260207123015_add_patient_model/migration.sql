/*
  Warnings:

  - You are about to drop the `specialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "specialties";

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" VARCHAR(20),
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialty" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "specialty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_email_key" ON "patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patient_userId_key" ON "patient"("userId");

-- CreateIndex
CREATE INDEX "idx_patient_email" ON "patient"("email");

-- CreateIndex
CREATE INDEX "idx_patient_isDeleted" ON "patient"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "specialty_title_key" ON "specialty"("title");

-- CreateIndex
CREATE INDEX "idx_specialty_isDeleted" ON "specialty"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_specialty_title" ON "specialty"("title");

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
