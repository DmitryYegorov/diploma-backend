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

const { CLASS_DURATION } = process.env;

type ReportLoadWithSubject = {
  id: string;
  subjectId: string;
  subjectName: string;
  date: Date;
  type: LoadType;
  duration: number;
};

export const mapReportData = (data: {
  report: Report & { creater: User };
  reportData?: ReportLoadWithSubject;
}) => {
  const { report, reportData } = data;

  return {
    id: report.id,
    name: report.name,
    startDate: moment(new Date(report.startDate)).format("DD-MM-yyyy"),
    endDate: moment(new Date(report.endDate)).format("DD-MM-yyyy"),
    createdAt: moment(new Date(report.createdAt)).format("DD-MM-yyyy"),
    createdBy: `${report.creater.firstName} ${report.creater.middleName[0]}. ${report.creater.lastName[0]}.`,
    state: report.state,
    reportData,
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
        speciality: item.group.speciality.shortName,
      }),
    );
  }
  if (otherLoad) {
    otherLoad.OtherLoadGroup.forEach((item) =>
      groups.push({
        label: `${item.group.course}к. ${item.group.speciality.faculty.shortName} ${item.group.group}-${item.group.subGroup}`,
        speciality: item.group.speciality.shortName,
      }),
    );
  }

  return {
    id: data.id,
    subjectId: data.subject?.id,
    subjectName: data.subject?.shortName,
    date: data.date,
    type: data.type,
    duration: data.duration,
    groups,
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
