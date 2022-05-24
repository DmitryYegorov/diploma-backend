import { ClassType, EventType, WeekDay } from "../enum";
import RRule from "rrule";
import { LoadType } from "@prisma/client";

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

export const EventTypeMap = {
  [EventType.EXAM]: "Экзамен",
  [EventType.STATE_EXAMINATION_BOARD]: "ГЭК",
  [EventType.TESTING]: "Тестирование",
  [EventType.PRACTICE]: "Практика",
  [EventType.CREDIT]: "Зачёт",
  [EventType.DIPLOMA_DESIGN]: "Дипломное проектирование",
  [EventType.POSTGRADUATE]: "Магистранты/Аспиранты",
  [EventType.COURSE_WORK]: "Курсовая работа",
  [EventType.CONSULTATION]: "Консультации",
};
