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

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // public async createEvent(
  //   @Request() req,
  //   @Body() body: CreateEventDto,
  // ): Promise<string> {
  //   const { user } = req;
  //
  //   return this.eventService.create(body, user.id);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUserEventsByPeriod(
    @Request() req,
    @Query() queryParams: FindEventsByPeriodDto,
  ) {
    const user = req.user;
    const { startDate, endDate } = queryParams;

    return this.eventService.getUserEventsByPeriod({
      startDate,
      endDate: endDate || new Date(),
      userId: user.id,
    });
  }

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

  @Get("/all/:date")
  @UseGuards(JwtAuthGuard)
  public async getAllEventsByDayForCurrentUser(
    @Param() params,
    @Request() req,
  ) {
    const userId = req.user.id;
    const { date } = params;

    return this.eventService.getEventsForDayByTeacherId({
      teacherId: userId,
      date,
    });
  }
}
