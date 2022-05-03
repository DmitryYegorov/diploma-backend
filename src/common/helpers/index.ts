import { Week, WeekDay } from "../enum";
import * as moment from "moment";
import { RRule } from "rrule";
import { WeekDayMapToRrule } from "../maps";

type ScheduleClassType = {
  weekDay: WeekDay;
  week: Week;
  startDate?: Date | string;
  endDate?: Date | string;
  semester: {
    startDate: Date | string;
    endDate: Date | string;
  };
  scheduleTime: {
    startHours: number;
    startMinute: number;
    endHours: number;
    endMinute: number;
  };
};

export function createRRuleForScheduleClass(scheduleClass: ScheduleClassType) {
  const { weekDay, week, semester, scheduleTime } = scheduleClass;

  let startDate;

  if (week === Week.WEEKLY || week === Week.FIRST) {
    startDate = scheduleClass.startDate
      ? scheduleClass.startDate
      : semester.startDate;
  } else if (week === Week.SECOND) {
    startDate = moment(
      scheduleClass.startDate ? scheduleClass.startDate : semester.startDate,
    )
      .add(1, "week")
      .startOf("isoWeek")
      .add(1, "d")
      .toDate();
  }

  const startTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    scheduleTime.startHours,
    scheduleTime.startMinute,
    0,
  );

  const endTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    scheduleTime.endHours,
    scheduleTime.endMinute,
    0,
  );

  const rRule = new RRule({
    freq: RRule.WEEKLY,
    interval: week !== Week.WEEKLY ? 2 : 1,
    byweekday: WeekDayMapToRrule[weekDay],
    dtstart: startDate,
    until: new Date(
      scheduleClass.endDate ? scheduleClass.endDate : semester.endDate,
    ),
  });

  return { rRule, startTime, endTime };
}
