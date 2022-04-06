import { User } from "@prisma/client";

export class GetUsersDto {
  readonly list: User[];
  readonly total: number;
}
