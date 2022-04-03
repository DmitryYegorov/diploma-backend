import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { user } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserData } from "../common/types/User";

const { SECRET, REFRESH_JWT_SECRET, ACCESS_JWT_SECRET } = process.env;

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  public async login(req: LoginUserDto): Promise<any> {
    try {
      const { email, password } = req;
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new HttpException(
          { message: "Некорректные данные для входа" },
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkPassword = bcrypt.compareSync(password, user.password);

      if (!checkPassword) {
        throw new HttpException(
          { message: "Некорректные данные для входа" },
          HttpStatus.BAD_REQUEST,
        );
      }

      const refresh = this.jwtService.sign(
        { email, password },
        {
          secret: REFRESH_JWT_SECRET,
          expiresIn: "15min",
        },
      );
      const access = this.jwtService.sign(
        { email, password },
        { secret: ACCESS_JWT_SECRET, expiresIn: "60s" },
      );

      return { user, refresh, access };
    } catch (e) {
      throw e;
    }
  }

  public async register(req: RegisterUserDto): Promise<user> {
    try {
      const { email, lastName, middleName, firstName, password } = req;

      const checkingEmail = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (checkingEmail) {
        throw new HttpException(
          {
            message: "Пользователь с таким мылом уже есть!",
          },
          400,
        );
      }

      const salt = bcrypt.genSaltSync();
      const hashedPassword = await bcrypt.hash(password, salt);
      const activationCode = this.jwtService.sign(
        { email },
        { secret: SECRET },
      );

      return this.prismaService.user.create({
        data: {
          email,
          lastName,
          middleName,
          firstName,
          password: hashedPassword,
          activationCode,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
