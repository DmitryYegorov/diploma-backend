import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { GetUsersDto } from "./dto/get-users.dto";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public async findOneById(id: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id } });
  }

  public async findAll(): Promise<GetUsersDto> {
    const list = await this.prismaService.user.findMany();

    return {
      list,
      total: list.length,
    };
  }

  public async activateUser(id: string, isActive: boolean) {
    return this.prismaService.user.update({
      where: { id },
      data: { isActive },
    });
  }
}
