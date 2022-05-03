import { ClassType, WeekDay } from "../enum";
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

export const WeekDaysMapToString = {
  [WeekDay.MONDAY]: "Понедельник",
  [WeekDay.TUESDAY]: "Вторник",
  [WeekDay.WEDNESDAY]: "Среда",
  [WeekDay.THURSDAY]: "Четверг",
  [WeekDay.FRIDAY]: "Пятница",
  [WeekDay.SATURDAY]: "Суббота",
  [WeekDay.SUNDAY]: "Воскресенье",
};

export const ClassTypeMap = {
  [ClassType.LAB]: "ЛР",
  [ClassType.PRACTICE_CLASS]: "ПЗ",
  [ClassType.LECTION]: "ЛК",
};
