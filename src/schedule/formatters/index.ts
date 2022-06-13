import * as _ from "lodash";
import {
  ClassType,
  EventType,
  ScheduleClassUpdateType,
  Week,
} from "../../common/enum";
import * as moment from "moment";
import { RRule, RRuleSet } from "rrule";
import { WeekDayMapToRrule, WeekDaysMapToString } from "../../common/maps";
import { ScheduleClassUpdate } from "@prisma/client";
import { createRRuleForScheduleClass } from "../../common/helpers";

const { CLASS_DURATION } = process.env;

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
      type: item.type,
      room: `${item.room.room} - ${item.room.campus}`,
      startDate: item.startDate,
      endDate: item.endDate,
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
      group: `${scheduleClass.GroupScheduleClass[0].group.course} ${scheduleClass.GroupScheduleClass[0].group.speciality.faculty.shortName} ${scheduleClass.GroupScheduleClass[0].group.group}`,
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

export function mapScheduleClassSwap(swap, toReport = false) {
  const { scheduleClass, type, teacher, classDate, id } = swap;
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

  return {
    id,
    subject: {
      id: scheduleClass.subject.id,
      name: scheduleClass.subject.name,
      shortName: scheduleClass.subject.shortName,
    },
    title: `${mapClassType[scheduleClass.type]} ${scheduleClass.subject.name}`,
    type: scheduleClass.type,
    updateType: type,
    teacher: `${teacher.firstName} ${teacher.middleName} ${teacher.lastName}`,
    teacherId: teacher.id,
    room: `${scheduleClass.room.room} - ${scheduleClass.room.campus}`,
    startDate,
    endDate,
    rRule: null,
    exDate: null,
    scheduleClassId: scheduleClass.id,
  };
}

export function mapScheduleClassReschedule(reschedule) {
  const { scheduleClass, type, rescheduleDate, id } = reschedule;

  const { startTime, endTime } = mapScheduleTimeToDate(
    rescheduleDate,
    scheduleClass.scheduleTime,
  );

  return {
    id,
    subject: {
      id: scheduleClass.subject.id,
      name: scheduleClass.subject.name,
      shortName: scheduleClass.subject.shortName,
    },
    title: scheduleClass.subject.shortName,
    type: scheduleClass.type,
    updateType: type,
    teacher: `${scheduleClass.teacher.firstName} ${scheduleClass.teacher.middleName} ${scheduleClass.teacher.lastName}`,
    teacherId: scheduleClass.teacher.id,
    room: `${scheduleClass.room.room} - ${scheduleClass.room.campus}`,
    startDate: startTime,
    endDate: endTime,
    rRule: null,
    exDate: null,
    scheduleClassId: scheduleClass.id,
  };
}

export function mapScheduleClassToEvent(
  scheduleClass,
  options: { includeScheduleTime?: boolean } = {},
) {
  const { ScheduleClassUpdate } = scheduleClass;

  const { rRule, endTime, startTime } =
    createRRuleForScheduleClass(scheduleClass);

  const exDate = ScheduleClassUpdate.filter(
    (u) =>
      !(
        u.type === ScheduleClassUpdate.SWAP &&
        u.teacherId === scheduleClass.teacher.id
      ),
  ).map((u) => new Date(u.classDate));

  return {
    id: scheduleClass.id,
    subject: {
      id: scheduleClass.subject.id,
      name: scheduleClass.subject.name,
      shortName: scheduleClass.subject.shortName,
    },
    title: scheduleClass.subject.shortName,
    type: scheduleClass.type,
    teacher: `${scheduleClass.teacher.firstName} ${scheduleClass.teacher.middleName} ${scheduleClass.teacher.lastName}`,
    teacherId: scheduleClass.teacher.id,
    room: `${scheduleClass.room.room} - ${scheduleClass.room.campus}`,
    startDate: startTime,
    endDate: endTime,
    rRule: rRule.toString(),
    exDate: exDate.join(","),
    ...(options.includeScheduleTime
      ? { scheduleTime: scheduleClass.scheduleTime }
      : {}),
  };
}

export function mapScheduleClassUpdateAsLogItem(update) {
  const baseData = {
    classDate: moment(update.classDate).format("yyyy-MM-DD"),
    type: update.type,
    scheduleClass: `${mapClassType[update.scheduleClass.type]} ${
      update.scheduleClass.subject.shortName
    }`,
    reason: update.reason,
    teacher: `${update.scheduleClass.teacher.firstName} ${update.scheduleClass.teacher.middleName} ${update.scheduleClass.teacher.lastName}`,
  };

  let updatedData = {};
  if (update.type === ScheduleClassUpdateType.SWAP) {
    updatedData = {
      newTeacher: `${update.teacher.firstName} ${update.teacher.middleName} ${update.teacher.lastName}`,
    };
  }
  if (update.type === ScheduleClassUpdateType.RESCHEDULED) {
    updatedData = {
      rescheduleDate: moment(update.rescheduleDate).format("yyyy-MM-DD"),
    };
  }

  return { ...baseData, ...updatedData };
}

export function mapScheduleTimeToDate(date, scheduleTime) {
  const startTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    scheduleTime.startHours,
    scheduleTime.startMinute,
    0,
  );

  const endTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    scheduleTime.endHours,
    scheduleTime.endMinute,
    0,
  );

  return { startTime, endTime };
}

export function clearTimeFromDateObject(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

export function mapScheduleTimeToString(scheduleTime) {
  const { startTime, endTime } = mapScheduleTimeToDate(
    new Date(),
    scheduleTime,
  );
  return `${moment(startTime).format("HH:mm")} - ${moment(endTime).format(
    "HH:mm",
  )}`;
}
