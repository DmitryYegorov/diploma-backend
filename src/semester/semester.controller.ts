import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { SemesterService } from "./semester.service";
import { CreateAcademicYearDto } from "./dto/create-academic-year.dto";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { Role } from "../auth/guards/roles.decorator";
import { UserRole } from "../common/enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("semester")
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  public async getList() {
    return this.semesterService.getList();
  }

  @Get("/academic-year")
  @UseGuards(JwtAuthGuard)
  public async getAcademicYears() {
    return this.semesterService.getAcademicYears();
  }

  @Get("/current")
  public async getCurrentSemester() {
    return this.semesterService.getCurrentSemester();
  }

  @Get("/:id")
  public async getSemesterById(@Param() param) {
    const { id } = param;
    return this.semesterService.getSemesterById(id);
  }

  @Post("/academic-year")
  @UseGuards(JwtAuthGuard)
  @Role([UserRole.ADMIN, UserRole.MANAGER])
  @UseGuards(RolesGuard)
  public async createNewYear(@Body() body: CreateAcademicYearDto) {
    return this.semesterService.createNewAcademicYear(body);
  }
}
