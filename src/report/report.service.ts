import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { mapReportData } from "./formatters";
import { ScheduleService } from "../schedule/schedule.service";

@Injectable()
export class ReportService {
  constructor(
    private prismaService: PrismaService,
    private scheduleService: ScheduleService,
  ) {}

  private readonly selectReport = {
    id: true,
    name: true,
    startDate: true,
    endDate: true,
    createdAt: true,
    state: true,
    createdBy: true,
    creater: {
      select: {
        firstName: true,
        middleName: true,
        lastName: true,
      },
    },
  };

  public createNewReport(createReportDto: CreateReportDto, userId: string) {
    return this.prismaService.report.create({
      data: {
        name: createReportDto.name,
        startDate: createReportDto.startDate,
        endDate: createReportDto.endDate,
        createdBy: userId,
      },
    });
  }

  public async getReportsByUserId(userId: string) {
    const list = await this.prismaService.report.findMany({
      select: this.selectReport,
      where: { createdBy: userId },
    });
    return list.map((report) => mapReportData({ report }));
  }

  public async getReportById(id: string) {
    const report = await this.prismaService.report.findFirst({
      select: this.selectReport,
      where: { id },
    });

    return mapReportData({ report });
  }
}
