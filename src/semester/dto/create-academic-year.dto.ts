type Period = {
  startDate: Date;
  endDate: Date;
};

export class CreateAcademicYearDto {
  readonly academicYear: Period;
  readonly semesters: Array<Period & { name: string }>;
}
