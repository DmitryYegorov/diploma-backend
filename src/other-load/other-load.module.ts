import { Module } from "@nestjs/common";
import { OtherLoadService } from "./other-load.service";
import { OtherLoadController } from "./other-load.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [OtherLoadService, PrismaService],
  controllers: [OtherLoadController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PrismaModule,
  ],
})
export class OtherLoadModule {}
