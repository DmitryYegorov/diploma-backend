import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SemesterService {
  constructor(private prismaService: PrismaService) {}

  public async getList() {
    const list = await this.prismaService.semester.findMany({
      select: {
        id: true,
        name: true,
        isArchived: true,
        startDate: true,
        endDate: true,
      },
    });

    return { list, total: list.length };
  }

  public async getSemesterById(id: string) {
    return this.prismaService.semester.findFirst({ where: { id } });
  }

  public async getCurrentSemester() {
    const now = new Date();
    const semester = await this.prismaService.semester.findFirst({
      where: {
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      include: {
        academicYear: true,
      },
    });

    return {
      id: semester.id,
      semester: {
        startDate: semester.startDate,
        endDate: semester.endDate,
      },
      academicYear: {
        id: semester.academicYearId,
        startDate: semester.academicYear.startDate,
        endDate: semester.academicYear.endDate,
      },
    };
  }
}
