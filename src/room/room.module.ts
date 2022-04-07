import { Module } from "@nestjs/common";
import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [RoomService, PrismaService],
  controllers: [RoomController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PrismaModule,
  ],
})
export class RoomModule {}
