import { EventType } from "../../common/enum";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  readonly type: EventType;
  @IsNotEmpty()
  readonly startTime: Date;
  readonly endTime: Date;
  @IsBoolean()
  readonly isRecurring: boolean = false;
  @IsBoolean()
  readonly isAllDay: boolean = false;
  @IsString()
  readonly recurrencePatter: string;
  readonly recurrenceUntil: Date;
  readonly createdBy: string;
  readonly userId: string;
}
