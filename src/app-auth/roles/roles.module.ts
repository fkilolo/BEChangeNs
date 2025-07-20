import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schemas';
import { RoleSeeder } from './roles.seed';
import { Permission, PermissionSchema } from '../permissions/schemas/permission.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }, { name: Permission.name, schema: PermissionSchema }])],
  controllers: [RolesController],
  providers: [RolesService, RoleSeeder],  
  exports: [RolesService]
})
export class RolesModule {}
