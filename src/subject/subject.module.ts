import { Module } from "@nestjs/common";
import { SubjectController } from "./subject.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { SubjectService } from "./subject.service";

@Module({
  controllers: [SubjectController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
    PrismaModule,
  ],
  providers: [PrismaService, SubjectService],
})
export class SubjectModule {}
