export class SendMailDto {
  readonly to: string;
  readonly from: string;
  readonly subject: string;
  readonly text: string;
  readonly template: string = "CreatedAccount";
  readonly context: any;
}
