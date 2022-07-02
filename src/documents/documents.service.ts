import { Injectable } from "@nestjs/common";
import { ScheduleService } from "../schedule/schedule.service";
import * as mustache from "mustache";
import * as path from "path";
import { promisify } from "util";
import * as fs from "fs";
import * as moment from "moment";
import * as excel from "excel4node";

const readFile = promisify(fs.readFile);

@Injectable()
export class DocumentsService {
  constructor(private scheduleService: ScheduleService) {}

  public async printDepartmentSchedule(semesterId: string) {
    const templatePath = path.join(
      __dirname,
      "templates",
      "department-schedule.mustache",
    );
    const template = await readFile(templatePath);
    const [data, times] = await Promise.all([
      this.scheduleService.getScheduleClassOfDepartment(semesterId),
      this.scheduleService.getListOfTimesClasses(),
    ]);

    const formattedTimes = times.list.map((time) => {
      const startTime = moment(time.startTime).format("HH:mm");
      const endTime = moment(time.endTime).format("HH:mm");

      return `${startTime} - ${endTime}`;
    });

    return JSON.stringify(data, null, 2);
  }
}
