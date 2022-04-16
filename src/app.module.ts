import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { EmailModule } from "./email/email.module";
import { SubjectModule } from "./subject/subject.module";
import { EventModule } from "./event/event.module";
import { RoomModule } from "./room/room.module";
import { GroupsModule } from "./groups/groups.module";

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ScheduleModule,
    EmailModule,
    SubjectModule,
    EventModule,
    RoomModule,
    GroupsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
