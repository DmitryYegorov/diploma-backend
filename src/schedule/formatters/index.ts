import * as _ from "lodash";
import { ClassType, Week } from "../../common/enum";
import * as moment from "moment";
import { RRule } from "rrule";
import { WeekDayMapToRrule, WeekDaysMapToString } from "../../common/maps";

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

const mapClassType = {
  [ClassType.PRACTICE_CLASS]: "ПЗ",
  [ClassType.LAB]: "ЛР",
  [ClassType.LECTION]: "ЛК",
};
export function formatScheduleClassesListForDepartment(scheduleClasses) {
  const formatted = scheduleClasses.map((scheduleClass) => {
    const startClassDate = moment(
      new Date(
        0,
        0,
        0,
        scheduleClass.scheduleTime.startHours,
        scheduleClass.scheduleTime.startMinute,
        0,
      ),
    ).format("HH:mm");
    const endClassDate = moment(
      new Date(
        0,
        0,
        0,
        scheduleClass.scheduleTime.endHours,
        scheduleClass.scheduleTime.endMinute,
        0,
      ),
    ).format("HH:mm");

    return {
      weekDay: scheduleClass.weekDay,
      week: scheduleClass.week,
      order: scheduleClass.scheduleTime.order,
      room: `${scheduleClass.room.room}-${scheduleClass.room.campus}`,
      title: `${mapClassType[scheduleClass.type]} ${
        scheduleClass.subject.shortName
      }`,
      time: `${startClassDate} - ${endClassDate}`,
      timeId: scheduleClass.scheduleTime.id,
      teacherId: scheduleClass.teacher.id,
      teacherName: `${scheduleClass.teacher.firstName} ${scheduleClass.teacher.middleName[0]}. ${scheduleClass.teacher.lastName[0]}.`,
      group: `${scheduleClass.GroupScheduleClass[0].group.courese} ${scheduleClass.GroupScheduleClass[0].group.faculty.shortName} ${scheduleClass.GroupScheduleClass[0].group.group}`,
    };
  });

  const groupedByWeekDay = _.groupBy(formatted, "weekDay");
  Object.keys(groupedByWeekDay).map((weekDay) => {
    groupedByWeekDay[weekDay] = _.groupBy(groupedByWeekDay[weekDay], "timeId");

    Object.keys(groupedByWeekDay[weekDay]).forEach((timeId) => {
      groupedByWeekDay[weekDay][timeId] = _.groupBy(
        groupedByWeekDay[weekDay][timeId],
        "week",
      );
    });
  });

  return groupedByWeekDay;
}

export function mapScheduleClassToEvent(scheduleClass) {
  const { weekDay, week, semester, scheduleTime } = scheduleClass;
  let startDate;

  if (week === Week.WEEKLY || week === Week.FIRST) {
    startDate = semester.startDate;
  } else if (week === Week.SECOND) {
    startDate = moment(semester.startDate)
      .add(1, "week")
      .startOf("isoWeek")
      .add(1, "d")
      .toDate();
  }

  console.log({ week, startDate });

  const startTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    scheduleTime.startHours,
    scheduleTime.startMinute,
    0,
  );

  console.log({ week, startTime });
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
    until: semester.endDate,
  }).toString();

  return {
    id: scheduleClass.id,
    subject: {
      name: scheduleClass.subject.name,
      shortName: scheduleClass.subject.shortName,
    },
    title: `${mapClassType[scheduleClass.type]} ${scheduleClass.subject.name}`,
    type: scheduleClass.type,
    teacher: `${scheduleClass.teacher.firstName} ${scheduleClass.teacher.middleName} ${scheduleClass.teacher.lastName}`,
    room: `${scheduleClass.room.room} - ${scheduleClass.room.campus}`,
    startDate: startTime,
    endDate: endTime,
    rRule,
    isScheduleClass: true,
  };
}
