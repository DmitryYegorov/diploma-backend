import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { OtherLoadService } from "./other-load.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("other-load")
export class OtherLoadController {
  constructor(private otherLoadService: OtherLoadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async saveOtherLoadRow(@Body() body, @Request() req) {
    const createdBy = req.user.id;
    return this.otherLoadService.saveOtherLoadRow({ ...body, createdBy });
  }

  @Get("/my")
  @UseGuards(JwtAuthGuard)
  public async getOtherLoad(@Request() req) {
    const createdBy = req.user.id;
    return this.otherLoadService.getOtherLoadByUserId(createdBy);
  }
}
