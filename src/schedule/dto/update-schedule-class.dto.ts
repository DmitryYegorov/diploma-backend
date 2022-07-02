import { ScheduleClassUpdateType } from "../../common/enum";

export class UpdateScheduleClassDto {
  readonly type: ScheduleClassUpdateType;
  readonly classDate: Date | string;
  readonly scheduleClassId: string;
  readonly rescheduleDate?: Date | string;
  readonly reason: string;
}
