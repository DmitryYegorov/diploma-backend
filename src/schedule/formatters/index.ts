import * as _ from "lodash";
import { ClassType, ScheduleClassUpdateType, Week } from "../../common/enum";
import * as moment from "moment";
import { RRule, RRuleSet } from "rrule";
import { WeekDayMapToRrule, WeekDaysMapToString } from "../../common/maps";
import { ScheduleClassUpdate } from "@prisma/client";

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

export function mapScheduleClassUpdateToEvent(scheduleClassUpdate) {
  const { scheduleClass, type, teacher, classDate } = scheduleClassUpdate;

  const startDate = new Date(
    classDate.getFullYear(),
    classDate.getMonth(),
    classDate.getDate(),
    scheduleClass.scheduleTime.startHours,
    scheduleClass.scheduleTime.startMinute,
    0,
  );
  const endDate = new Date(
    classDate.getFullYear(),
    classDate.getMonth(),
    classDate.getDate(),
    scheduleClass.scheduleTime.endHours,
    scheduleClass.scheduleTime.endMinute,
    0,
  );

  console.log(scheduleClass.type);

  if (type === ScheduleClassUpdateType.SWAP) {
    return {
      id: scheduleClass.id,
      subject: {
        name: scheduleClass.subject.name,
        shortName: scheduleClass.subject.shortName,
      },
      title: `${mapClassType[scheduleClass.type]} ${
        scheduleClass.subject.name
      }`,
      type: type,
      teacher: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
      teacherId: teacher.id,
      room: `${scheduleClass.room.room} - ${scheduleClass.room.campus}`,
      startDate,
      endDate,
      rRule: null,
    };
  }
}

export function mapScheduleClassToEvent(scheduleClass) {
  const { weekDay, week, semester, scheduleTime, ScheduleClassUpdate } =
    scheduleClass;

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
    until: semester.endDate,
  }).toString();

  const exDate = ScheduleClassUpdate.map((update) =>
    update.teacherId !== scheduleClass.teacher.id ? update.classDate : null,
  )
    .filter((exd) => exd !== null)
    .join(",");

  return {
    id: scheduleClass.id,
    subject: {
      name: scheduleClass.subject.name,
      shortName: scheduleClass.subject.shortName,
    },
    title: `${mapClassType[scheduleClass.type]} ${scheduleClass.subject.name}`,
    type: scheduleClass.type,
    teacher: `${scheduleClass.teacher.firstName} ${scheduleClass.teacher.middleName} ${scheduleClass.teacher.lastName}`,
    teacherId: scheduleClass.teacher.id,
    room: `${scheduleClass.room.room} - ${scheduleClass.room.campus}`,
    startDate: startTime,
    endDate: endTime,
    rRule: rRule,
    exDate,
  };
}
