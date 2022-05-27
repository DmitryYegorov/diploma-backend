import { ReportType } from "@prisma/client";

export class CreateReportDto {
  readonly name: string;
  readonly startDate: Date | string;
  readonly endDate: Date | string;
  readonly type: ReportType;
}
