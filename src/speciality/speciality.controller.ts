import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { Role } from "../auth/guards/roles.decorator";
import { UserRole } from "../common/enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateSpecialityDto } from "./dto/create-speciality.dto";
import { SpecialityService } from "./speciality.service";

@Controller("speciality")
export class SpecialityController {
  constructor(private specialityService: SpecialityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Role([UserRole.ADMIN, UserRole.MANAGER])
  @UseGuards(RolesGuard)
  public async createSpeciality(@Body() body: CreateSpecialityDto) {
    return this.specialityService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll() {
    return this.specialityService.getAll();
  }
}
