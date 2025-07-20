import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  Public,
  ResponseMessage,
  User,
} from "src/shared/decorators/customize.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser } from "./users.interface";
import { UsersService } from "./users.service";

@ApiTags("User")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage("Tạo tài khoản thành công thành công")
  @ApiOperation({ summary: "Tạo tài khoản" })
  @Post()
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get("")
  @ResponseMessage("Hiển thị danh sách tài khoản thành công")
  @ApiOperation({ summary: "Danh sách tài khoản" })
  findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
    @User() user: IUser
  ) {
    return this.usersService.findAll(+current, +pageSize, qs, user);
  }

  @ResponseMessage("Đồng bộ tài khoản thành công")
  @ApiOperation({ summary: "Đồng bộ tài khoản" })
  @Get("getSynchronizeUser")
  getSynchronizeUser(@User() user: IUser) {
    return this.usersService.synchronizeUsers(user);
  }

  @ResponseMessage("Hiển thị danh sách user thành công")
  @ApiOperation({ summary: "Hiển thị toàn bộ user" })
  @Get("getAllUser")
  getAllUser() {
    return this.usersService.findAllUser();
  }

  @ResponseMessage("Hiển thị chi tiết tài khoản thành công")
  @ApiOperation({ summary: "Chi tiết tài khoản" })
  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage("Cập nhật tài khoản thành công")
  @ApiOperation({ summary: "Cập nhật tài khoản" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @ResponseMessage("Xóa tài khoản thành công")
  @ApiOperation({ summary: "Xóa tài khoản" })
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
