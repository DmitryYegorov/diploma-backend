import { ClassType, Week } from "../../common/enum";
import { Max, Min } from "class-validator";

export class UpdateClassDto {
  readonly id: string;
  readonly teacherId: string | null;
  readonly subjectId: string | null;
  readonly type: ClassType | null;
  readonly week: Week | null;
  readonly semesterId: string | null;
  readonly duration: number | null;
  readonly roomId: string | null;
  @Min(0)
  @Max(6)
  readonly weekDay: number | null;
  readonly scheduleTimeId: string | null;
  readonly groupIds: any | null;
  readonly updatedBy: string | null;
}
