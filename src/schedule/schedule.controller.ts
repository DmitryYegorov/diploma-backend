import {
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Delete,
} from "@nestjs/common";
import { CreateSubjectDto } from "../subject/dto/create-subject";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { ScheduleService } from "./schedule.service";
import { SubjectService } from "../subject/subject.service";

@Controller("schedule")
export class ScheduleController {}
