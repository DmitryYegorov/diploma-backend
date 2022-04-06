import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event as EventType } from "@prisma/client";
import { FindEventsByPeriodDto } from "./dto/find-events-by-period.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { GetEventsForDayDto } from "./dto/get-events-for-day.dto";

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

  public async removeEvent(eventId: string) {
    return this.prismaService.event.delete({ where: { id: eventId } });
  }

  public async getEventById(eventId: string) {
    return this.prismaService.event.findUnique({ where: { id: eventId } });
  }

  public async updateEventData(eventId: string, newData: UpdateEventDto) {
    const oldEventData = await this.prismaService.event.findUnique({
      where: { id: eventId },
    });

    Object.keys(newData).forEach((key: string) => {
      if (newData[key] === null) {
        delete newData[key];
      }
    });

    const updatedEvent = { ...oldEventData, ...newData };

    return this.prismaService.event.update({
      where: { id: eventId },
      data: updatedEvent,
    });
  }

  public async getEventsForDayByTeacherId(req: GetEventsForDayDto) {
    const { teacherId, date } = req;

    const [events, scheduleClasses] = await Promise.all([
      this.prismaService.event.findMany({
        where: {
          endTime: {
            gte: date,
          },
          startTime: {
            lte: date,
          },
          userId: teacherId,
        },
      }),
      this.prismaService.scheduleClasses.findMany({
        where: {
          weekDay: date.getDate(),
          teacherId,
        },
      }),
    ]);

    return { events, scheduleClasses };
  }
}
