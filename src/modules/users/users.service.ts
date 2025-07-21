import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import aqp from "api-query-params";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import mongoose from "mongoose";
import { SoftDeleteModel } from "@/shared/types/mongoose-soft-delete.type";
import {
  EMAIL_ADMIN,
  ROLE_TT_TP,
  USER_ROLE,
} from "src/app-auth/databases/sample";
import {
  Role,
  RoleDocument,
} from "src/app-auth/roles/schemas/role.schemas";
import { CreateUserDto } from "./dto/create-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDocument, User as UserM } from "./schemas/user.schema";
import { IUser } from "./users.interface";
import { User } from "@/shared/decorators/customize.decorator";
import { PublicServiceService } from "@/public-service/public-service.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,


    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,
    private readonly httpService: HttpService,
    private publicServiceService: PublicServiceService
  ) {}

  getHashPassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    createUserDto.password = this.getHashPassword(createUserDto.password);
    const isExist = await this.userModel.findOne({
      userName: createUserDto.userName,
      isDeleted: false,
    });
    if (isExist) {
      throw new BadRequestException(
        `Tài khoản ${createUserDto.userName} đã tồn tại!`
      );
    }

    try {
      const resUser = await this.userModel.create({
        ...createUserDto,
        createdBy: {
          _id: user._id,
          name: user.userName,
        },
      });
      return {
        _id: resUser._id,
        createdAt: resUser.createdAt,
      };
    } catch (error) {
      return error;
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password, role, telegram } = registerUserDto;

    const isExist = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (isExist) {
      throw new BadRequestException(
        `email ${registerUserDto.email} đã tồn tại!`
      );
    }

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password);
    const resUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      role: userRole?._id,
      telegram,
    });
    return resUser;
  }

  async findAll(current: number, pageSize: number, qs: string, user: IUser) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;


    if (filter.role) {
      const role = await this.roleModel.findOne({ name: filter.role });
      if (role) {
        filter.role = role._id;
      }
    }

    if (user?.role?.name === ROLE_TT_TP) {
      filter.team = user?.team?._id;
    }

    let offset = (+current - 1) * +pageSize;
    let defaultLimit = +pageSize ? +pageSize : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select("-password -refreshToken")
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
    if (!mongoose.Types.ObjectId.isValid(id)) return "not found user";
    try {
      const user = await this.userModel
        .findById(id)
        .select("-password")
        .populate({
          path: "role",
          select: { _id: 1, name: 1 },
        })
        .populate({
          path: "team",
          select: { _id: 1, name: 1 },
        });
      return user;
    } catch (error) {
      return error.message;
    }
  }

  async findOneByUsername(username: string) {
    return await this.userModel
      .findOne({ userName: username  })//isDeleted: false, status: 1
      .populate({
        path: "role",
        select: { name: 1 },
      });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    if (updateUserDto.password) {
      updateUserDto.password = this.getHashPassword(updateUserDto.password);
    }

    const resUser = await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updateBy: {
          _id: user._id,
          name: user.userName,
        },
      }
    );
    return resUser;
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return "not found user";

    const foundUser = await this.userModel.findById(id);
    if (foundUser && foundUser.email === EMAIL_ADMIN) {
      throw new BadRequestException(`không thể xoá tài khoản ${EMAIL_ADMIN}`);
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          name: user.userName,
        },
      }
    );
    return await (this.userModel as any).delete({ _id: id });
  }

  async updateUserToken(refreshToken: string, id: string) {
    const resUser = await this.userModel.updateOne(
      { _id: id },
      { refreshToken }
    );
    return resUser;
  }

  async findUserToken(refreshToken: string) {
    return await this.userModel.findOne({ refreshToken }).populate({
      path: "role",
      select: { name: 1 },
    });
  }

  async findAllUser() {
    const users = await this.userModel
      .find()
      .select("_id userName userBusinessId");
    return users;
  }

  async synchronizeUsers(user?: IUser) {
    const token = await this.publicServiceService.GetTokenBusiness();

    let config = {
      method: "GET",
      url: `${this.configService.get<string>("URL_BUSINESS")}/auth/user/users/manager?pageSize=max&pageIndex=1`,
      headers: {
        authorization: `Bearer ${token}`,
        referer: this.configService.get<string>("CLIENT_DEV_URL"),
      },
    };
    try {
      const response = await this.httpService.axiosRef(config);

      if (response.statusText === "OK") {
        if (response.data.data.length > 0) {
          const userRole = await this.roleModel.findOne({ name: USER_ROLE });
          const users = await this.userModel.find();

          const listUserInsert = [];

          response.data.data.forEach((item) => {
            const isExistUser = users.find((x) => x.userName === item.username);
            if (isExistUser) {
              return;
            }

          
            listUserInsert.push({
              userName: item?.username,
              password: this.getHashPassword(
                this.configService.get<string>("INIT_PASSWORD")
              ),
              role: userRole._id,
              userBusinessId: item._id,
              position: item?.manager?.position,
              telegramName: item?.manager?.telegramName,
              status: item?.status,
              createdBy: {
                _id: user?._id,
                email: user?.userName,
              },
            });
          });

          const listUser = await this.userModel.insertMany(listUserInsert);
          return listUser;
        }
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async synchronizeUserClose() {
    const token = await this.publicServiceService.GetTokenBusiness();

    let config = {
      method: "GET",
      url: `${this.configService.get<string>("URL_BUSINESS")}/auth/user/users/manager?pageSize=max&pageIndex=1`,
      headers: {
        authorization: `Bearer ${token}`,
        referer: this.configService.get<string>("CLIENT_DEV_URL"),
      },
    };
    try {
      const response = await this.httpService.axiosRef(config);
      if (response.statusText === "OK") {
        if (response.data.data.length > 0) {
          const listUserInsert = [];
          //find user and team
          const users = await this.userModel.find();
          const userRole = await this.roleModel.findOne({ name: USER_ROLE });

          response.data.data.forEach(async (item) => {
            //check user
            const isExistUser = users.find(
              (x) => x.userBusinessId === item._id
            );

            if (isExistUser) {
              if (item.status !== 1) {
                await this.userModel.updateOne(
                  { userBusinessId: item._id },
                  {
                    status: 0,
                  }
                );
              } else {
                
                
              }
            } else {
              //chỉ tạo mới khi username này chưa tồn tại
              const isExistUserName = users.find(
                (x) => x.userName === item.username
              );
              if (!isExistUserName) {
                //check user này đã bị xóa
                const isUserDelete = await this.userModel.findOne({
                  userName: item?.username,
                  isDeleted: true,
                });
                if (!isUserDelete) {
                 

                  listUserInsert.push({
                    userName: item?.username,
                    password: this.getHashPassword(
                      this.configService.get<string>("INIT_PASSWORD")
                    ),
                    role: userRole._id,
                    userBusinessId: item._id,
                    position: item?.manager?.position,
                    telegramName: item?.manager?.telegramName,
                    status: item?.status,
                  });
                }
              }
            }
          });

          if (listUserInsert.length > 0) {
            await this.userModel.insertMany(listUserInsert);
          }
        }
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
