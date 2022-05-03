import {
  Body,
  Get,
  Controller,
  Post,
  Request,
  UseGuards,
  Param,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("report")
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createReport(@Request() req, @Body() body: CreateReportDto) {
    const userId = req.user.id;
    return this.reportService.createNewReport(body, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getReports(@Request() req) {
    const userId = req.user.id;
    const list = await this.reportService.getReportsByUserId(userId);
    return { list, total: list.length };
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  public async getReportById(@Param() param) {
    const { id } = param;
    return this.reportService.getReportById(id);
  }
}
