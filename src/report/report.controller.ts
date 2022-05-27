import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { Role } from "../auth/guards/roles.decorator";
import { UserRole } from "../common/enum";
import { RolesGuard } from "../auth/guards/roles.guard";

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

  @Get("sent")
  @UseGuards(JwtAuthGuard)
  @Role([UserRole.ADMIN, UserRole.MANAGER])
  @UseGuards(RolesGuard)
  public async getSentReportList() {
    return this.reportService.getSentReports();
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  public async getReportById(@Param() param) {
    const { id } = param;
    return this.reportService.getReportById(id);
  }

  // load data to new empty report
  @Get("/:reportId/study")
  @UseGuards(JwtAuthGuard)
  public async loadStudyClassesToReport(@Request() req, @Param() param) {
    const { reportId } = param;
    return this.reportService.loadScheduleClassesToReport(reportId);
  }

  @Post("/:reportId/calculate")
  @UseGuards(JwtAuthGuard)
  public async calculateReportData(@Request() req, @Param() param) {
    const { reportId } = param;
    const userId = req.user.id;

    return this.reportService.calculateLoadByReportId(reportId);
  }

  @Get("/:reportId/calculate")
  @UseGuards(JwtAuthGuard)
  public async getCalculatedReportData(@Request() req, @Param() param) {
    const { reportId } = param;

    return this.reportService.getCalculatedReportByReportId(reportId);
  }

  @Put("/:reportId")
  @UseGuards(JwtAuthGuard)
  public async saveChangesCalculating(@Body() body, @Param() param) {
    const { reportId } = param;

    return this.reportService.saveCalculatedChangesByReportId(reportId, body);
  }

  @Put("/:reportId/send")
  @UseGuards(JwtAuthGuard)
  public async sendReport(@Param() param) {
    const { reportId } = param;

    return this.reportService.sendReport(reportId);
  }

  @Put("/:reportId/approve")
  @UseGuards(JwtAuthGuard)
  @Role([UserRole.ADMIN, UserRole.MANAGER])
  @UseGuards(RolesGuard)
  public async approveReport(@Param() param) {
    const { reportId } = param;

    return this.reportService.approveReport(reportId);
  }

  @Put("/:reportId/cancel")
  @UseGuards(JwtAuthGuard)
  @Role([UserRole.ADMIN, UserRole.MANAGER])
  @UseGuards(RolesGuard)
  public async cancelReport(@Body() body, @Param() param) {
    const { adminNote } = body;
    const { reportId } = param;
    return this.reportService.cancelReport(reportId, adminNote);
  }
}
