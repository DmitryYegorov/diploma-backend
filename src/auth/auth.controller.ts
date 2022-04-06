import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  public async login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @Post("/register")
  public async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Patch("/:id/code/:code")
  public async activateAccount(@Param() params) {
    const { id, code } = params;

    return this.authService.activateAccount(id, code);
  }
}
