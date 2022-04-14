/*
  Warnings:

  - You are about to drop the column `recurrenceUntil` on the `event` table. All the data in the column will be lost.
  - The `recurrencePattern` column on the `event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `courese` to the `group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subGroup` to the `group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "recurrenceUntil",
DROP COLUMN "recurrencePattern",
ADD COLUMN     "recurrencePattern" JSON;

-- AlterTable
ALTER TABLE "group" ADD COLUMN     "courese" INTEGER NOT NULL,
ADD COLUMN     "subGroup" INTEGER NOT NULL;
