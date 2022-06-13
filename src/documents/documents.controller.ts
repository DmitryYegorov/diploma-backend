import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Request,
  UseGuards,
  Get,
  Query,
  Param,
  Response,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("document")
export class DocumentsController {
  constructor(private documentService: DocumentsService) {}

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor("files"))
  uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.documentService.uploadFiles(files, userId);
  }

  @Get()
  public async getDocuments(@Query() options) {
    return this.documentService.getAllDocuments(options);
  }

  @Get("download/:id")
  @UseGuards(JwtAuthGuard)
  public async downloadFile(
    @Param() param,
    @Response({ passthrough: true }) res,
  ) {
    const { id } = param;
    const { file, type, fileName } = await this.documentService.downloadFile(
      id,
    );
    res.set({
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    return { file, fileName };
  }
}
