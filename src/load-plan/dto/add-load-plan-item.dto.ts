import { LoadType } from "@prisma/client";

export class AddLoadPlanItemDto {
  readonly semesterId: string;
  readonly subjectId?: string;
  readonly type: LoadType;
  readonly teacherId: string;
  readonly duration: number;
  readonly subgroupsCount: number;
  readonly specialityId: string;
  readonly course: number;
}
