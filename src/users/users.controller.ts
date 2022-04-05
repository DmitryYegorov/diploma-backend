import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "@prisma/client";
import { GetUsersDto } from "./dto/get-users.dto";

@Controller("user")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/:id")
  public async getUserById(@Param() params): Promise<User> {
    return this.usersService.findOneById(params.id);
  }

  @Get()
  public async getAllUsers(): Promise<GetUsersDto> {
    return this.usersService.findAll();
  }
}
