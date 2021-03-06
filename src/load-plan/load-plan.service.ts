import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AddLoadPlanItemDto } from "./dto/add-load-plan-item.dto";
import { LoadPlanedOptionsDto } from "./dto/load-planed-options.dto";
import { mapDbDataToLoadPlanTable, unique } from "./mapper";
import * as _ from "lodash";
import { EventTypeMap } from "../common/maps";
import { LoadType } from "@prisma/client";

@Injectable()
export class LoadPlanService {
  constructor(private prismaService: PrismaService) {}

  public async getActiveTeachers() {
    return this.prismaService.user.findMany({
      where: {
        isActive: true,
        activationCode: null,
      },
    });
  }

  public async addLoadItemToPlan(
    loadItemData: AddLoadPlanItemDto,
    groups: Array<string>,
  ) {
    const existedItems = await this.prismaService.loadPlan.findMany({
      where: {
        subjectId: loadItemData.subjectId,
        semesterId: loadItemData.semesterId,
        type: loadItemData.type,
      },
    });

    if (existedItems.length > 0) {
      throw new HttpException(
        { message: "Данный вид нагрузки существует" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const loadPlan = await this.prismaService.loadPlan.create({
      data: loadItemData,
    });

    const addedGroups = await this.prismaService.loadPlanSubGroups.createMany({
      data: groups.map((g) => ({ groupId: g, loadPlanId: loadPlan.id })),
    });

    return { loadPlan, addedGroups };
  }

  public async getLoadPlanedByOptions(options: LoadPlanedOptionsDto) {
    const { semesterId, teacherId } = options;

    const load = await this.prismaService.loadPlan.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        teacherId,
        semesterId,
      },
      include: {
        subject: true,
        LoadPlanSubGroups: {
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
        _count: {
          select: {
            LoadPlanSubGroups: true,
          },
        },
      },
    });

    const mapped = load.map((l) => mapDbDataToLoadPlanTable(l));

    const withSubjects = mapped.filter((m) => !!m.subjectId);
    const withOutSubjects = mapped.filter((m) => !m.subjectId);

    const groupedBySubject = _.groupBy(withSubjects, "subjectName");
    const groupedByType = _.groupBy(withOutSubjects, "type");

    const result = [];

    Object.keys(groupedBySubject).forEach((key) => {
      const subjectItems = groupedBySubject[key];

      const groupedByTypes = _.groupBy(subjectItems, "type");

      const entries = Object.keys(groupedByTypes).map((type) => [
        [type],
        groupedByTypes[type][0].duration,
      ]);

      result.push({
        subjectName: key,
        subGroupsCount: subjectItems.reduce(
          (acc, item) => acc + item.subGroupsCount,
          0,
        ),
        specialityName: subjectItems.map((sp) => sp.specialityName).flat(),
        facultyName: subjectItems.map((sub) => sub.facultyName).flat(),
        ...Object.fromEntries(entries),
      });
    });

    const entries = Object.keys(groupedByType).map((key) => [
      key,
      groupedByType[key][0].duration,
    ]);

    const loadByTypes = Object.fromEntries(entries);

    Object.keys(loadByTypes).forEach((key) => {
      result.push({
        subjectName: EventTypeMap[key],
        [key]: loadByTypes[key],
        subGroupsCount: groupedByType[key][0].subGroupsCount,
        groups: groupedByType[key][0].groups,
        specialityName: groupedByType[key][0].specialityName,
        facultyName: groupedByType[key][0].facultyName,
      });
    });

    return result.map((item) => ({
      ...item,
      specialityName: unique(item.specialityName.flat()).join(", "),
      facultyName: unique(item.facultyName.flat()).join(", "),
      total: Object.values(LoadType)
        .filter((type) => !!item[type])
        .reduce((acc, type) => acc + item[type], 0),
    }));
  }

  public async getLoadPlanListByOptions(options: LoadPlanedOptionsDto) {
    const { teacherId, semesterId } = options;

    const loadPlan = await this.prismaService.loadPlan.findMany({
      orderBy: { subjectId: "asc" },
      include: {
        subject: true,
        LoadPlanSubGroups: {
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
      where: { teacherId, semesterId },
    });

    return loadPlan.map((load) => mapDbDataToLoadPlanTable(load));
  }

  public async removeLoadPlanItemById(id: string) {
    return this.prismaService.loadPlan.delete({ where: { id } });
  }

  public async updateLoadPlanItemData(
    id: string,
    newData: any,
    groups: Array<string>,
  ) {
    const updateLoadItem = await this.prismaService.loadPlan.update({
      where: { id },
      data: newData,
    });

    const [oldGroups, newGroups] = await Promise.all([
      this.prismaService.loadPlanSubGroups.deleteMany({
        where: { loadPlanId: id },
      }),
      this.prismaService.loadPlanSubGroups.createMany({
        data: groups.map((g) => ({ loadPlanId: id, groupId: g })),
      }),
    ]);

    return { updateLoadItem, oldGroups, newGroups };
  }
}
