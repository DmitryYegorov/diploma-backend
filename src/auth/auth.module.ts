import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { EmailModule } from "../email/email.module";
import { EmailService } from "../email/email.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, EmailService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    EmailModule,
  ],
})
export class AuthModule {}
