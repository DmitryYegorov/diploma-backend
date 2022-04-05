import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class EventModule {}
