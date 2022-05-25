import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";
import { Role } from "../auth/guards/roles.decorator";
import { UserRole } from "../common/enum";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("groups")
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getGroupsWithFaculties() {
    const list = await this.groupsService.getListGroupsWithFaculties();

    return { list, total: list.length };
  }
}
