import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GroupsOptionsDto } from "./dto/groups-options.dto";
import { AddGroupsDto } from "./dto/add-groups.dto";

@Injectable()
export class GroupsService {
  constructor(private prismaService: PrismaService) {}

  public async getListGroupsWithFaculties() {
    const list = await this.prismaService.group.findMany({
      select: {
        id: true,
        group: true,
        course: true,
        speciality: {
          include: { faculty: true },
        },
        subGroup: true,
      },
    });

    return list.map((item) => ({
      id: item.id,
      group: item.group,
      subGroup: item.subGroup,
      course: item.course,
      facultyId: item.speciality.faculty.id,
      facultyName: item.speciality.faculty.shortName,
      label: `${item.course}к. ${item.group}-${item.subGroup} ${item.speciality.faculty.shortName}`,
    }));
  }

  public async getGroupsByOptions(options: GroupsOptionsDto) {
    let where = {};

    if (options.group) {
      where = { ...where, group: +options.group };
    }

    if (options.course) {
      where = { ...where, course: +options.course };
    }

    if (options.specialityId) {
      where = { ...where, specialityId: options.specialityId };
    }

    const list = await this.prismaService.group.findMany({
      where: {
        semesterId: options.semesterId,
        ...where,
      },
      include: {
        speciality: {
          include: {
            faculty: true,
          },
        },
      },
    });

    return list.map((g) => ({
      group: g.group,
      subGroup: g.subGroup,
      facultyName: g.speciality.faculty.shortName,
      specialityName: g.speciality.shortName,
      course: g.course,
    }));
  }

  public async addGroups(body: AddGroupsDto) {
    const groups: Array<any> = [];

    for (let i = 1; i <= body.subGroupsCount; i++) {
      groups.push({
        group: body.group,
        specialityId: body.specialityId,
        course: body.course,
        subGroup: i,
        semesterId: body.semesterId,
      });
    }

    return this.prismaService.group.createMany({ data: groups });
  }

  public async getSpecialitiesWithCourse(semesterId: string) {
    const data = await this.prismaService.group.findMany({
      distinct: ["course", "specialityId", "semesterId"],
      select: {
        course: true,
        speciality: {
          select: {
            id: true,
            shortName: true,
          },
        },
      },
      where: { semesterId },
    });

    const res = [];

    for await (const item of data) {
      const subGroups = await this.prismaService.group.findMany({
        select: { id: true, group: true, subGroup: true },
        where: {
          course: item.course,
          semesterId,
          specialityId: item.speciality.id,
        },
      });

      res.push({ ...item, subGroups });
    }

    return res
      .sort((a, b) => b.course - a.course)
      .map((item) => ({
        course: item.course,
        specialityName: item.speciality.shortName,
        specialityId: item.speciality.id,
        subGroups: item.subGroups.map((sg) => ({
          id: sg.id,
          group: sg.group,
          subGroup: sg.subGroup,
        })),
      }));
  }
}
