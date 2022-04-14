import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { Event as EventType, ScheduleClasses } from "@prisma/client";
import { FindEventsByPeriodDto } from "./dto/find-events-by-period.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { GetEventsForDayDto } from "./dto/get-events-for-day.dto";
import { RRule, RRuleSet, rrulestr } from "rrule";
import { ScheduleService } from "../schedule/schedule.service";
import * as Enum from "../common/enum";
import { WeekDayMapToRrule } from "../common/maps";
import * as moment from "moment";

@Injectable()
export class EventService {
  constructor(
    private prismaService: PrismaService,
    private scheduleService: ScheduleService,
  ) {}

  public async create(eventData: CreateEventDto, userId): Promise<string> {
    const {
      type,
      startDate,
      endDate,
      rRule,
      isRecurring,
      isAllDay,
      title,
      note,
    } = eventData;

    const event = await this.prismaService.event.create({
      data: {
        type: type as Enum.EventType,
        startDate: startDate,
        endDate: endDate,
        rRule,
        createdBy: userId,
        userId,
        isRecurring,
        isAllDay,
        title,
        note,
        academicYearId: "3752bab6-5a67-4bde-8753-a43cb3343bff",
      },
    });

    return event.id;
  }

  public async removeEvent(eventId: string) {
    return this.prismaService.event.delete({
      where: { id: eventId },
    });
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

    if (newData.exDate) {
      const dates = newData.exDate.split(",");

      return this.prismaService.exEvent.create({
        data: {
          eventId: eventId,
          exceptionDate: dates[dates.length - 1],
        },
      });
    }

    const updatedEvent = { ...oldEventData, ...newData };

    return this.prismaService.event.update({
      where: { id: eventId },
      data: { ...updatedEvent },
    });
  }

  public async getEventsWithScheduleClassesForUser(teacherId: string) {
    const [events, scheduleClasses] = await Promise.all([
      this.getEventsByUserIdForCurrentAcademicYear(teacherId),
      this.scheduleService.getScheduleClassesListByTeacherIdForCurrentSemester(
        teacherId,
      ),
    ]);

    return [...scheduleClasses, ...events];
  }

  public async getEventsByUserIdForCurrentAcademicYear(userId: string) {
    const events = await this.prismaService.event.findMany({
      where: {
        userId,
      },
      include: {
        ExEvent: {
          select: {
            exceptionDate: true,
          },
        },
      },
    });

    const eventsWithExceptions = events.map((event) => {
      const exDate = event.ExEvent.map((ex) => ex.exceptionDate).join(",");

      return { ...event, exDate };
    });

    return eventsWithExceptions.map((event) => ({
      id: event.id,
      userId: event.userId,
      type: event.type,
      allDay: event.isAllDay,
      title: event.title,
      note: event.note,
      rRule: event.rRule,
      exDate: event?.exDate || "",
      startDate: event.startDate,
      endDate: event.endDate,
    }));
  }
}
