import { Controller, Get, UseGuards } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

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
