import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { Request, Response } from "express";
import { LoginUserDto } from "src/modules/users/dto/login-user.dto";
import { RegisterUserDto } from "src/modules/users/dto/register-user.dto";
import { IUser } from "src/modules/users/users.interface";
import {
  Public,
  ResponseMessage,
  User,
} from "src/shared/decorators/customize.decorator";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ResponseMessage("Đăng nhập thành công")
  @ApiOperation({ summary: "Đăng nhập" })
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @ApiBody({ type: LoginUserDto })
  @Post("/login")
  async handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(req.user, response);
  }

  @ResponseMessage("Đăng kí thành công")
  @ApiOperation({ summary: "Đăng kí" })
  @Public()
  @Post("/register")
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage("Hiển thị chi tiết tài khoản thành công")
  @ApiOperation({ summary: "Hiển thị chi tiết tài khoản" })
  @Get("/account")
  async account(@User() user: IUser) {
    return this.authService.infoAccount(user);
  }

  @ResponseMessage("Get User by refresh token")
  @ApiOperation({ summary: "refresh token" })
  @Public()
  @Get("/refresh")
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refresh_token = request.cookies["refresh_token"];
    return this.authService.processNewToken(refresh_token, response);
  }

  @ResponseMessage("Đăng xuất thành công")
  @ApiOperation({ summary: "Đăng xuất" })
  @Post("/logout")
  logout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response);
  }
}
