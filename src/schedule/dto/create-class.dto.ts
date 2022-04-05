import { ClassType, Week, WeekDay } from "../../common/enum";
import { Group, GroupList } from "../types";

export class CreateClassDto {
  readonly teacherId: string;
  readonly subjectId: string;
  readonly type: ClassType;
  readonly week: Week;
  readonly semesterId: string;
  readonly duration: number;
  readonly roomId: string;
  readonly weekDay: number;
  readonly scheduleTimeId: string;
  readonly groupIds: any;
  readonly createdBy: string;
}
