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
  Query,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { CreateClassDto } from "./dto/create-class.dto";
import { UpdateScheduleClassDto } from "./dto/update-schedule-class.dto";

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

  @Get("/department/semester/:semesterId")
  @UseGuards(JwtAuthGuard)
  public async getScheduleClassOfDepartment(@Param() param) {
    return this.scheduleService.getScheduleClassOfDepartment(param.semesterId);
  }

  @Get("/time")
  public async getListOfTimesClasses() {
    return this.scheduleService.getListOfTimesClasses();
  }

  @Get("/semester/current")
  public async getCurrentSemester() {
    return this.scheduleService.getCurrentSemester();
  }

  @Get("/calendar/my")
  @UseGuards(JwtAuthGuard)
  public async getScheduleClassesByTeacherToCalendar(@Request() req) {
    const teacherId = req.user.id;

    const list = await this.scheduleService.getScheduleClassesListByTeacherId(
      teacherId,
    );

    return { list, total: list.length };
  }

  @Post("/swap-teacher")
  @UseGuards(JwtAuthGuard)
  public async swapTeacherOnScheduleClass(@Request() req, @Body() body) {
    const initiator = req.user.id;
    const { scheduleClassId, teacherId, reason, classDate } = body;

    return this.scheduleService.swapTeacherOnScheduleClass(
      scheduleClassId,
      classDate,
      teacherId,
      reason,
      initiator,
    );
  }

  @Post("/update")
  @UseGuards(JwtAuthGuard)
  public async updateScheduleClass(
    @Request() req,
    @Body() body: UpdateScheduleClassDto,
  ) {
    const createdBy: string = req.user.id;

    return this.scheduleService.updateScheduleClass({ ...body, createdBy });
  }

  @Get("/updates-list")
  @UseGuards(JwtAuthGuard)
  public async getUpdatesList(@Request() req, @Query() query) {
    const teacherId = req.user.id;
    const { startDate, endDate } = query;
    return this.scheduleService.getScheduleUpdatesByPeriod({
      teacherId,
      startDate,
      endDate,
    });
  }
}
