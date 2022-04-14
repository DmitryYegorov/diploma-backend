import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GroupsService {
  constructor(private prismaService: PrismaService) {}

  public async getListGroupsWithFaculties() {
    const list = await this.prismaService.group.findMany({
      select: {
        id: true,
        group: true,
        courese: true,
        faculty: true,
        subGroup: true,
      },
    });

    return list.map((item) => ({
      id: item.id,
      group: item.group,
      subGroup: item.subGroup,
      course: item.courese,
      facultyId: item.faculty.id,
      facultyName: item.faculty.shortName,
      label: `${item.courese}к. ${item.group}-${item.subGroup}.гр. ${item.faculty.shortName}`,
    }));
  }
}
