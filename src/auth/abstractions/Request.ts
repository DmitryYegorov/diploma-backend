import * as Enum from "./Enum";

export interface Login {
  email: string;
  password: string;
}

export interface CreateUserAccount {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
  role?: Enum.Role;
}
