import { TotalReportType } from "../type";

export class CreateTotalReportDto {
  readonly name: string;
  readonly createdBy: string;
  readonly type: TotalReportType;
  readonly semesterId?: string;
  readonly academicYearId?: string;

  readonly reportIds: Array<string>;
}
