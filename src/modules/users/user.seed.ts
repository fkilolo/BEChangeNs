// src/modules/users/user.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Role } from '../../app-auth/roles/schemas/role.schemas';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async seed() {
    // Step 1: Ensure default roles exist (for non-admin users)
    const defaultRoles = [
      { name: 'USERS', description: 'Default user role', isActive: true },
    ];

    const roleMap = new Map<string, string>();

    for (const role of defaultRoles) {
      let existingRole = await this.roleModel.findOne({ name: role.name });
      if (!existingRole) {
        existingRole = await this.roleModel.create(role);
        console.log(`✅ Created role: ${role.name}`);
      } else {
        console.log(`⚠️ Role "${role.name}" already exists. Skipping.`);
      }
      roleMap.set(role.name, existingRole._id.toString());
    }

    // Step 2: Lấy role Super Admin
    const superAdminRole = await this.roleModel.findOne({ name: 'Super Admin' });
    if (!superAdminRole) {
      console.error('❌ Role "Super Admin" not found. Please run RoleSeeder first.');
      return;
    }

    // Step 3: Create users
    const users = [
      {
        userName: 'admin@gmail.com',
        email: 'admin@gmail.com',
        password: '$2a$10$WcYGf6anprJ1oilys4UesOmCjppwjaLZIAioVXE0lod9.Lw0rMSuu', // hashed "admin123"
        role: superAdminRole._id,
        phone: '0123456789',
        address: '123 Main Street',
        image: 'https://example.com/admin.png',
        isActive: true,
      },
      {
        userName: 'user@gmail.com',
        email: 'user@gmail.com',
        password: '$2a$10$WcYGf6anprJ1oilys4UesOmCjppwjaLZIAioVXE0lod9.Lw0rMSuu',
        role: roleMap.get('USERS'),
        phone: '0987654321',
        address: '456 Secondary Street',
        image: 'https://example.com/user.png',
        isActive: true,
      },
    ];

    for (const user of users) {
      const exists = await this.userModel.exists({ email: user.email });
      if (!exists) {
        await this.userModel.create(user);
        console.log(`✅ Created user: ${user.email} | pass: admin123`);
      } else {
        console.log(`⚠️ User "${user.email}" already exists. Skipping.`);
      }
    }

    console.log('🎉 User and role seeding completed!');
  }
}
