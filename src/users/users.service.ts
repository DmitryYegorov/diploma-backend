import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public async findOneById(id: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id } });
  }
}
