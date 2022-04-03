import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { user } from "@prisma/client";

@Controller("user")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/:id")
  public async getUserById(@Param() params): Promise<user> {
    return this.usersService.findOneById(params.id);
  }
}
