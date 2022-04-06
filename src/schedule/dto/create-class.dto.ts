import { ClassType, Week, WeekDay } from "../../common/enum";
import { Max, Min } from "class-validator";

export class CreateClassDto {
  readonly teacherId: string;
  readonly subjectId: string;
  readonly type: ClassType;
  readonly week: Week;
  readonly semesterId: string;
  readonly duration: number;
  readonly roomId: string;
  @Min(0)
  @Max(6)
  readonly weekDay: number;
  readonly scheduleTimeId: string;
  readonly groupIds: any;
  readonly createdBy: string;
}
