import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOtherLoadDto } from "./dto/create-other-load.dto";
import { mapDbDataToLoadItem } from "./mapper";
import { UpdateOtherLoadDto } from "./dto/update-other-load.dto";
import * as moment from "moment";

@Injectable()
export class OtherLoadService {
  constructor(private prismaService: PrismaService) {}

  public async saveOtherLoadRow(row: CreateOtherLoadDto) {
    const {
      semesterId,
      groups,
      duration,
      date,
      subjectId,
      studentsCount,
      createdBy,
      type,
    } = row;

    const otherLoadCreated = await this.prismaService.otherLoad.create({
      data: {
        semesterId,
        duration,
        date,
        subjectId,
        studentsCount,
        type,
        createdBy,
      },
    });

    let groupsCreated = null;

    if (groups?.length) {
      const groupsData = groups.map((g) => ({
        groupId: g,
        otherLoadId: otherLoadCreated.id,
      }));

      groupsCreated = await this.prismaService.otherLoadGroup.createMany({
        data: groupsData,
      });
    }

    return { otherLoadCreated, groupsCreated };
  }

  public async getOtherLoadByUserId(userId: string, options) {
    let where: any = { createdBy: userId };
    if (options.semesterId) {
      where = { ...where, semesterId: options.semesterId };
    }
    if (options.startDate) {
      where = {
        ...where,
        date: { gte: moment(options.startDate).toDate() },
      };
    }
    if (options.endDate) {
      where = { ...where, date: { lte: moment(options.endDate).toDate() } };
    }
    if (options.type) {
      where = { ...where, type: options.type };
    }

    const load = await this.prismaService.otherLoad.findMany({
      where: { ...where },
      include: {
        subject: true,
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
      },
    });

    const list = load.map((l) => mapDbDataToLoadItem(l));
    return list.map((item) => ({
      ...item,
      facultyName: item.facultyName.join(", "),
      groupIds: item.subGroupsLabels?.map((g) => g.id),
    }));
  }

  public async updateLoadItemById(id: string, newData: UpdateOtherLoadDto) {
    const groups = newData.groups;

    const updatedItem = await this.prismaService.otherLoad.update({
      where: { id },
      data: {
        semesterId: newData.semesterId,
        date: newData.date,
        duration: newData.duration,
        studentsCount: newData.studentsCount,
        subjectId: newData.subjectId,
      },
    });

    let newGroups = null;
    if (groups?.length) {
      [, newGroups] = await Promise.all([
        this.prismaService.otherLoadGroup.deleteMany({
          where: { otherLoadId: id },
        }),
        this.prismaService.otherLoadGroup.createMany({
          data: groups.map((g) => ({ groupId: g, otherLoadId: id })),
        }),
      ]);
    }

    return { updatedItem, newGroups };
  }

  public async deleteOtherLoadItem(id: string) {
    return this.prismaService.otherLoad.delete({ where: { id } });
  }
}
