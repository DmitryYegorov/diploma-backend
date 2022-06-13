import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { PrismaService } from "../prisma/prisma.service";
import { MulterModule } from "@nestjs/platform-express";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [PrismaService, DocumentsService],
  controllers: [DocumentsController],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET,
    }),
  ],
})
export class DocumentsModule {}
