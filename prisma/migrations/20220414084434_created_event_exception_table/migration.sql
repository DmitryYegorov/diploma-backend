-- CreateTable
CREATE TABLE "event-exception" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "exceptionDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event-exception_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event-exception" ADD CONSTRAINT "event-exception_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
