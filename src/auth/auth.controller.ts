import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { user } from "@prisma/client";
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
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() body: RegisterUserDto): Promise<user> {
    return this.authService.register(body);
  }
}
