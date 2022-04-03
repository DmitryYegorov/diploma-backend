import { UserRole } from "../enum";
import { SetMetadata } from "@nestjs/common";

export const ROLE_KEY = "role";

export const Role = (roles: UserRole[]) => SetMetadata(ROLE_KEY, roles);
