import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Role,
  RoleSchema,
} from "src/app-auth/roles/schemas/role.schemas";
import { PublicServiceModule } from "src/public-service/public-service.module";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UserSeeder } from "./user.seed"; // <-- Thêm dòng này

@Module({
  imports: [
    HttpModule,
    PublicServiceModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserSeeder], // <-- Thêm UserSeeder
  exports: [UsersService, UserSeeder],   // <-- Thêm UserSeeder
})
export class UsersModule {}
