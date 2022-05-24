import { ClassType, Week, WeekDay } from "../common/enum";

export interface Group {
  group: number;
  subGroup: number;
}

export type GroupList = {
  groups: Group[];
};
