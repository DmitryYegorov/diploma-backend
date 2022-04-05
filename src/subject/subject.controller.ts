import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { SubjectService } from "./subject.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("subject")
export class SubjectController {
  constructor(private subjectService: SubjectService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createSubject(@Request() req) {
    const {
      body,
      user: { id },
    } = req;
    return this.subjectService.createSubject(body, id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAllSubjects() {
    return this.subjectService.getAllSubjects();
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  public async getSubjectById(@Param() param) {
    const { id } = param;
    return this.subjectService.getSubjectById(id);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  public async removeSubject(@Request() req) {
    const { id } = req.params;
    const userId = req.user.id;
    return this.subjectService.removeSubject(id, userId);
  }
}
