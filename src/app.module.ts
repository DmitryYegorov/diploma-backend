import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { EmailModule } from "./email/email.module";
import { SubjectModule } from "./subject/subject.module";

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ScheduleModule,
    EmailModule,
    SubjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
