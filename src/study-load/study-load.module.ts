import { Module } from "@nestjs/common";
import { StudyLoadService } from "./study-load.service";
import { StudyLoadController } from "./study-load.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [PrismaService, StudyLoadService],
  controllers: [StudyLoadController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PrismaModule,
  ],
})
export class StudyLoadModule {}
