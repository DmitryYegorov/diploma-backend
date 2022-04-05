import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { SendMailDto } from "./dto/send-mail.dto";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  public async sendEmail(sendMailDto: SendMailDto): Promise<void> {
    await this.mailerService.sendMail(sendMailDto);
  }
}
