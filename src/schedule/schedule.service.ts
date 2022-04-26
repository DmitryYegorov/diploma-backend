import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as _ from "lodash";
import { ClassType, ScheduleClassUpdateType, Week } from "../common/enum";
import {
  formatScheduleClassesList,
  formatScheduleClassesListForDepartment,
  mapScheduleClassToEvent,
  mapScheduleClassUpdateAsLogItem,
  mapScheduleClassUpdateToEvent,
} from "./formatters";
import { UpdateScheduleClassDto } from "./dto/update-schedule-class.dto";

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  public async createScheduleClasses(scheduleClass) {
    const semester = await this.getCurrentSemester();

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
        semesterId: semester.id,
        type: scheduleClass.type,
        subjectId: scheduleClass.subjectId,
        weekDay: scheduleClass.weekDay,
        scheduleTimeId: scheduleClass.scheduleTimeId,
        week: scheduleClass.week,
        createdBy: scheduleClass.createdBy,
        createdAt: new Date(),
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

  public async getScheduleClassesByTeacherForCurrentSem(teacherId: string) {
    const currentSemester = await this.getCurrentSemester();
    const scheduleClasses = await this.prismaService.scheduleClasses.findMany({
      where: { teacherId, semesterId: currentSemester.id },
      include: {
        subject: {
          select: {
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
      groups: groupedGroupsListByScheduleClassId[scheduleClassId].map(
        (g) =>
          `${g.group.courese} ${g.group.faculty.shortName} ${g.group.group} ${
            groupedScheduleClassesById[scheduleClassId][0].type ===
            ClassType.LAB
              ? `/${g.group.subGroup}`
              : ""
          }`,
      ),
    }));

    return {
      list: formatScheduleClassesList(scheduleClassesWithGroupData),
    };
  }

  public async getScheduleClassesListByTeacherId(
    teacherId: string,
  ): Promise<Array<any>> {
    const currentSemester = await this.getCurrentSemester();
    const updatedSelect = {
      scheduleClass: {
        select: {
          subject: {
            select: {
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

    const list = await this.prismaService.scheduleClasses.findMany({
      where: { teacherId, semesterId: currentSemester.id },
      include: {
        ScheduleClassUpdate: true,
        subject: {
          select: {
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

    const [swaps, other] = await Promise.all([
      this.prismaService.scheduleClassUpdate.findMany({
        where: { teacherId, type: ScheduleClassUpdateType.SWAP },
        select: updatedSelect,
      }),
      this.prismaService.scheduleClassUpdate.findMany({
        where: {
          createdBy: teacherId,
          type: { not: ScheduleClassUpdateType.SWAP },
        },
        select: updatedSelect,
      }),
    ]);

    const updated = [...swaps, ...other].filter(
      (u) => u.type !== ScheduleClassUpdateType.CANCEL,
    );

    return [
      ...list.map((sc) => mapScheduleClassToEvent(sc)),
      ...(updated.length
        ? updated.map((u) => mapScheduleClassUpdateToEvent(u))
        : []),
    ];
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

  public async updateScheduleClass(
    data: UpdateScheduleClassDto & { createdBy: string },
  ) {
    const {
      scheduleClassId,
      type,
      reason,
      rescheduleDate,
      classDate,
      createdBy,
    } = data;

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
}
