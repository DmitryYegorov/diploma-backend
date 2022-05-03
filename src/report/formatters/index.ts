import * as moment from "moment";

export const mapReportData = (data) => {
  const { report } = data;
  return {
    id: report.id,
    name: report.name,
    startDate: moment(new Date(report.startDate)).format("DD-MM-yyyy"),
    endDate: moment(new Date(report.endDate)).format("DD-MM-yyyy"),
    createdAt: moment(new Date(report.createdAt)).format("DD-MM-yyyy"),
    createdBy: `${report.creater.firstName} ${report.creater.middleName[0]}. ${report.creater.lastName[0]}.`,
    state: report.state,
  };
};
