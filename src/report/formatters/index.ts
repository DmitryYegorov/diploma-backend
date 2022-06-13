import * as moment from "moment";
import * as _ from "lodash";
import {
  ReportLoad,
  Subject,
  Report,
  User,
  LoadType,
  OtherLoad,
  Faculty,
} from "@prisma/client";
import { EventTypeMap } from "../../common/maps";
import { unique } from "../../common/helpers";

const { CLASS_DURATION } = process.env;

type ReportLoadWithSubject = {
  id: string;
  subjectId: string;
  subjectName: string;
  date: Date;
  type: LoadType;
  duration: number;
};

export const mapReportData = (data: any) => {
  const { report } = data;

  return {
    id: report.id,
    name: report.name,
    startDate: moment(new Date(report.startDate)).format("DD-MM-yyyy"),
    endDate: moment(new Date(report.endDate)).format("DD-MM-yyyy"),
    createdAt: moment(new Date(report.createdAt)).format("DD-MM-yyyy"),
    createdBy: `${report.creater.firstName} ${report.creater.middleName[0]}. ${report.creater.lastName[0]}.`,
    state: report.state,
    type: report.type,
  };
};

export function mapReportDataToItemList(report: Report & { creater: User }) {
  return {
    id: report.id,
    name: report.name,
    startDate: moment(new Date(report.startDate)).format("DD-MM-yyyy"),
    endDate: moment(new Date(report.endDate)).format("DD-MM-yyyy"),
    createdAt: moment(new Date(report.createdAt)).format("DD-MM-yyyy"),
    createdBy: `${report.creater.firstName} ${report.creater.middleName[0]}. ${report.creater.lastName[0]}.`,
    state: report.state,
  };
}

export function mapReportRowToWidthSubjectName(data: any) {
  const groups = [];

  const { scheduleClass, otherLoad } = data;

  if (scheduleClass) {
    scheduleClass.GroupScheduleClass.forEach((item) =>
      groups.push({
        label: `${item.group.course}к. ${item.group.speciality.faculty.shortName} ${item.group.group}-${item.group.subGroup}`,
        specialityName: item.group.speciality.shortName,
        facultyName: item.group.speciality.faculty.shortName,
        course: item.group.course,
      }),
    );
  }
  if (otherLoad) {
    otherLoad.OtherLoadGroup.forEach((item) =>
      groups.push({
        label: `${item.group.course}к. ${item.group.speciality.faculty.shortName} ${item.group.group}-${item.group.subGroup}`,
        specialityName: item.group.speciality.shortName,
        facultyName: item.group.speciality.faculty.shortName,
        course: item.group.course,
      }),
    );
  }

  const facultyLabels = unique(groups.map((g) => g.facultyName));
  const specialityLabels = unique(
    groups.map((g) => `${g.course} ${g.specialityName}`),
  );

  return {
    id: data.id,
    subjectId: data.subject?.id,
    subjectName: data.subject?.shortName,
    date: data.date,
    type: data.type,
    duration: data.duration,
    subGroupsCount: groups.length,
    groups,
    facultyName: facultyLabels.join(", "),
    specialityName: specialityLabels.join(", "),
  };
}

export function mapOtherLoadRowToReportData(row: any) {
  return {
    id: row.id,
    type: row.type,
    isOtherLoad: true,
    subjectName: row.subjectId ? row.subject.shortName : EventTypeMap[row.type],
    subjectId: row.subjectId,
    facultyId: row.faculty?.id,
    facultyName: row.faculty?.shortName,
    groupsCount: row.groupsCount,
    studentsCount: row.studentsCount,
    duration: row.duration,
    date: row.date,
  };
}

export function mapLoadToMonthReportTable(reportLoad) {
  const withSubjects = reportLoad.filter((rl) => rl.subjectName);
  const withOutSubjects = reportLoad.filter((rl) => !rl.subjectName);

  const groupedBySubjects = _.groupBy(withSubjects, "subjectName");

  const formatted = Object.keys(groupedBySubjects).map((subject) => {
    const entries = groupedBySubjects[subject].map((s) => [s.type, s.duration]);

    return {
      ...Object.fromEntries(entries),
      subjectName: subject,
      facultyName: groupedBySubjects[subject][0].facultyName,
      subGroupsCount: groupedBySubjects[subject][0].subGroupsCount,
      studentsCount: groupedBySubjects[subject][0].studentsCount,
      specialityName: groupedBySubjects[subject][0].specialityName,
    };
  });

  const calculated = [...formatted, ...withOutSubjects];

  return calculated;
}
