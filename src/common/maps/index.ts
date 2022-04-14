import { WeekDay } from "../enum";
import RRule from "rrule";

export const WeekDayMapToRrule = {
  [WeekDay.MONDAY]: RRule.MO,
  [WeekDay.TUESDAY]: RRule.TU,
  [WeekDay.WEDNESDAY]: RRule.WE,
  [WeekDay.THURSDAY]: RRule.TH,
  [WeekDay.FRIDAY]: RRule.FR,
  [WeekDay.SATURDAY]: RRule.SA,
  [WeekDay.SUNDAY]: RRule.SU,
};
