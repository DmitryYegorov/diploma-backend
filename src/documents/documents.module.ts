import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { ScheduleService } from "../schedule/schedule.service";
import { ScheduleModule } from "../schedule/schedule.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [PrismaService, DocumentsService, ScheduleService],
  controllers: [DocumentsController],
  imports: [ScheduleModule],
})
export class DocumentsModule {}
