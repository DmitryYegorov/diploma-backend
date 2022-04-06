import { Controller, Post } from "@nestjs/common";
import { EmailService } from "./email.service";

const test = {
  to: "wladiik@gmail.com",
  subject: "test",
  text: "test",
  from: "test@mail.com",
  template: "CreatedAccount",
  context: {
    name: "Владислав",
  },
};

@Controller("email")
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  async testEmailSending() {
    await this.emailService.sendEmail(test);
  }
}
