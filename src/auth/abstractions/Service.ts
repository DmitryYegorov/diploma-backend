import * as Request from "./Request";
import * as Response from "./Response";
import { user } from "@prisma/client";

export interface Service {
  login(req: Request.Login): Promise<Response.GetLoginData>;
  register(req: Request.CreateUserAccount): Promise<user>;
}
