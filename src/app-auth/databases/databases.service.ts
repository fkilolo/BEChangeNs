import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import {
  Permission,
  PermissionDocument,
} from "src/app-auth/permissions/schemas/permission.schemas";
import {
  Role,
  RoleDocument,
} from "src/app-auth/roles/schemas/role.schemas";
import {
  User,
  UserDocument,
} from "src/modules/users/schemas/user.schema";
import { UsersService } from "src/modules/users/users.service";
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from "./sample";

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,


    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const evn = this.configService.get<string>("NODE_ENV");
    if (evn === "development") {
      const countUser = await this.userModel.countDocuments({});
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});

      //create permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
        //bulk create
      }

      // create role
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select("_id");
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: "Admin thì full quyền :v",
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: "Người dùng/Ứng viên sử dụng hệ thống",
            isActive: true,
            permissions: [], //không set quyền, chỉ cần add ROLE
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        await this.userModel.insertMany([
          {
            userName: "administrator",
            password: this.userService.getHashPassword(
              this.configService.get<string>("INIT_PASSWORD")
            ),
            role: adminRole?._id,
          },
        ]);
        await this.userService.synchronizeUsers();
      }

      // if (
      //   countUser > 0 &&
      //   countRole > 0 &&
      //   countPermission > 0 &&
      //   countTeam > 0 &&
      //   countBrand > 0 &&
      //   countDomain > 0
      // ) {
      //   this.logger.log(">>> ALREADY INIT SAMPLE DATA...");
      // }
      if (
        countUser > 0 &&
        countRole > 0 &&
        countPermission > 0 
      ) {
        this.logger.log(">>> ALREADY INIT SAMPLE DATA...");
      }
    }
  }
}
