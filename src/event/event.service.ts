import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event as EventType } from "@prisma/client";
import { FindEventsByPeriodDto } from "./dto/find-events-by-period.dto";

@Injectable()
export class EventService {
  constructor(private prismaService: PrismaService) {}

  public async create(eventData: CreateEventDto, userId): Promise<string> {
    const {
      type,
      startTime,
      endTime,
      recurrenceUntil,
      recurrencePattern,
      isRecurring,
      isAllDay,
    } = eventData;

    const event: EventType = await this.prismaService.event.create({
      data: {
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        recurrencePattern,
        recurrenceUntil: new Date(recurrenceUntil),
        createdBy: userId,
        userId: eventData.userId,
        isRecurring,
        isAllDay,
      },
    });

    return event.id;
  }

  public async getUserEventsByPeriod(period: FindEventsByPeriodDto) {
    const { startDate, endDate, userId } = period;

    const events = await this.prismaService.event.findMany({
      where: {
        userId,
        startTime: {
          gte: new Date(startDate),
        },
        endTime: {
          lte: new Date(endDate),
        },
      },
    });

    return {
      list: events,
      total: events.length,
    };
  }
}
