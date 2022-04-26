import { Controller, Get, Param } from "@nestjs/common";
import { DocumentsService } from "./documents.service";

@Controller("documents")
export class DocumentsController {
  constructor(private documentService: DocumentsService) {}

  @Get("department-schedule/:semesterId")
  public async printDepartmentSchedule(@Param() param) {
    const { semesterId } = param;
    return this.documentService.printDepartmentSchedule(semesterId);
  }
}
