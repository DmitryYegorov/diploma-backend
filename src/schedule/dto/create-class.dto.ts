import { Week, WeekDay } from "../../common/enum";

export class CreateClassDto {
  readonly subjectId: string;
  readonly weekDay: WeekDay;
  readonly week: Week;
  readonly order: number;
}
