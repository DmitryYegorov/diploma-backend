import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { EmailModule } from "./email/email.module";
import { SubjectModule } from "./subject/subject.module";
import { RoomModule } from "./room/room.module";
import { GroupsModule } from "./groups/groups.module";
import { DocumentsModule } from "./documents/documents.module";
import { ReportModule } from "./report/report.module";
import { SemesterModule } from "./semester/semester.module";
import { FacultyModule } from "./faculty/faculty.module";
import { OtherLoadModule } from './other-load/other-load.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ScheduleModule,
    EmailModule,
    SubjectModule,
    RoomModule,
    GroupsModule,
    DocumentsModule,
    ReportModule,
    SemesterModule,
    FacultyModule,
    OtherLoadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
