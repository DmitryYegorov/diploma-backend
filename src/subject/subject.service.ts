import { PrismaService } from "../prisma/prisma.service";
import { CreateSubjectDto } from "./dto/create-subject";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SubjectService {
  constructor(private prismaService: PrismaService) {}

  public async createSubject(body: CreateSubjectDto, userId: string) {
    const { name, shortName } = body;

    return this.prismaService.subject.create({
      data: {
        name,
        shortName,
        createdBy: userId,
      },
    });
  }

  public async getSubjectById(id: string) {
    return this.prismaService.subject.findFirst({
      where: { id, deletedAt: null },
    });
  }

  public async getAllSubjects() {
    const list = await this.prismaService.subject.findMany({
      where: { deletedAt: null },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      list,
      total: list.length,
    };
  }

  public async removeSubject(id: string, userId: string) {
    const subject = await this.prismaService.subject.findUnique({
      where: { id },
    });

    subject.deletedAt = new Date();
    subject.deletedBy = userId;

    return this.prismaService.subject.update({
      where: { id },
      data: subject,
    });
  }
}
