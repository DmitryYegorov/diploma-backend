import { Controller, Get, UseGuards } from "@nestjs/common";
import { RoomService } from "./room.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("room")
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getAll() {
    return this.roomService.getAll();
  }
}
