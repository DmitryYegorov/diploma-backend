import { Controller, Get, Param } from "@nestjs/common";
import { SemesterService } from "./semester.service";

@Controller("semester")
export class SemesterController {
  constructor(private semesterService: SemesterService) {}

  @Get()
  public async getList() {
    return this.semesterService.getList();
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
}
