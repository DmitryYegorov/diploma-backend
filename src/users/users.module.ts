import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class UsersModule {}
