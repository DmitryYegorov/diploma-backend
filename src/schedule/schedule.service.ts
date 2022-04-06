import { Injectable } from "@nestjs/common";
import { CreateClassDto } from "./dto/create-class.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ScheduleClasses } from "@prisma/client";
import { UpdateClassDto } from "./dto/update-class.dto";
import * as _ from "lodash";
import moment from "moment";

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  public async createScheduleClasses(scheduleClasses: CreateClassDto[]) {
    const createdList = [];

    for await (const scheduleClass of scheduleClasses) {
      const created = await this.prismaService.scheduleClasses.create({
        data: { ...scheduleClass },
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
      },
    });
  }

  private deleteNullFields(obj: any) {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] === null) {
        delete obj[key];
      }
    });

    return obj;
  }

  private async getCurrentSemester() {
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
