import { Module } from "@nestjs/common";
import { LoadPlanService } from "./load-plan.service";
import { LoadPlanController } from "./load-plan.controller";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [LoadPlanService, PrismaService],
  controllers: [LoadPlanController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class LoadPlanModule {}
