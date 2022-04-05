import { Injectable } from "@nestjs/common";
import { CreateClassDto } from "./dto/create-class.dto";
import { PrismaService } from "../prisma/prisma.service";

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
}
