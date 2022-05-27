import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OtherLoad } from "@prisma/client";

@Injectable()
export class OtherLoadService {
  constructor(private prismaService: PrismaService) {}

  public async saveOtherLoadRow(row: OtherLoad) {
    return this.prismaService.otherLoad.create({ data: row });
  }

  public async getOtherLoadByUserId(userId: string) {
    return this.prismaService.otherLoad.findMany({
      where: { createdBy: userId },
    });
  }
}
