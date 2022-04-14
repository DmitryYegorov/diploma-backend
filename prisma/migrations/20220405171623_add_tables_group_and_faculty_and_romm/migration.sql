/*
  Warnings:

  - Added the required column `groupIds` to the `schedule-classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `schedule-classes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('COMPUTER', 'LECTURE');

-- AlterTable
ALTER TABLE "schedule-classes" ADD COLUMN     "groupIds" JSON NOT NULL,
ADD COLUMN     "roomId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "faculty" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "shortName" VARCHAR NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" UUID NOT NULL,
    "facultyId" UUID NOT NULL,
    "group" INTEGER NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" UUID NOT NULL,
    "campus" INTEGER NOT NULL,
    "room" INTEGER NOT NULL,
    "type" "RoomType" NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedule-classes" ADD CONSTRAINT "schedule-classes_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
