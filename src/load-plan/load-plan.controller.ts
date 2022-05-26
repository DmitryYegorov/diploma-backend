import { Controller, Get, UseGuards } from "@nestjs/common";
import { LoadPlanService } from "./load-plan.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("load-plan")
export class LoadPlanController {
  constructor(private loadPlanService: LoadPlanService) {}

  @Get("teacher/list")
  @UseGuards(JwtAuthGuard)
  public async getActiveTeachers() {
    return this.loadPlanService.getActiveTeachers();
  }
}
