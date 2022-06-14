import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  public async getSentReportList(@Query() query) {
    return this.reportService.getSentReports(query);
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  public async getReportById(@Param() param) {
    const { id } = param;
    return this.reportService.getReportById(id);
  }

  @Get("/:reportId/load")
  @UseGuards(JwtAuthGuard)
  public async loadExistingDataToReport(@Request() req, @Param() param) {
    const { reportId } = param;
    return this.reportService.getExistingLoadDataByReport(reportId);
  }

  // load actual data to new empty report
  @Get("/:reportId/new-load")
  @UseGuards(JwtAuthGuard)
  public async loadDataToReport(@Request() req, @Param() param) {
    const { reportId } = param;
    return this.reportService.loadDataToReport(reportId);
  }

  @Get("/month/:reportId/mapped")
  @UseGuards(JwtAuthGuard)
  public async getMappedReportDataOfMonth(@Request() req, @Param() param) {
    const { reportId } = param;

    return this.reportService.getMappedLoadDataByMonthReport(reportId);
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
  public async cancelReport(@Body() body, @Param() param, @Request() req) {
    const { adminNote } = body;
    const { reportId } = param;
    const userId = req.user.id;
    return this.reportService.cancelReport(reportId, adminNote, userId);
  }

  @Delete("/load/:id")
  @UseGuards(JwtAuthGuard)
  public async removeLoadItemFromReport(@Param() param) {
    const { id } = param;
    return this.reportService.removeLoadItemFromReport(id);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  public async deleteReport(@Param() param) {
    const { id } = param;
    return this.reportService.removeReportById(id);
  }

  @Post("/total")
  @Role([UserRole.MANAGER, UserRole.ADMIN])
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  public async createTotalReport(@Request() req, @Body() body) {
    const createdBy = req.user.id;
    return this.reportService.createTotalReport({ createdBy, ...body });
  }

  @Get("/total/list")
  @Role([UserRole.MANAGER, UserRole.ADMIN])
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  public async getTotalReportsList() {
    return this.reportService.getTotalReports();
  }

  @Get("/total/:id")
  @Role([UserRole.MANAGER, UserRole.ADMIN])
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  public async getTotalReport(@Param() param) {
    const { id } = param;
    return this.reportService.getTotalReportById(id);
  }

  @Get("/:reportId/note")
  @UseGuards(JwtAuthGuard)
  public async getReportNotes(@Param() param) {
    const { reportId } = param;
    return this.reportService.getReportNotes(reportId);
  }

  @Put("/note/:noteId")
  @UseGuards(JwtAuthGuard)
  public async updateReportNote(@Body() body, @Param() param) {
    const { note } = body;
    const { noteId } = param;

    return this.reportService.updateReportNote(noteId, note);
  }

  @Delete("/note/:noteId")
  @UseGuards(JwtAuthGuard)
  public async removeReportNote(@Param() param) {
    const { noteId } = param;
    return this.reportService.removeReportNote(noteId);
  }
}
