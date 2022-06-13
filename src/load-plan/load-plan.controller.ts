import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { LoadPlanService } from "./load-plan.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { LoadPlanedOptionsDto } from "./dto/load-planed-options.dto";
import { Role } from "../auth/guards/roles.decorator";
import { UserRole } from "../common/enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("load-plan")
export class LoadPlanController {
  constructor(private loadPlanService: LoadPlanService) {}

  @Get("teacher/list")
  @UseGuards(JwtAuthGuard)
  public async getActiveTeachers() {
    return this.loadPlanService.getActiveTeachers();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async addLoadPlanItem(@Body() body) {
    return this.loadPlanService.addLoadItemToPlan(body);
  }

  @Get("mapped")
  @UseGuards(JwtAuthGuard)
  public async getLoadPlaned(@Query() query: LoadPlanedOptionsDto) {
    const { semesterId, teacherId } = query;
    return this.loadPlanService.getLoadPlanedByOptions({
      semesterId,
      teacherId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getLoadPlanListByOptions(@Query() query: LoadPlanedOptionsDto) {
    return this.loadPlanService.getLoadPlanListByOptions(query);
  }

  @Delete("/:id")
  @Role([UserRole.MANAGER, UserRole.ADMIN])
  @UseGuards(JwtAuthGuard)
  public async removeLoadPlanItem(@Param() param) {
    const { id } = param;

    return this.loadPlanService.removeLoadPlanItemById(id);
  }

  @Put("/:id")
  @Role([UserRole.ADMIN, UserRole.MANAGER])
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  public async updateLoadPlanItem(@Param() param, @Body() body) {
    const { id } = param;
    const { groups, newData } = body;

    return this.loadPlanService.updateLoadPlanItemData(id, newData);
  }
}
