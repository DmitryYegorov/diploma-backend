import { EventType } from "../../common/enum";

export class UpdateEventDto {
  readonly type: EventType | null;
  readonly startTime: null;
  readonly endTime: Date | null;
  readonly isRecurring: boolean | null;
  readonly isAllDay: boolean | null;
  readonly recurrencePattern: string | null;
  readonly recurrenceUntil: Date | null;
  readonly exDate: string | null;
}
