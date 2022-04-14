-- DropForeignKey
ALTER TABLE "event-exception" DROP CONSTRAINT "event-exception_eventId_fkey";

-- AddForeignKey
ALTER TABLE "event-exception" ADD CONSTRAINT "event-exception_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
