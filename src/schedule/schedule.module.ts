import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { NotificationModule } from "../notification/notification.module";
import { NotificationService } from "../notification/notification.service";

@Module({
  providers: [NotificationService, ScheduleService, PrismaService],
  controllers: [ScheduleController],
  imports: [
    NotificationModule,
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class ScheduleModule {}
