import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { OtherLoadService } from "./other-load.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { UpdateOtherLoadDto } from "./dto/update-other-load.dto";

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
  public async getOtherLoad(@Request() req, @Query() query) {
    const createdBy = req.user.id;
    return this.otherLoadService.getOtherLoadByUserId(createdBy, query);
  }

  @Put("/:id")
  @UseGuards(JwtAuthGuard)
  public async updateLoadItem(
    @Param() param,
    @Body() body: UpdateOtherLoadDto,
  ) {
    const { id } = param;
    return this.otherLoadService.updateLoadItemById(id, body);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  public async deleteLoadItem(@Param() param) {
    const { id } = param;
    return this.otherLoadService.deleteOtherLoadItem(id);
  }
}
