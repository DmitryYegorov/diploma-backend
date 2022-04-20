-- CreateTable
CREATE TABLE "StudyLoad" (
    "id" UUID NOT NULL,
    "type" "EventType" NOT NULL,
    "subjectId" UUID,
    "semesterId" UUID NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "teacherId" UUID NOT NULL,

    CONSTRAINT "StudyLoad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudyLoad" ADD CONSTRAINT "StudyLoad_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyLoad" ADD CONSTRAINT "StudyLoad_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyLoad" ADD CONSTRAINT "StudyLoad_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
