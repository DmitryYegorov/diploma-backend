import { Injectable } from "@nestjs/common";
import { CreateClassDto } from "./dto/create-class.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ScheduleClasses, ScheduleTime } from "@prisma/client";
import { UpdateClassDto } from "./dto/update-class.dto";
import * as _ from "lodash";
import moment from "moment";
import { Week } from "../common/enum";
import { formatScheduleClassesList } from "./formatters";

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  public async createScheduleClasses(scheduleClasses) {
    const createdList = [];
    const semester = await this.getCurrentSemester();

    for await (const scheduleClass of scheduleClasses) {
      const oldClassData = await this.prismaService.scheduleClasses.findMany({
        where: {
          teacherId: scheduleClass.teacherId,
          weekDay: scheduleClass.weekDay,
          scheduleTimeId: scheduleClass.scheduleTimeId,
          week: {
            in: [Week.WEEKLY, scheduleClass.week],
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
        data: { ...scheduleClass, semesterId: semester.id },
      });
      createdList.push(created);
    }

    return {
      list: createdList,
      total: createdList.length,
    };
  }

  public async updateManyScheduleClass(list: UpdateClassDto[]) {
    const ids: string[] = list.map((item) => item.id);

    const listOfOldData = await this.prismaService.scheduleClasses.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const groupedById = _.groupBy(listOfOldData, "id");
    const updatedDataList = [];

    for await (const id of ids) {
      const newData = this.deleteNullFields(groupedById[id][0]);
      const updatedItem = await this.prismaService.scheduleClasses.update({
        where: { id },
        data: { ...newData, updatedAt: new Date() },
      });
      updatedDataList.push(updatedItem);
    }

    return {
      list: updatedDataList,
      total: updatedDataList.length,
    };
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

    const scheduleClassesWithGroupData = [];

    for await (const scheduleClass of scheduleClasses) {
      const { groupIds } = scheduleClass;
      const groupsData = await this.prismaService.group.findMany({
        where: {
          id: {
            in: groupIds as string[],
          },
        },
        include: {
          faculty: true,
        },
      });

      scheduleClassesWithGroupData.push({
        ...scheduleClass,
        groups: groupsData.map(
          (g) =>
            `${g.courese}к. ${g.group}-${g.subGroup}.гр. ${g.faculty.shortName}`,
        ),
      });
    }

    return {
      list: formatScheduleClassesList(scheduleClassesWithGroupData),
    };
  }

  public async fillScheduleTimeTable() {
    const times = [
      {
        order: 1,
        startHours: 8,
        startMinute: 0,
        endHours: 9,
        endMinute: 20,
      },
      {
        order: 2,
        startHours: 9,
        startMinute: 35,
        endHours: 10,
        endMinute: 55,
      },
      {
        order: 3,
        startHours: 11,
        startMinute: 25,
        endHours: 12,
        endMinute: 45,
      },
      {
        order: 4,
        startHours: 13,
        startMinute: 0,
        endHours: 14,
        endMinute: 20,
      },
    ];

    const results = [];

    for await (const item of times) {
      const result = await this.prismaService.scheduleTime.create({
        data: item,
      });
      results.push(result);
    }
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

  private deleteNullFields(obj: any) {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] === null) {
        delete obj[key];
      }
    });

    return obj;
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
    });

    return semester;
  }
}
