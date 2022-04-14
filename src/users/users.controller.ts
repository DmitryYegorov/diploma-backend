import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "@prisma/client";
import { GetUsersDto } from "./dto/get-users.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/guards/roles.decorator";
import { UserRole } from "../common/enum";
import { ActivateUserDto } from "./dto/activate-user.dto";

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

  @Patch()
  @Role([UserRole.ADMIN])
  @UseGuards(RolesGuard)
  public async activateUser(@Query() queryParams: ActivateUserDto) {
    const { userId, isActive } = queryParams;

    return this.usersService.activateUser(userId, isActive);
  }
}
