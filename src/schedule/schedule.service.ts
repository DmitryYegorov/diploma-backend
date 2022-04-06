import { Injectable } from "@nestjs/common";
import { CreateClassDto } from "./dto/create-class.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ScheduleClasses } from "@prisma/client";

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  public async createScheduleClasses(
    scheduleClasses: CreateClassDto[],
    userId: string,
  ) {
    const createdList = [];

    for await (const scheduleClass of scheduleClasses) {
      const created = await this.prismaService.scheduleClasses.create({
        data: { ...scheduleClass, createdBy: userId },
      });
      createdList.push(created);
    }

    return {
      list: createdList,
      total: createdList.length,
    };
  }

  public async updateScheduleClass(id: string, newData: CreateClassDto) {
    const oldData = await this.prismaService.scheduleClasses.findUnique({
      where: { id },
    });

    Object.keys(newData).forEach((key: string) => {
      if (newData[key] === null) {
        delete newData[key];
      }
    });

    const updatedData: ScheduleClasses = { ...oldData, ...newData };
    return this.prismaService.scheduleClasses.update({
      where: { id },
      data: updatedData,
    });
  }
}
