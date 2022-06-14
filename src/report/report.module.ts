import { Module } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportController } from "./report.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { ScheduleService } from "../schedule/schedule.service";
import { ScheduleModule } from "../schedule/schedule.module";
import { NotificationModule } from "../notification/notification.module";
import { NotificationService } from "../notification/notification.service";

@Module({
  providers: [
    NotificationService,
    PrismaService,
    ReportService,
    ScheduleService,
  ],
  controllers: [ReportController],
  imports: [
    NotificationModule,
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PrismaModule,
    ScheduleModule,
  ],
})
export class ReportModule {}
