import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSpecialityDto } from "./dto/create-speciality.dto";

@Injectable()
export class SpecialityService {
  constructor(private prismaService: PrismaService) {}

  public async create(data: CreateSpecialityDto) {
    return this.prismaService.speciality.create({ data });
  }

  public async getAll() {
    const list = await this.prismaService.speciality.findMany({
      include: {
        faculty: true,
      },
    });

    return list.map((s) => ({ ...s, facultyName: s.faculty.shortName }));
  }
}
