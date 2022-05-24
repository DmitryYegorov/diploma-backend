import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FacultyService {
  constructor(private prismaService: PrismaService) {}

  public async fetchFacultiesList() {
    return this.prismaService.faculty.findMany();
  }
}
