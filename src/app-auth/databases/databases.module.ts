import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Permission,
  PermissionSchema,
} from "src/app-auth/permissions/schemas/permission.schemas";
import {
  Role,
  RoleSchema,
} from "src/app-auth/roles/schemas/role.schemas";
import {
  User,
  UserSchema,
} from "src/modules/users/schemas/user.schema";
import { UsersService } from "src/modules/users/users.service";

import { PublicServiceService } from "src/public-service/public-service.service";
import { DatabasesController } from "./databases.controller";
import { DatabasesService } from "./databases.service";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DatabasesController],
  providers: [
    DatabasesService,
    UsersService,
    PublicServiceService,
  ],
})
export class DatabasesModule {}
