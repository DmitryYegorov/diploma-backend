import * as _ from "lodash";
import { Week } from "../../common/enum";
import * as moment from "moment";
import { RRule } from "rrule";
import { WeekDayMapToRrule } from "../../common/maps";

export function formatScheduleClassesList(classes: Array<any>) {
  const mappedList = classes.map((item) => {
    const startClassDate = moment(
      new Date(
        0,
        0,
        0,
        item.scheduleTime.startHours,
        item.scheduleTime.startMinute,
        0,
      ),
    ).format("HH:mm");
    const endClassDate = moment(
      new Date(
        0,
        0,
        0,
        item.scheduleTime.endHours,
        item.scheduleTime.endMinute,
        0,
      ),
    ).format("HH:mm");

    return {
      id: item.id,
      teacherId: item.teacherId,
      teacherName: `${item.teacher.firstName} ${item.teacher.middleName} ${item.teacher.lastName}`,
      time: {
        id: item.scheduleTime.id,
        value: `${startClassDate} - ${endClassDate}`,
        order: item.scheduleTime.order,
      },
      weekDay: item.weekDay,
      groups: item.groups,
      subject: item.subject,
      week: item.week,
      classType: item.type,
      room: `${item.room.room} - ${item.room.campus}`,
    };
  });

  const groupedByWeekDay = _.groupBy(mappedList, "weekDay");

  for (const day of Object.keys(groupedByWeekDay)) {
    const sortedByClassesOrder = groupedByWeekDay[day].sort(
      (a, b) => a.time.order - b.time.order,
    );

    groupedByWeekDay[day] = _.groupBy(sortedByClassesOrder, "time.id");

    for (const classOrder of Object.keys(groupedByWeekDay[day])) {
      groupedByWeekDay[day][classOrder] = _.groupBy(
        groupedByWeekDay[day][classOrder],
        "week",
      );
    }
  }

  return groupedByWeekDay;
}

export function mapScheduleClassToEvent(scheduleClass) {
  const { weekDay, week, semester, scheduleTime } = scheduleClass;
  let startDate;

  if (week === Week.WEEKLY || week === Week.FIRST) {
    startDate = semester.startDate;
  } else if (week === Week.SECOND) {
    startDate = new Date(
      moment(semester.startDate).add(1, "w").startOf("isoWeek").toDate(),
    );
  }

  const startTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDay(),
    scheduleTime.startHours,
    scheduleTime.startMinute,
    0,
  );
  const endTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDay(),
    scheduleTime.endHours,
    scheduleTime.endMinute,
    0,
  );

  const rRule = new RRule({
    freq: RRule.WEEKLY,
    interval: week !== Week.WEEKLY ? 2 : 1,
    byweekday: WeekDayMapToRrule[weekDay],
    dtstart: startTime,
    until: semester.endDate,
  }).toString();

  return {
    id: scheduleClass.id,
    subject: {
      name: scheduleClass.subject.name,
      shortName: scheduleClass.subject.shortName,
    },
    title: `${scheduleClass.type} ${scheduleClass.subject.name}`,
    classType: scheduleClass.type,
    teacher: `${scheduleClass.teacher.firstName} ${scheduleClass.teacher.middleName} ${scheduleClass.teacher.lastName}`,
    room: `${scheduleClass.room.room} - ${scheduleClass.room.campus}`,
    startDate: startTime,
    endDate: endTime,
    rRule,
    isScheduleClass: true,
  };
}
