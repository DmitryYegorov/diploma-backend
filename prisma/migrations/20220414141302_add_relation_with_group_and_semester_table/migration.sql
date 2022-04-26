/*
  Warnings:

  - Added the required column `semesterId` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group" ADD COLUMN     "semesterId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
