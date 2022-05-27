import { ClassType, Week, WeekDay } from "../../common/enum";
import { IsEnum } from "class-validator";

export class GetScheduleClassesOptionsDto {
  readonly id?: string;
  readonly week?: Week;
  readonly subjectId?: string;
  readonly classType?: ClassType;
  readonly semesterId?: string;
  readonly teacherId?: string;
  readonly weekDay?: number;
  readonly scheduleTimeId?: string;
}
