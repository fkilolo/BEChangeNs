import { Permission } from './schemas/permission.schemas'; // Đảm bảo import đúng path
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PermissionSeederService implements OnModuleInit {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
  }

  async seedPermissions() {
    const permissions = [
      { method: 'GET', apiPath: '/api/v1/', name: 'get app', module: 'APP' },
      {
        method: 'POST',
        apiPath: '/api/v1/users',
        name: 'create user',
        module: 'USERS',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/users',
        name: 'get users',
        module: 'USERS',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/users/getSynchronizeUser',
        name: 'get sync user',
        module: 'USERS',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/users/getAllUser',
        name: 'get all user',
        module: 'USERS',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/users/:id',
        name: 'get user by id',
        module: 'USERS',
      },
      {
        method: 'PATCH',
        apiPath: '/api/v1/users/:id',
        name: 'update user',
        module: 'USERS',
      },
      {
        method: 'DELETE',
        apiPath: '/api/v1/users/:id',
        name: 'delete user',
        module: 'USERS',
      },

      {
        method: 'POST',
        apiPath: '/api/v1/auth/login',
        name: 'login',
        module: 'AUTH',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/auth/register',
        name: 'register',
        module: 'AUTH',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/auth/account',
        name: 'get account',
        module: 'AUTH',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/auth/refresh',
        name: 'refresh token',
        module: 'AUTH',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/auth/logout',
        name: 'logout',
        module: 'AUTH',
      },

      {
        method: 'POST',
        apiPath: '/api/v1/roles',
        name: 'create role',
        module: 'ROLES',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/roles',
        name: 'get roles',
        module: 'ROLES',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/roles/getAllRole',
        name: 'get all roles',
        module: 'ROLES',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/roles/:id',
        name: 'get role by id',
        module: 'ROLES',
      },
      {
        method: 'PATCH',
        apiPath: '/api/v1/roles/:id',
        name: 'update role',
        module: 'ROLES',
      },
      {
        method: 'DELETE',
        apiPath: '/api/v1/roles/:id',
        name: 'delete role',
        module: 'ROLES',
      },

      {
        method: 'POST',
        apiPath: '/api/v1/permissions',
        name: 'create permission',
        module: 'PERMISSIONS',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/permissions',
        name: 'get permissions',
        module: 'PERMISSIONS',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/permissions/:id',
        name: 'get permission by id',
        module: 'PERMISSIONS',
      },
      {
        method: 'PATCH',
        apiPath: '/api/v1/permissions/:id',
        name: 'update permission',
        module: 'PERMISSIONS',
      },
      {
        method: 'DELETE',
        apiPath: '/api/v1/permissions/:id',
        name: 'delete permission',
        module: 'PERMISSIONS',
      },
      
        
    ];

    for (const permission of permissions) {
      const exists = await this.permissionModel.findOne({
        apiPath: permission.apiPath,
        method: permission.method,
      });
      if (!exists) {
        await this.permissionModel.create(permission);
      }
    }

    console.log(`[Seeder] Permissions created/verified: ${permissions.length}`);
  }
}
