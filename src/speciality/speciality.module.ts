import { Module } from "@nestjs/common";
import { SpecialityController } from "./speciality.controller";
import { SpecialityService } from "./speciality.service";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [SpecialityController],
  providers: [SpecialityService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PrismaModule,
  ],
})
export class SpecialityModule {}
