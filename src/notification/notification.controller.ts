import { Controller, Get, UseGuards, Request, Query } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { JwtAuthGuard } from "../auth/guards/auth.guard";

@Controller("notification")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public getUserNotifications(@Request() req, @Query() query) {
    const userId = req.user.id;
    return this.notificationService.getNotificationByUser(userId, query);
  }
}
