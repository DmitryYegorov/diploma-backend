import * as Request from "./Request";
import * as Response from "./Response";

export interface Service {
  login(req: Request.Login): Promise<Response.GetLoginData>;
}
