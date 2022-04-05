import { EventType } from "../../common/enum";
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  @IsEnum(EventType)
  readonly type: EventType;
  @IsNotEmpty()
  readonly startTime: Date;
  readonly endTime: Date;
  @IsBoolean()
  readonly isRecurring: boolean;
  @IsBoolean()
  readonly isAllDay: boolean;
  @IsString()
  readonly recurrencePattern: string;
  readonly recurrenceUntil: Date;
  readonly userId: string;
}
