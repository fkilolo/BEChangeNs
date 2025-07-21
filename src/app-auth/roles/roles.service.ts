import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ADMIN_ROLE } from 'src/app-auth/databases/sample';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schemas';
import { IUser } from '@/modules/users/users.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService,
  ) {}

  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isExist = await this.roleModel.findOne({ name: createRoleDto.name });
    if (isExist) {
      throw new BadRequestException(`role name ${createRoleDto.name} đã tồn tại!`);
    }

    try {
      const role = await this.roleModel.create({
        ...createRoleDto,
        createdBy: {
          _id: user._id,
          name: user.userName,
        },
      });
      return role;
    } catch (error) {
      return error;
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findAllRole() {
    const roles = await this.roleModel.find().select('_id name');
    return roles;
  }

  async findOne(id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('not found role');
      }

      return (await this.roleModel.findById(id)).populate({
        path: 'permissions',
        select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
      });
    } catch (error) {
      return error;
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found role');
    }
  
    try {
      const role = await this.roleModel.updateOne(
        { _id: id },
        {
          $set: {
            ...updateRoleDto,
            updatedBy: {
              _id: user._id,
              name: user.userName,
            },
          },
        },
      );
  
      return role;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Update role failed');
    }
  }
  

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';

    const foundUser = await this.roleModel.findById(id);
    if (foundUser.name === ADMIN_ROLE) {
      throw new BadRequestException(`không thể xoá role ${ADMIN_ROLE}`);
    }

    await this.roleModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          name: user.userName,
        },
      },
    );
    return await (this.roleModel as any).delete({ _id: id });
  }
}
