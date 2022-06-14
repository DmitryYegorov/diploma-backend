import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  public async createNotification(notification: CreateNotificationDto) {
    return this.prismaService.notification.create({
      data: { ...notification, subject: notification.subject || "Оповещение" },
    });
  }

  public async readNotification(notificationId: string) {
    return this.prismaService.notification.update({
      data: { readed: true },
      where: { id: notificationId },
    });
  }

  public getNotificationByUser(userId: string, options: any) {
    let where = { userId };
    if (options.read === false) {
      where = { ...where, readed: false };
    }
    return this.prismaService.notification.findMany({
      where,
    });
  }
}
