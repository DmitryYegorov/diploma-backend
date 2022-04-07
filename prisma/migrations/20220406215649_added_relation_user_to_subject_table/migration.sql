-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
