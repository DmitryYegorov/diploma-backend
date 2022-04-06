-- CreateTable
CREATE TABLE "semester" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL,

    CONSTRAINT "semester_pkey" PRIMARY KEY ("id")
);
