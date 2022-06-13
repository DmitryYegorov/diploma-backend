import { Injectable, StreamableFile } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { v4 } from "uuid";
import { PrismaService } from "../prisma/prisma.service";
import { transliterate } from "./helpers";
import * as buffer from "buffer";

const uploadPath = path.join(__dirname, "../../upload");

@Injectable()
export class DocumentsService {
  constructor(private prismaService: PrismaService) {}

  public async uploadFiles(files: Array<Express.Multer.File>, userId: string) {
    const documentRows = [];

    files.forEach((file) => {
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf(".") + 1,
        file.originalname.length,
      );
      const name = file.originalname.substring(
        0,
        file.originalname.lastIndexOf("."),
      );

      const id = v4();
      const fileName = `${id}.${ext}`;
      const filePath = path.resolve(uploadPath, fileName);
      fs.writeFileSync(filePath, file.buffer);

      documentRows.push({
        id,
        path: fileName,
        name,
        type: file.mimetype,
        loadedBy: userId,
        description: "",
      });
    });

    return this.prismaService.document.createMany({ data: documentRows });
  }

  public async getAllDocuments(options: any) {
    const rows = await this.prismaService.document.findMany({
      include: {
        author: true,
      },
    });

    return rows.map((row) => ({
      ...row,
      authorName: `${row.author.firstName} ${row.author.middleName[0]}. ${row.author.lastName[0]}.`,
    }));
  }

  public async downloadFile(id: string) {
    const fileData = await this.prismaService.document.findFirst({
      where: { id },
    });

    const ext = fileData.path.substring(
      fileData.path.lastIndexOf(".") + 1,
      fileData.path.length,
    );

    const filePath = path.resolve(uploadPath, fileData.path);

    const file = fs.readFileSync(filePath).toString("base64");

    return {
      file,
      type: fileData.type,
      fileName: `${transliterate(fileData.name).replace(" ", "_")}.${ext}`,
    };
  }
}
