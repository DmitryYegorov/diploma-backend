import {
  Request,
  Controller,
  Post,
  UseGuards,
  Put,
  Get,
  Param,
  Delete,
  Body,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateClassDto } from "./dto/update-class.dto";

@Controller("schedule")
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createScheduleClasses(
    @Request() req,
    @Body() body: CreateClassDto[],
  ) {
    const userId = req.user.id;
    const reqData = body.map((item) => ({ ...item, createdBy: userId }));

    return this.scheduleService.createScheduleClasses(reqData);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  public async updateManyScheduleClasses(
    @Request() req,
    @Body() body: UpdateClassDto[],
  ) {
    const userId = req.user.id;
    const reqData: UpdateClassDto[] = body.map((item) => ({
      ...item,
      updatedBy: userId,
    }));

    return this.scheduleService.updateManyScheduleClass(reqData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getScheduleClassesForCurrentSemesterByTeacher(@Param() params) {
    const { teacher } = params;
    return this.scheduleService.getScheduleClassesByTeacherForCurrentSem(
      teacher,
    );
  }

  @Get("/time")
  public async getListOfTimesClasses() {
    return this.scheduleService.getListOfTimesClasses();
  }

  @Get("/semester/current")
  public async getCurrentSemester() {
    return this.scheduleService.getCurrentSemester();
  }
}
