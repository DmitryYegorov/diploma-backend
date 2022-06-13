import { unique } from "../../common/helpers";

export function mapDbDataToLoadPlanTable(loadPlan) {
  return {
    id: loadPlan.id,
    subjectName: loadPlan.subject?.shortName,
    subjectId: loadPlan.subject?.id,
    duration: loadPlan.duration,
    type: loadPlan.type,
    semesterId: loadPlan.semesterId,
    subgroupsCount: loadPlan.subgroupsCount,
    specialityName: loadPlan.speciality.shortName,
    courseAndSpecialityLabel: `${loadPlan.course} ${loadPlan.speciality.shortName}`,
    facultyName: loadPlan.speciality.faculty.shortName,
    specialityId: loadPlan.specialityId,
    course: loadPlan.course,
  };
}
