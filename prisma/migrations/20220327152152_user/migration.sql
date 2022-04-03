-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "activationCode" VARCHAR,
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" UUID,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
