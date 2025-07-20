import { RolesService } from "@/app-auth/roles/roles.service";
import { IUser } from "@/modules/users/users.interface";
import { UsersService } from "@/modules/users/users.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: IUser) {
    const { _id, userName, role, userBusinessId } = payload;
    //add permission
    const userRole = role as unknown as { _id: string; name: string };
    const temp = (await this.rolesService.findOne(userRole._id))?.toObject();
    //req.user
    return {
      _id,
      userName,
      role,
      userBusinessId,
      permissions: temp?.permissions ?? [],
      //@ts-ignore
    };
  }
}
