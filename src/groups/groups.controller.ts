import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { Role } from "../auth/guards/roles.decorator";
import { UserRole } from "../common/enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { GroupsOptionsDto } from "./dto/groups-options.dto";
import { AddGroupsDto } from "./dto/add-groups.dto";

@Controller("group")
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get("/with-faculties")
  @UseGuards(JwtAuthGuard)
  public async getGroupsWithFaculties() {
    const list = await this.groupsService.getListGroupsWithFaculties();

    return { list, total: list.length };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getGroupsByOptions(@Query() options: GroupsOptionsDto) {
    return this.groupsService.getGroupsByOptions(options);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Role([UserRole.ADMIN, UserRole.MANAGER])
  @UseGuards(RolesGuard)
  public async addGroups(@Body() body: AddGroupsDto) {
    return this.groupsService.addGroups(body);
  }
}
