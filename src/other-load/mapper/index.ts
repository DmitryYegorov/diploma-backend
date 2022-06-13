export function unique(a: Array<string>) {
  return a.filter((item, index) => a.indexOf(item) === index);
}

export function mapDbDataToLoadItem(loadPlan) {
  const groups = loadPlan.OtherLoadGroup.map((item) => ({
    id: item.group.id,
    facultyName: item.group.speciality.faculty.shortName,
    course: item.group.course,
    group: item.group.group,
    subGroup: item.group.subGroup,
    specialityName: item.group.speciality.shortName,
  }));

  const specialityLabels = unique(
    groups.map((g) => `${g.course} ${g.specialityName}`),
  );

  const facultyLabels = unique(groups.map((g) => g.facultyName));

  const subGroupsLabels = groups.map((g) => ({
    label: `${g.course}к. ${g.group}-${g.subGroup} ${g.facultyName}`,
    specialityName: g.specialityName,
    id: g.id,
  }));

  const subGroupsCount = loadPlan._count?.LoadPlanSubGroups;

  return {
    id: loadPlan.id,
    subjectName: loadPlan.subject?.shortName,
    subjectId: loadPlan.subject?.id,
    duration: loadPlan.duration,
    type: loadPlan.type,
    semesterId: loadPlan.semesterId,
    subGroupsCount,
    subGroupsLabels,
    specialityName: specialityLabels,
    facultyName: facultyLabels,
    studentsCount: loadPlan.studentsCount,
    createdAt: loadPlan.createdAt,
    date: loadPlan.date,
  };
}
