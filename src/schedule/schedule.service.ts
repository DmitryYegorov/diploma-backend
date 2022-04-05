import { Injectable } from "@nestjs/common";
import { CreateClassDto } from "./dto/create-class.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ScheduleService {
  constructor(private prismaService: PrismaService) {}

  public async createScheduleClass(
    scheduleClass: CreateClassDto,
    userId: string,
  ) {
    const {
      teacherId,
      scheduleTimeId,
      weekDay,
      week,
      groupIds,
      roomId,
      semesterId,
      type,
      subjectId,
      duration,
    } = scheduleClass;

    return this.prismaService.scheduleClasses.create({
      data: {
        teacherId,
        scheduleTimeId,
        week,
        weekDay,
        groupIds,
        roomId,
        semesterId,
        type,
        subjectId,
        duration,
        createdBy: userId,
      },
    });
  }
}
