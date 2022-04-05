import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [ScheduleService, PrismaService],
  controllers: [ScheduleController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class ScheduleModule {}
