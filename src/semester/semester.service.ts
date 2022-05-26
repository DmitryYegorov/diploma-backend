import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAcademicYearDto } from "./dto/create-academic-year.dto";

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

  public async createNewAcademicYear(data: CreateAcademicYearDto) {
    const academicYear = await this.prismaService.academicYear.create({
      data: data.academicYear,
    });
    await this.prismaService.semester.createMany({
      data: data.semesters.map((item) => ({
        ...item,
        academicYearId: academicYear.id,
      })),
    });

    return academicYear;
  }

  public async getAcademicYears() {
    return this.prismaService.academicYear.findMany({
      orderBy: {
        startDate: "desc",
      },
    });
  }

  public async getAcademicYearWithSemestersById(id: string) {
    const [academicYear, semesters] = await Promise.all([
      this.prismaService.academicYear.findFirst({ where: { id } }),
      this.prismaService.semester.findMany({ where: { academicYearId: id } }),
    ]);

    return { academicYear, semesters };
  }
}
