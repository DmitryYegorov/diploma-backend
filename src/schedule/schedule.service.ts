import { HttpException, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { PrismaService } from "../prisma/prisma.service";
import * as _ from "lodash";
import { ScheduleClassUpdateType, Week } from "../common/enum";
import {
  formatScheduleClassesList,
  formatScheduleClassesListForDepartment,
  mapScheduleClassReschedule,
  mapScheduleClassSwap,
  mapScheduleClassToEvent,
  mapScheduleClassUpdateAsLogItem,
  mapScheduleTimeToDate,
} from "./formatters";
import { UpdateScheduleClassDto } from "./dto/update-schedule-class.dto";
import { GetScheduleClassesOptionsDto } from "./dto/get-schedule-classes-options.dto";

const updatedSelect = {
  scheduleClass: {
    select: {
      id: true,
      subject: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          middleName: true,
        },
      },
      room: true,
      scheduleTime: true,
      semester: true,
      type: true,
    },
  },
  classDate: true,
  teacher: true,
  type: true,
  rescheduleDate: true,
};

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  public async createScheduleClasses(scheduleClass) {
    const oldClassData = await this.prismaService.scheduleClasses.findMany({
      where: {
        teacherId: scheduleClass.teacherId,
        weekDay: scheduleClass.weekDay,
        scheduleTimeId: scheduleClass.scheduleTimeId,
        week: {
          in: [Week.WEEKLY, scheduleClass.week as Week],
        },
      },
    });

    if (oldClassData.length > 0) {
      await this.prismaService.scheduleClasses.deleteMany({
        where: {
          id: {
            in: oldClassData.map((o) => o.id),
          },
        },
      });
    }

    const created = await this.prismaService.scheduleClasses.create({
      data: {
        teacherId: scheduleClass.teacherId,
        roomId: scheduleClass.roomId,
        semesterId: scheduleClass.semesterId,
        type: scheduleClass.type,
        subjectId: scheduleClass.subjectId,
        weekDay: scheduleClass.weekDay,
        scheduleTimeId: scheduleClass.scheduleTimeId,
        week: scheduleClass.week,
        createdBy: scheduleClass.createdBy,
        createdAt: new Date(),
        startDate: scheduleClass.startDate,
        endDate: scheduleClass.endDate,
      },
    });
    for await (const groupId of scheduleClass.groupIds) {
      await this.prismaService.groupScheduleClass.create({
        data: {
          groupId,
          scheduleClassId: created.id,
        },
      });
    }

    return created;
  }

  public async removeRowByScheduleClassId(id: string) {
    return this.prismaService.scheduleClasses.delete({ where: { id } });
  }

  public async getClassById(id: string) {
    const [classData, groups] = await Promise.all([
      this.prismaService.scheduleClasses.findFirst({
        where: { id },
        include: { room: true },
      }),
      this.prismaService.groupScheduleClass.findMany({
        where: { scheduleClassId: id },
        include: { group: true },
      }),
    ]);

    return { classData, groups };
  }

  public async getScheduleClassOfDepartment(semesterId: string) {
    const teachers = await this.prismaService.user.findMany({
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
      },
      where: {
        isActive: true,
      },
    });

    const entries = [];

    for await (const teacher of teachers) {
      const scheduleClasses = await this.getScheduleClassesBySemester(
        teacher.id,
        semesterId,
      );

      entries.push([
        `${teacher.firstName} ${teacher.middleName[0]}. ${teacher.lastName[0]}.`,
        scheduleClasses,
      ]);
    }

    return Object.fromEntries(entries);
  }

  // for department
  public async getScheduleClassesBySemester(
    teacherId: string,
    semesterId: string,
  ) {
    const scheduleClasses = await this.prismaService.scheduleClasses.findMany({
      select: {
        weekDay: true,
        week: true,
        subject: {
          select: {
            shortName: true,
          },
        },
        room: {
          select: {
            room: true,
            campus: true,
          },
        },
        type: true,
        GroupScheduleClass: {
          select: {
            group: {
              select: {
                courese: true,
                group: true,
                subGroup: true,
                faculty: {
                  select: {
                    shortName: true,
                  },
                },
              },
            },
          },
        },
        scheduleTime: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      where: {
        teacherId,
        semesterId,
      },
    });

    const formatted = formatScheduleClassesListForDepartment(scheduleClasses);

    return formatted;
  }

  // for teacher
  public async getScheduleClassesBySemesterId(
    teacherId: string,
    semesterId: string,
  ) {
    const scheduleClasses = await this.prismaService.scheduleClasses.findMany({
      where: { teacherId, semesterId: semesterId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
        room: true,
        scheduleTime: true,
      },
    });

    const groupsData = await this.prismaService.groupScheduleClass.findMany({
      select: {
        scheduleClassId: true,
        group: {
          include: {
            faculty: true,
          },
        },
      },
      where: {
        scheduleClassId: {
          in: scheduleClasses.map((s) => s.id),
        },
      },
    });

    const groupedScheduleClassesById = _.groupBy(scheduleClasses, "id");
    const groupedGroupsListByScheduleClassId = _.groupBy(
      groupsData,
      "scheduleClassId",
    );

    const scheduleClassesWithGroupData = Object.keys(
      groupedScheduleClassesById,
    ).map((scheduleClassId: string) => ({
      ...groupedScheduleClassesById[scheduleClassId][0],
      groups: groupedGroupsListByScheduleClassId[scheduleClassId].map((g) => ({
        label: `${g.group.courese} ${g.group.faculty.shortName} ${g.group.group}-${g.group.subGroup}`,
        id: g.group.id,
      })),
    }));

    return {
      list: formatScheduleClassesList(scheduleClassesWithGroupData),
    };
  }

  public async getScheduleClassByOptions(
    options: GetScheduleClassesOptionsDto,
  ) {
    const where = {
      ...options,
      ...(options.weekDay !== undefined ? { weekDay: +options.weekDay } : {}),
    };
    const res = await this.prismaService.scheduleClasses.findMany({
      where: where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
        room: true,
        scheduleTime: true,
        semester: true,
      },
    });
    return _.groupBy(res, "week");
  }

  public async getScheduleClassesListByTeacherId(
    teacherId: string,
    toReport = false,
  ): Promise<Array<any>> {
    const list = await this.prismaService.scheduleClasses.findMany({
      where: { teacherId },
      include: {
        ScheduleClassUpdate: true,
        subject: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
        room: true,
        scheduleTime: true,
        semester: true,
      },
    });

    const [swaps, reschedule] = await Promise.all([
      this.prismaService.scheduleClassUpdate.findMany({
        where: { teacherId, type: ScheduleClassUpdateType.SWAP },
        select: updatedSelect,
      }),
      this.prismaService.scheduleClassUpdate.findMany({
        where: {
          createdBy: teacherId,
          type: ScheduleClassUpdateType.RESCHEDULED,
        },
        select: updatedSelect,
      }),
    ]);

    const updated = [
      ...swaps.map((swap) => mapScheduleClassSwap(swap, toReport)),
      ...reschedule.map((r) => mapScheduleClassReschedule(r)),
    ];

    return [...list.map((sc) => mapScheduleClassToEvent(sc)), ...updated];
  }

  public async swapTeacherOnScheduleClass(
    scheduleClassId: string,
    classDate: Date,
    teacherId: string,
    reason: string,
    initiator: string,
  ) {
    const update = await this.prismaService.scheduleClassUpdate.create({
      data: {
        scheduleClassId,
        teacherId,
        type: ScheduleClassUpdateType.SWAP,
        reason,
        classDate,
        createdBy: initiator,
      },
    });

    return update;
  }

  public async getListOfTimesClasses() {
    const list = await this.prismaService.scheduleTime.findMany();
    return {
      list: list.map((item) => ({
        id: item.id,
        startTime: new Date(0, 0, 0, item.startHours, item.startMinute),
        endTime: new Date(0, 0, 0, item.endHours, item.endMinute),
      })),
      total: list.length,
    };
  }

  public async updateScheduleClass(
    data: UpdateScheduleClassDto & { createdBy: string },
  ) {
    const { scheduleClassId, type, reason, createdBy } = data;

    const { scheduleTime } = await this.prismaService.scheduleClasses.findFirst(
      {
        select: {
          scheduleTime: true,
        },
        where: { id: scheduleClassId },
      },
    );

    const rescheduleDate =
      type === ScheduleClassUpdateType.RESCHEDULED
        ? mapScheduleTimeToDate(
            moment(data.rescheduleDate).toDate(),
            scheduleTime,
          ).startTime
        : null;

    const classDate = mapScheduleTimeToDate(
      moment(data.classDate).toDate(),
      scheduleTime,
    ).startTime;

    return this.prismaService.scheduleClassUpdate.create({
      data: {
        scheduleClassId,
        type,
        reason,
        classDate,
        createdBy,
        rescheduleDate,
      },
    });
  }

  public async getScheduleUpdatesByPeriod(data: {
    teacherId: string;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    const { teacherId, startDate, endDate } = data;
    const updates = await this.prismaService.scheduleClassUpdate.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        classDate: true,
        type: true,
        rescheduleDate: true,
        scheduleClass: {
          select: {
            type: true,
            subject: {
              select: {
                shortName: true,
              },
            },
            teacher: {
              select: {
                firstName: true,
                middleName: true,
                lastName: true,
              },
            },
          },
        },
        teacher: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
        reason: true,
        createdAt: true,
      },
      where: {
        OR: [{ teacherId }, { createdBy: teacherId }],
        classDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    return updates.map((u) => mapScheduleClassUpdateAsLogItem(u));
  }

  public async getSwapsByTeacherId(
    teacherId: string,
    startDate: Date | string,
    endDate: Date | string,
  ) {
    const swaps = await this.prismaService.scheduleClassUpdate.findMany({
      select: updatedSelect,
      where: {
        teacherId,
        type: ScheduleClassUpdateType.SWAP,
        classDate: {
          lte: endDate,
          gte: startDate,
        },
      },
    });

    return swaps.map((s) => mapScheduleClassSwap(s));
  }

  public async getReschedulesClassesByTeacherId(
    teacherId: string,
    startDate: Date | string,
    endDate: Date | string,
  ) {
    const reschedules = await this.prismaService.scheduleClassUpdate.findMany({
      select: updatedSelect,
      where: {
        createdBy: teacherId,
        type: ScheduleClassUpdateType.RESCHEDULED,
        rescheduleDate: {
          lte: endDate,
          gte: startDate,
        },
      },
    });

    return reschedules.map((r) => mapScheduleClassReschedule(r));
  }

  public async getClassesByTeacherId(teacherId: string) {
    const classes = await this.prismaService.scheduleClasses.findMany({
      where: { teacherId },
      include: {
        ScheduleClassUpdate: true,
        subject: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
        room: true,
        scheduleTime: true,
        semester: true,
      },
    });
    return classes.map((c) =>
      mapScheduleClassToEvent(c, { includeScheduleTime: true }),
    );
  }

  public async updateDataScheduleClass(id: string, data: any) {
    const { groups } = data;

    if (groups?.length) {
      await Promise.all([
        this.prismaService.groupScheduleClass.deleteMany({
          where: { scheduleClassId: id },
        }),
        this.prismaService.groupScheduleClass.createMany({
          data: groups.map((g) => ({ scheduleClassId: id, groupId: g.id })),
        }),
      ]);
    }

    delete data.groups;

    const scheduleClasses = await this.prismaService.scheduleClasses.findMany({
      where: {
        id: {
          not: id,
        },
        weekDay: data.weekDay,
        scheduleTimeId: data.scheduleTimeId,
        week: {
          in: [data.week as Week, Week.WEEKLY],
        },
      },
    });

    console.log(scheduleClasses);

    if (scheduleClasses.length > 0) {
      throw new HttpException(
        { message: "Обновление невозможно. На это время стоит занятие!" },
        400,
      );
    }

    return Promise.all([
      this.prismaService.scheduleClasses.update({ where: { id }, data }),
    ]);
  }
}
