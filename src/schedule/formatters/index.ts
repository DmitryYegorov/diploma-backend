import * as _ from "lodash";
import { Week } from "../../common/enum";
import * as moment from "moment";

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
