import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schemas';
import { Model } from 'mongoose';
import { Permission } from '../permissions/schemas/permission.schemas';
@Injectable()
export class RoleSeeder {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,

    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async seed() {
    const roleName = 'Super Admin';

    // Check if role already exists
    const existed = await this.roleModel.findOne({ name: roleName });
    if (existed) {
      console.log(`[Seeder] Role '${roleName}' đã tồn tại`);
      return;
    }

    // Lấy toàn bộ permission _id
    const allPermissions = await this.permissionModel.find().select('_id');
    const permissionIds = allPermissions.map((p) => p._id);

    // Tạo role mới với toàn bộ permission
    await this.roleModel.create({
      name: roleName,
      description: 'Quyền cao nhất hệ thống',
      isActive: true,
      permissions: permissionIds,
    });

    console.log(`[Seeder] Tạo role '${roleName}' thành công với ${permissionIds.length} permissions`);
  }
}
