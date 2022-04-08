import { ClassType, Week, WeekDay } from "../../common/enum";
import { Max, Min } from "class-validator";

export class CreateClassDto {
  readonly subjectId: string;
  readonly type: ClassType;
  readonly week: Week;
  readonly roomId: string;
  @Min(0)
  @Max(6)
  readonly weekDay: WeekDay;
  readonly scheduleTimeId: string;
  readonly groupIds: any;
}
