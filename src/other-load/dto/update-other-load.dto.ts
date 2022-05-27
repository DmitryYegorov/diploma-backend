import { EventType } from "../../common/enum";

export class UpdateOtherLoadDto {
  readonly semesterId?: string;
  readonly subjectId?: string;
  readonly studentsCount?: number;
  readonly groups?: Array<string>;
  readonly duration: number;
  readonly date: Date;
  readonly type: EventType;
}
