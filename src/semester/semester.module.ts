import { Module } from "@nestjs/common";
import { SemesterService } from "./semester.service";
import { SemesterController } from "./semester.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [PrismaService, SemesterService],
  controllers: [SemesterController],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class SemesterModule {}
