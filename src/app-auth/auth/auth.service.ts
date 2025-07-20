import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import ms from "ms";
import { RolesService } from "src/app-auth/roles/roles.service";
import { RegisterUserDto } from "src/modules/users/dto/register-user.dto";
import { IUser } from "src/modules/users/users.interface";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = await this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);

        const objUser = {
          ...user.toObject(),
          permissions: temp?.permissions ?? [],
        };

        return objUser;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, userName, role, permissions } = user;
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      userName,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);
    //udpate refresh token user
    await this.usersService.updateUserToken(refresh_token, _id);
    //set cookies
    response.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXP")),
    });
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
      user: {
        _id,
        userName,
        role,
        permissions,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const resUser = await this.usersService.register(registerUserDto);
    return {
      _id: resUser?._id,
      createdAt: resUser?.createdAt,
    };
  }

  createRefreshToken(payload) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXP")),
    });
    return refresh_token;
  }

  async processNewToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      });

      const user = await this.usersService.findUserToken(refreshToken);
      if (user) {
        const { _id, userName, role, userBusinessId } = user;
        const payload = {
          sub: "token login",
          iss: "from server",
          _id,
          userName,
          role,
        };

        const refresh_token = this.createRefreshToken(payload);
        //udpate refresh token user
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        //fetch user role
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.rolesService.findOne(userRole._id);
        //delete cookie
        response.clearCookie("refresh_token");
        //set cookies
        response.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXP")) / 100,
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            userName,
            userBusinessId,
            role,
            permissions: temp?.permissions ?? [],
          },
        };
      } else {
        throw new BadRequestException("Refresh Token không hợp lệ");
      }
    } catch (error) {
      throw new BadRequestException(`${error}!`);
    }
  }

  async logout(user: IUser, response: Response) {
    await this.usersService.updateUserToken("", user._id);
    //delete cookie
    response.clearCookie("refresh_token");
    return "OK";
  }

  async infoAccount(user: IUser) {
    const tempPermission = (await this.rolesService.findOne(
      user.role._id
    )) as any;
    const tempTeam = (await this.usersService.findOne(user._id)) as any;
    user.permissions = tempPermission.permissions;
    user.teams = tempTeam.team;
    return { user };
  }
}
