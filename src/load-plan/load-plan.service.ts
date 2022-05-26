import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LoadPlanService {
  constructor(private prismaService: PrismaService) {}

  public async getActiveTeachers() {
    return this.prismaService.user.findMany({
      where: {
        isActive: true,
        activationCode: null,
      },
    });
  }
}
