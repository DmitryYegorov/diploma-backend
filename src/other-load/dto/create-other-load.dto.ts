import { EventType } from "../../common/enum";

export class CreateOtherLoadDto {
  readonly semesterId: string;
  readonly subjectId?: string;
  readonly studentsCount?: number;
  readonly groups?: Array<string>;
  readonly duration: number;
  readonly date: Date;
  readonly createdBy: string;
  readonly type: EventType;
}
