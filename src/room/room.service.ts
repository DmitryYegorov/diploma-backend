import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  public async getAll() {
    const rooms = await this.prismaService.room.findMany();

    const response = rooms.map((roomItem) => ({
      room: `${roomItem.room}-${roomItem.campus}`,
      id: roomItem.id,
    }));

    return response;
  }
}
