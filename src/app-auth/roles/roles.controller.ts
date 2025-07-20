import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/shared/decorators/customize.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { IUser } from '@/modules/users/users.interface';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ResponseMessage('Tạo role thành công')
  @ApiOperation({ summary: 'Tạo role' })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Hiển thị role thành công')
  @ApiOperation({ summary: 'Danh sách role' })
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() qs: string) {
    return this.rolesService.findAll(+current, +pageSize, qs);
  }

  @ResponseMessage('Hiển thị danh sách team thành công')
  @ApiOperation({ summary: 'Hiển thị toàn bộ role' })
  @Get('getAllRole')
  findAllRole() {
    return this.rolesService.findAllRole();
  }

  @ResponseMessage('Hiển thị chi tiết role thành công')
  @ApiOperation({ summary: 'Chi tiết role' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @ResponseMessage('Cập nhật role thành công')
  @ApiOperation({ summary: 'Cập nhật role' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @ResponseMessage('Xóa role thành công')
  @ApiOperation({ summary: 'Xóa role' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
