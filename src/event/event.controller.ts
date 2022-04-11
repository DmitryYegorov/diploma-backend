import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Delete,
  Param,
  Put,
} from "@nestjs/common";
import { EventService } from "./event.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { CreateEventDto } from "./dto/create-event.dto";
import { FindEventsByPeriodDto } from "./dto/find-events-by-period.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

@Controller("event")
export class EventController {
  constructor(private eventService: EventService) {}

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  public async deleteEventById(@Param() params) {
    const { id } = params;

    return this.eventService.removeEvent(id);
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  public async getEventById(@Param() params) {
    const { id } = params;

    return this.eventService.getEventById(id);
  }

  @Put("/:id")
  @UseGuards(JwtAuthGuard)
  public async updateEventData(
    @Param() params,
    @Body() newData: UpdateEventDto,
  ) {
    const { id } = params;
    return this.eventService.updateEventData(id, newData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAllEventsByDayForCurrentUser(
    @Param() params,
    @Request() req,
  ) {
    const userId = req.user.id;

    const list = await this.eventService.getEventsWithScheduleClassesForUser(
      userId,
    );

    return {
      list,
      total: list.length,
    };
  }
}
