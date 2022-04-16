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
    const reqData = {
      ...body,
      createdBy: userId,
      teacherId: userId,
    };

    return this.scheduleService.createScheduleClasses(reqData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getScheduleClassesForCurrentSemesterByTeacher(
    @Param() params,
    @Request() req,
  ) {
    const { teacher } = params;
    const userId = req.user.id;
    return this.scheduleService.getScheduleClassesByTeacherForCurrentSem(
      teacher || userId,
    );
  }

  @Get("/department")
  //@UseGuards(JwtAuthGuard)
  public async getScheduleClassOfDepartmentForCurrentSemester() {
    return this.scheduleService.getScheduleClassOfDepartmentForCurrentSemester();
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
