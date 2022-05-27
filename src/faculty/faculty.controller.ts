import { Controller, Get, UseGuards } from "@nestjs/common";
import { FacultyService } from "./faculty.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("faculty")
export class FacultyController {
  constructor(private facultyService: FacultyService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async fetchFaculties() {
    return this.facultyService.fetchFacultiesList();
  }
}
