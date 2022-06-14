import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { v4 as uuidv4 } from "uuid";
import {
  mapLoadToMonthReportTable,
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
import { TotalReportType } from "./type";
import { CreateTotalReportDto } from "./dto/create-total-report.dto";
import { EventTypeMap } from "../common/maps";

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

  public async createNewReport(
    createReportDto: CreateReportDto,
    userId: string,
  ) {
    const report = await this.prismaService.report.create({
      data: {
        name: createReportDto.name,
        startDate: moment
          .utc(createReportDto.startDate)
          .startOf("day")
          .toDate(),
        endDate: moment.utc(createReportDto.endDate).endOf("day").toDate(),
        createdBy: userId,
      },
    });

    await this.loadDataToReport(report.id);

    return report;
  }

  public async getReportsByUserId(userId: string) {
    const list = await this.prismaService.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: { createdBy: userId },
      include: {
        creater: true,
      },
    });
    return list.map((report) => mapReportDataToItemList(report));
  }

  public async getReportById(id: string) {
    const report = await this.prismaService.report.findFirst({
      select: this.selectReport,
      where: { id },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return mapReportData({ report });
  }

  public async loadOtherLoadToReport(reportId: string) {
    const report = await this.prismaService.report.findFirst({
      where: { id: reportId },
    });
    const { createdBy, startDate, endDate } = report;

    const otherLoad = await this.prismaService.otherLoad.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        date: {
          gte: moment.utc(startDate).startOf("month").toDate(),
          lte: moment.utc(endDate).endOf("month").toDate(),
        },
        createdBy,
      },
      include: {
        OtherLoadGroup: {
          include: {
            group: {
              include: {
                speciality: {
                  include: {
                    faculty: true,
                  },
                },
              },
            },
          },
        },
        subject: true,
      },
    });

    return otherLoad.map((ol) => mapOtherLoadRowToReportData(ol));
  }

  public async loadDataToReport(reportId: string) {
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
          scheduleClassId: sch.id,
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
        scheduleClassId: sch.scheduleClassId,
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
        data: [
          ...listWithDates.map((l) => {
            delete l.updateType;
            return l;
          }),
          ...otherLoad.map((ol) => ({
            otherLoadId: ol.id,
            type: ol.type,
            subjectId: ol.subjectId,
            reportId: report.id,
            duration: ol.duration,
            date: ol.date,
          })),
        ],
      }),
    ]);

    return this.getExistingLoadDataByReport(reportId);
  }

  public async getExistingLoadDataByReport(reportId: string) {
    const loadData = await this.prismaService.reportLoad.findMany({
      include: {
        subject: true,
        scheduleClass: {
          include: {
            GroupScheduleClass: {
              include: {
                group: {
                  include: {
                    speciality: {
                      include: { faculty: true },
                    },
                  },
                },
              },
            },
          },
        },
        otherLoad: {
          include: {
            OtherLoadGroup: {
              include: {
                group: {
                  include: {
                    speciality: {
                      include: { faculty: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: { reportId },
    });

    return loadData
      .map((sl) => mapReportRowToWidthSubjectName(sl))
      .sort((a, b) => a.date - b.date);
  }

  public async getMappedLoadDataByMonthReport(reportId) {
    const reportLoad = await this.getExistingLoadDataByReport(reportId);

    const withSubjects = reportLoad.filter((rl) => rl.subjectName);
    const withOutSubjects = reportLoad.filter((rl) => !rl.subjectName);

    const groupedBySubjects = _.groupBy(withSubjects, "subjectName");
    const groupedByTypes = _.groupBy(withOutSubjects, "type");

    const formatted = Object.keys(groupedBySubjects).map((subject) => {
      const entries = groupedBySubjects[subject].map((s) => {
        const entry = [s.type];

        const duration = groupedBySubjects[subject]
          .filter((item) => item.type === s.type)
          .reduce((acc, itemDuration) => acc + itemDuration.duration, 0);
        entry.push(duration);

        return entry;
      });

      return {
        ...Object.fromEntries(entries),
        subjectName: subject,
        facultyName: groupedBySubjects[subject][0].facultyName,
        subgroupsCount: groupedBySubjects[subject][0].subGroupsCount,
        studentsCount: groupedBySubjects[subject][0].studentsCount,
        courseAndSpecialityLabel: groupedBySubjects[subject][0].specialityName,
        total: groupedBySubjects[subject].reduce(
          (acc, item) => acc + item.duration,
          0,
        ),
      };
    });

    const formatterWithOutSubjects = Object.keys(groupedByTypes).map((type) => {
      const entries = groupedByTypes[type].map((s) => [s.type, s.duration]);

      return {
        ...Object.fromEntries(entries),
        subjectName: EventTypeMap[type],
        facultyName: groupedByTypes[type][0].facultyName,
        subgroupsCount: groupedByTypes[type][0].subGroupsCount,
        studentsCount: groupedByTypes[type][0].studentsCount,
        specialityName: groupedByTypes[type][0].specialityName,
        total: groupedByTypes[type].reduce(
          (acc, item) => acc + item.duration,
          0,
        ),
      };
    });

    const calculated = [...formatted, ...formatterWithOutSubjects];

    return calculated;
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

  public async getSentReports(options) {
    let where: any = {
      state: {
        not: ReportState.DRAFT,
      },
    };

    if (options.type) {
      where = { ...where, type: options.type };
    }
    if (options.startDate) {
      where = {
        ...where,
        startDate: { gte: moment.utc(options.startDate).toDate() },
      };
    }
    if (options.endDate) {
      where = {
        ...where,
        endDate: { lte: moment.utc(options.endDate).toDate() },
      };
    }
    if (options.state) {
      where = { ...where, state: options.state };
    }

    const res = await this.prismaService.report.findMany({
      where,
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

  public async cancelReport(reportId: string, adminNote: string, userId) {
    const update = await this.prismaService.report.update({
      where: { id: reportId },
      data: {
        state: ReportState.REQUEST_CHANGES,
      },
    });
    const note = await this.prismaService.reportNote.create({
      data: { reportId, note: adminNote, createdBy: userId },
    });

    return note;
  }

  public async removeLoadItemFromReport(id: string) {
    return this.prismaService.reportLoad.delete({ where: { id } });
  }

  public async removeReportById(id: string) {
    return this.prismaService.report.delete({ where: { id } });
  }

  public async createTotalReport(data: CreateTotalReportDto) {
    const createdTotalReport = await this.prismaService.totalReport.create({
      data: {
        name: data.name,
        createdBy: data.createdBy,
        semesterId: data.semesterId,
        academicYearId: data.academicYearId,
        type: data.type,
      },
    });

    await this.prismaService.reportTotalReport.createMany({
      data: data.reportIds.map((reportId) => ({
        reportId,
        totalReportId: createdTotalReport.id,
      })),
    });

    return createdTotalReport;
  }

  public async getTotalReports() {
    const totalReports = await this.prismaService.totalReport.findMany({
      include: {
        creater: true,
      },
    });

    return totalReports.map((item) => ({
      ...item,
      createdName: `${item.creater.firstName} ${item.creater.middleName} ${item.creater.lastName}`,
    }));
  }

  public async getTotalReportById(id: string) {
    const totalReport = await this.prismaService.totalReport.findFirst({
      where: { id },
      include: {
        creater: true,
        ReportTotalReport: {
          include: {
            report: {
              include: {
                creater: true,
              },
            },
          },
        },
      },
    });

    const reports = totalReport.ReportTotalReport.map((item) => ({
      id: item.reportId,
      teacher: `${item.report.creater.firstName} ${item.report.creater.middleName[0]}. ${item.report.creater.lastName[0]}.`,
      startDate: item.report.startDate,
      endDate: item.report.endDate,
    }));

    const dates = [
      ...reports.map((r) => r.endDate),
      ...reports.map((r) => r.startDate),
    ];

    let startDate = dates[0];
    let endDate = dates[0];

    dates.forEach((date: Date) => {
      if (date <= startDate) startDate = date;
      if (date >= endDate) endDate = date;
    });

    const mappedReports = [];

    for await (const report of reports) {
      const mapped = await this.getMappedLoadDataByMonthReport(report.id);
      const load = mapped;
      mappedReports.push({ teacherName: report.teacher, load: mapped });
    }

    return {
      data: mappedReports,
      reportName: totalReport.name,
      createdAt: totalReport.createdAt,
      creater: `${totalReport.creater.firstName} ${totalReport.creater.middleName} ${totalReport.creater.lastName}`,
      startDate: moment.utc(startDate).startOf("day").toDate(),
      endDate: moment.utc(endDate).endOf("day").toDate(),
    };
  }

  public async getReportNotes(reportId: string) {
    const notes = await this.prismaService.reportNote.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: { reportId },
      include: { author: true },
    });

    return notes.map((note) => ({
      ...note,
      authorName: `${note.author.firstName} ${note.author.middleName} ${note.author.lastName}`,
      updated: !!note.updatedAt,
    }));
  }

  public async updateReportNote(noteId: string, newNote: string) {
    const updatedNote = await this.prismaService.reportNote.update({
      data: { note: newNote, updatedAt: moment().toDate() },
      where: { id: noteId },
    });

    return updatedNote;
  }

  public async removeReportNote(noteId: string) {
    const removed = await this.prismaService.reportNote.delete({
      where: { id: noteId },
    });

    return removed;
  }
}
