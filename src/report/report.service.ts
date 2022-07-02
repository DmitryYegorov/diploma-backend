import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { v4 as uuidv4 } from "uuid";
import {
  mapOtherLoadRowToReportData,
  mapReportData,
  mapReportDataToItemList,
  mapReportRowToWidthSubjectName,
} from "./formatters";
import { ScheduleService } from "../schedule/schedule.service";
import * as moment from "moment";
import * as _ from "lodash";
import { RRuleSet, rrulestr } from "rrule";
import { ReportState } from "../common/enum";

const { CLASS_DURATION } = process.env;

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
      where: { createdBy: userId },
      include: {
        creater: true,
      },
    });
    return list.map((report) => mapReportDataToItemList(report));
  }

  public async getReportById(id: string) {
    const [report, reportData, calculatedData] = await Promise.all([
      this.prismaService.report.findFirst({
        select: this.selectReport,
        where: { id },
      }),
      this.getReportLoadByReportId(id),
      this.getCalculatedReportByReportId(id),
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return { ...mapReportData({ report, reportData }), calculatedData };
  }

  public async loadOtherLoadToReport(reportId: string) {
    const report = await this.prismaService.report.findFirst({
      where: { id: reportId },
    });
    const { createdBy, startDate, endDate } = report;

    const otherLoad = await this.prismaService.otherLoad.findMany({
      where: {
        date: {
          gte: moment(startDate).startOf("month").toDate(),
          lte: moment(endDate).endOf("month").toDate(),
        },
        createdBy,
      },
      include: {
        faculty: true,
        subject: true,
      },
    });

    return otherLoad.map((ol) => mapOtherLoadRowToReportData(ol));
  }

  public async loadScheduleClassesToReport(reportId: string) {
    const report = await this.prismaService.report.findFirst({
      where: { id: reportId },
    });
    const { createdBy, startDate, endDate } = report;
    const [swaps, reschedules, classes] = await Promise.all([
      this.scheduleService.getSwapsByTeacherId(createdBy, startDate, endDate),
      this.scheduleService.getReschedulesClassesByTeacherId(
        createdBy,
        startDate,
        endDate,
      ),
      this.scheduleService.getClassesByTeacherId(createdBy),
    ]);

    const listWithDates = [];

    classes.forEach((sch) => {
      const rRuleSet = new RRuleSet();
      const rRule = rrulestr(sch.rRule);
      rRuleSet.rrule(rRule);
      const exDate: Array<Date> = sch.exDate
        ? sch.exDate.split(",").map((exd) => moment(exd).toDate())
        : [];

      let dates = rRuleSet
        .between(moment(startDate).toDate(), moment(endDate).toDate(), true)
        .map((date) => moment.utc(date).toDate());

      if (exDate?.length && dates.length) {
        dates = dates.filter((date) => !exDate.includes(date));
      }

      if (!dates.length) return;

      dates.forEach((date) => {
        listWithDates.push({
          subjectId: sch.subject.id,
          type: sch.type,
          id: uuidv4(),
          reportId: report.id,
          duration: parseFloat(CLASS_DURATION),
          date,
        });
      });
    });

    [...swaps, ...reschedules].forEach((sch) =>
      listWithDates.push({
        subjectId: sch.subject.id,
        type: sch.type,
        id: uuidv4(),
        reportId: report.id,
        date: moment(sch.startDate).toDate(),
        duration: parseFloat(CLASS_DURATION),
        updateType: sch.updateType,
      }),
    );

    const otherLoad = await this.loadOtherLoadToReport(report.id);

    await Promise.all([
      this.prismaService.reportLoad.deleteMany({
        where: { reportId: report.id },
      }),
      this.prismaService.reportLoad.createMany({
        data: listWithDates.map((l) => {
          delete l.updateType;
          return l;
        }),
      }),
    ]);

    const studyLoadData = await this.prismaService.reportLoad.findMany({
      include: {
        subject: true,
      },
      where: { reportId },
    });

    return {
      list: [
        ...studyLoadData.map((sl) => mapReportRowToWidthSubjectName(sl)),
        ...otherLoad,
      ],
      total: studyLoadData.length + otherLoad.length,
    };
  }

  public async calculateLoadByReportId(reportId) {
    const reportLoad = await this.getReportLoadByReportId(reportId);

    const withSubjects = reportLoad.filter((rl) => rl.subjectName);
    const withOutSubjects = reportLoad.filter((rl) => !rl.subjectName);

    const groupedBySubjects = _.groupBy(withSubjects, "subjectName");

    const formatted = Object.keys(groupedBySubjects).map((subject) => {
      const entries = groupedBySubjects[subject].map((s) => [
        s.type,
        s.duration,
      ]);

      return {
        ...Object.fromEntries(entries),
        subjectName: subject,
        facultyName: groupedBySubjects[subject][0].facultyName,
        groupsCount: groupedBySubjects[subject][0].groupsCount,
        studentsCount: groupedBySubjects[subject][0].studentsCount,
      };
    });

    const calculated = [...formatted, ...withOutSubjects];
    await Promise.all([
      this.prismaService.calculatedReport.deleteMany({ where: { reportId } }),
      this.prismaService.calculatedReport.create({
        data: {
          reportId: reportId,
          data: JSON.parse(JSON.stringify(calculated)),
        },
      }),
    ]);
    return calculated;
  }

  public async getCalculatedReportByReportId(reportId: string) {
    const calculated = await this.prismaService.calculatedReport.findFirst({
      where: { reportId },
    });

    if (calculated) return calculated.data;

    return [];
  }

  public async saveCalculatedChangesByReportId(reportId: string, changes) {
    const calculatedReport =
      await this.prismaService.calculatedReport.findFirst({
        where: { reportId },
      });

    return this.prismaService.calculatedReport.update({
      where: { id: calculatedReport.id },
      data: { data: changes },
    });
  }

  public async sendReport(reportId: string) {
    return this.prismaService.report.update({
      where: { id: reportId },
      data: {
        state: ReportState.SENT,
        sentAt: moment().toDate(),
      },
    });
  }

  public async getSentReports() {
    const res = await this.prismaService.report.findMany({
      where: { state: ReportState.SENT },
      orderBy: {
        sentAt: "desc",
      },
      include: {
        creater: true,
      },
    });

    return res.map((st) => ({
      ...st,
      createdName: `${st.creater.firstName} ${st.creater.middleName[0]}. ${st.creater.lastName[0]}.`,
    }));
  }

  public async approveReport(reportId: string) {
    const report = await this.prismaService.report.update({
      where: { id: reportId },
      data: { state: ReportState.APPROVED, approvedAt: moment().toDate() },
    });

    return report;
  }

  public async cancelReport(reportId: string, adminNote: string) {
    const update = await this.prismaService.report.update({
      where: { id: reportId },
      data: {
        adminNote,
      },
    });

    return update;
  }

  private async getReportLoadByReportId(reportId: string) {
    const [reportLoad, otherLoad] = await Promise.all([
      this.prismaService.reportLoad.findMany({
        where: { reportId },
        include: {
          subject: true,
        },
      }),
      this.loadOtherLoadToReport(reportId),
    ]);

    const mappedReportLoad = reportLoad.map((rl) =>
      mapReportRowToWidthSubjectName(rl),
    );

    return [...mappedReportLoad, ...otherLoad].sort((a, b) =>
      moment(a.date).toDate() > moment(b.date).toDate() ? 1 : -1,
    );
  }
}
