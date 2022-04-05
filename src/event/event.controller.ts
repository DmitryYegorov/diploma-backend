import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
} from "@nestjs/common";
import { EventService } from "./event.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { CreateEventDto } from "./dto/create-event.dto";
import { FindEventsByPeriodDto } from "./dto/find-events-by-period.dto";

@Controller("event")
export class EventController {
  constructor(private eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createEvent(
    @Request() req,
    @Body() body: CreateEventDto,
  ): Promise<string> {
    const { user } = req;

    return this.eventService.create(body, user.id);
  }

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
      endDate,
      userId: user.id,
    });
  }
}
