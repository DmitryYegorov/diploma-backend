import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ScheduleService } from "../schedule/schedule.service";

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService, ScheduleService],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class EventModule {}
