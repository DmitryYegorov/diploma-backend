import { Module } from "@nestjs/common";
import { FacultyService } from "./faculty.service";
import { FacultyController } from "./faculty.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [FacultyService, PrismaService],
  controllers: [FacultyController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PrismaModule,
  ],
})
export class FacultyModule {}
