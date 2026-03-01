/*
  Warnings:

  - The values [AB_NEGETIVE] on the enum `BloodGroup` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BloodGroup_new" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE');
ALTER TABLE "patient_health_data" ALTER COLUMN "bloodGroup" TYPE "BloodGroup_new" USING ("bloodGroup"::text::"BloodGroup_new");
ALTER TYPE "BloodGroup" RENAME TO "BloodGroup_old";
ALTER TYPE "BloodGroup_new" RENAME TO "BloodGroup";
DROP TYPE "public"."BloodGroup_old";
COMMIT;
