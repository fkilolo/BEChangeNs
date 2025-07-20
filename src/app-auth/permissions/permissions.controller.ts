import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, User } from 'src/shared/decorators/customize.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';
import { IUser } from '@/modules/users/users.interface';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ResponseMessage('Tạo vai trò thành công')
  @ApiOperation({ summary: 'Tạo vài trò' })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage('Hiển thị danh sách vai trò thành công')
  @ApiOperation({ summary: 'Danh sách vài trò' })
  findAll(@Query('current') current: string, @Query('pageSize') pageSize: string, @Query() qs: string) {
    return this.permissionsService.findAll(+current, +pageSize, qs);
  }

  @ResponseMessage('Hiển thị chi tiết vai trò thành công')
  @ApiOperation({ summary: 'Chi tiết vài trò' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @ResponseMessage('Cập nhật vai trò thành công')
  @ApiOperation({ summary: 'Cập nhật vài trò' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @ResponseMessage('Xóa vai trò thành công')
  @ApiOperation({ summary: 'Xóa vài trò' })
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.remove(id, user);
  }
}
