import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { EmailService } from "../email/email.service";

const { SECRET } = process.env;

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
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
        { id: user.id, email, password },
        {
          expiresIn: "24h",
        },
      );
      const access = this.jwtService.sign(
        { id: user.id, email, password, role: user.role },
        { expiresIn: "1d" },
      );

      return { user, refresh, access };
    } catch (e) {
      throw e;
    }
  }

  public async register(req: RegisterUserDto): Promise<User> {
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

      const createdUser = await this.prismaService.user.create({
        data: {
          email,
          lastName,
          middleName,
          firstName,
          password: hashedPassword,
          activationCode,
        },
      });

      await this.sendMailWithActivateLink(createdUser);

      return createdUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async activateAccount(id: string, code: string) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      let updated = {};

      if (code === user.activationCode) {
        await this.jwtService.verify(code);
        updated = await this.prismaService.user.update({
          where: { id },
          data: { activationCode: null, activatedAt: new Date() },
        });
      }

      return !!updated;
    } catch (e) {
      throw e;
    }
  }

  public refreshToken(refresh: string) {
    const { id, email, password } = this.jwtService.verify(refresh);

    const access = this.jwtService.sign(
      { id, email, password },
      { expiresIn: "900s" },
    );

    return access;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private async sendMailWithActivateLink(createdUser: User): Promise<void> {
    const sendMailOptions = {
      to: createdUser.email,
      from: "e.department.belstu@gmail.com",
      subject: "Добро пожаловать!",
      template: "CreatedAccount",
      text: "",
      context: {
        name: `${createdUser.firstName} ${createdUser.middleName} ${createdUser.firstName}`,
      },
    };

    await this.emailService.sendEmail(sendMailOptions);
  }
}
