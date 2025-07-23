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
      {
        method: 'GET',
        apiPath: '/api/v1/sav/domains',
        name: 'get active domains',
        module: 'SAV',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/sav/auction-sales',
        name: 'get auction sales',
        module: 'SAV',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/sav/premium-sales',
        name: 'get premium sales',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/remove-domain-sale',
        name: 'remove domain for sale',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/submit-auth-code',
        name: 'submit auth code',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/update-auto-renew',
        name: 'update auto renewal',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/update-sale-price',
        name: 'update domain sale price',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/update-nameservers',
        name: 'update domain nameservers',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/update-all-nameservers',
        name: 'update all sav nameservers',
        module: 'SAV',
      },      
      {
        method: 'POST',
        apiPath: '/api/v1/sav/update-privacy',
        name: 'update domain privacy',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/update-whois',
        name: 'update whois contact',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav/list-domain-sale',
        name: 'list domain for sale',
        module: 'SAV',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/sav/pricing',
        name: 'get domain pricing',
        module: 'SAV',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/sav',
        name: 'create sav',
        module: 'SAV',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/sav',
        name: 'get sav list',
        module: 'SAV',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/sav/:id',
        name: 'get sav by id',
        module: 'SAV',
      },
      {
        method: 'PATCH',
        apiPath: '/api/v1/sav/:id',
        name: 'update sav',
        module: 'SAV',
      },
      {
        method: 'DELETE',
        apiPath: '/api/v1/sav/:id',
        name: 'delete sav',
        module: 'SAV',
      },

      {
        method: 'POST',
        apiPath: '/api/v1/spaceship',
        name: 'create spaceship',
        module: 'SPACESHIP',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/spaceship',
        name: 'get spaceship list',
        module: 'SPACESHIP',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/spaceship/:id',
        name: 'get spaceship by id',
        module: 'SPACESHIP',
      },
      {
        method: 'PATCH',
        apiPath: '/api/v1/spaceship/:id',
        name: 'update spaceship',
        module: 'SPACESHIP',
      },
      {
        method: 'DELETE',
        apiPath: '/api/v1/spaceship/:id',
        name: 'delete spaceship',
        module: 'SPACESHIP',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/spaceship/domains/:id',
        name: 'get spaceship domain list',
        module: 'SPACESHIP',
      },
      {
        method: 'GET',
        apiPath: '/api/v1/spaceship/domains/:conect_id/detail/:domain',
        name: 'get spaceship domain detail',
        module: 'SPACESHIP',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/spaceship/domains/update_nameservers',
        name: 'update spaceship nameservers',
        module: 'SPACESHIP',
      },
      {
        method: 'POST',
        apiPath: '/api/v1/spaceship/domains/update_all_nameservers',
        name: 'update all spaceship nameservers',
        module: 'SPACESHIP',
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
