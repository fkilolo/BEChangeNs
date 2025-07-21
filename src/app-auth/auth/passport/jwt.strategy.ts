import { RolesService } from "@/app-auth/roles/roles.service";
import { IUser } from "@/modules/users/users.interface";
import { UsersService } from "@/modules/users/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
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
  
    // Lấy _id của role dù là ObjectId hay object có _id
    const roleId = typeof role === 'object' && role !== null ? (role as any)._id : role;
  
    // Tìm role từ DB
    const roleDoc = await this.rolesService.findOne(roleId);
    if (!roleDoc) {
      throw new UnauthorizedException('Role không tồn tại');
    }
  
    // Chuyển về plain object nếu là mongoose document
    const roleData = roleDoc.toObject?.() ?? roleDoc;
  
    // Trả về thông tin user kèm quyền
    return {
      _id,
      userName,
      userBusinessId,
      role: roleData,
      permissions: roleData.permissions || [],
    };
  }
  
  
}
