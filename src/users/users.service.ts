import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import { GetUsersDto } from "./dto/get-users.dto";
import { UserRole } from "../common/enum";

const { SECRET } = process.env;

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public async findOneById(id: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id } });
  }

  public async findAll(): Promise<GetUsersDto> {
    const list = await this.prismaService.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      list: list.map((u) => ({
        ...u,
        name: `${u.firstName} ${u.middleName} ${u.lastName}`,
      })),
      total: list.length,
    };
  }

  public async activateUser(id: string, isActive: boolean) {
    return this.prismaService.user.update({
      where: { id },
      data: { isActive },
    });
  }

  public async activateUserEmail(activationCode: string) {
    const userData = await this.prismaService.user.findFirst({
      where: { activationCode },
    });

    if (!userData) {
      throw new HttpException(
        { message: "Запрашиваемый ресурс не найден" },
        HttpStatus.NOT_FOUND,
      );
    }

    const res = await this.prismaService.user.update({
      where: { id: userData.id },
      data: { activationCode: null },
    });

    return res;
  }

  public async changeUserRole(userId: string, newRole: UserRole) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }
}
