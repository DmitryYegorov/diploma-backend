import { EventType } from "../../common/enum";
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateEventDto {
  readonly type: EventType;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly isRecurring: boolean;
  readonly isAllDay: boolean;
  readonly rRule: string;
  readonly title: string;
  readonly note: string;
}
