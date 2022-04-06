import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { EmailController } from "./email.controller";

import * as path from "path";

const { MAIL_NAME, MAIL_PASS } = process.env;
@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        auth: {
          user: MAIL_NAME,
          pass: MAIL_PASS,
        },
      },
      defaults: {
        from: '"E-Department" <edepartment@belstu.by>',
      },
      template: {
        dir: path.join(__dirname, "templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: path.join(__dirname, "partials"),
        },
      },
    }),
  ],
  controllers: [EmailController],
})
export class EmailModule {}
