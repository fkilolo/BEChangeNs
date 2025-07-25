import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp from "api-query-params";
import mongoose from "mongoose";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { Permission, PermissionDocument } from "./schemas/permission.schemas";
import { IUser } from "@/modules/users/users.interface";
import { SoftDeleteModel } from '@/shared/types/mongoose-soft-delete.type';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const isExist = await this.permissionModel.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
      isDeleted: false,
    });
    if (isExist) {
      throw new BadRequestException(
        `Permission với apiPath là ${createPermissionDto.apiPath}, method ${createPermissionDto.method} đã tồn tại!`
      );
    }

    try {
      const permission = await this.permissionModel.create({
        ...createPermissionDto,
        createdBy: {
          _id: user._id,
          name: user.userName,
        },
      });
      return permission;
    } catch (error) {
      return error;
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * +pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "not found permission";
    const permission = await this.permissionModel.findById(id);
    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser
  ) {
    try {
      const permission = await this.permissionModel.updateOne(
        { _id: id },
        {
          ...updatePermissionDto,
          updatedBy: {
            _id: user._id,
            name: user.userName,
          },
        }
      );
      return permission;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "Định dạng ID không hợp lệ";

    const foundPermission = await this.permissionModel.findById(id);
    if (!foundPermission) {
      throw new BadRequestException(`Quyền hạn không tồn tại`);
    }

    await this.permissionModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          name: user.userName,
        },
      }
    );
    return await (this.permissionModel as any).delete({ _id: id });
  }
}
