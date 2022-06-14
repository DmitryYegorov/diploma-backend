import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [PrismaModule, JwtModule.register({ secret: process.env.SECRET })],
  providers: [PrismaService, NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
