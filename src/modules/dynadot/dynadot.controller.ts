import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DynadotService } from './dynadot.service';
import { CreateDynadotDto } from './dto/create-dynadot.dto';
import { UpdateDynadotDto } from './dto/update-dynadot.dto';
import { ResponseMessage, User } from 'src/shared/decorators/customize.decorator';
import { IUser } from 'src/modules/users/users.interface';

@ApiTags('Dynadot')
@Controller('dynadot')
export class DynadotController {
  constructor(private readonly dynadotService: DynadotService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới dynadot connect' })
  create(@Body() createDto: CreateDynadotDto, @User() user: IUser) {
    return this.dynadotService.create(createDto, user);
  }

  @Get()
  @ResponseMessage('Hiển thị danh sách dynadot connect thành công')
  @ApiOperation({ summary: 'Lấy danh sách dynadot connect' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Tìm kiếm theo tên connect' })
  findAll(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search?: string
  ) {
    return this.dynadotService.findAll(+current, +pageSize, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết dynadot connect' })
  findOne(@Param('id') id: string) {
    return this.dynadotService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật dynadot connect' })
  update(@Param('id') id: string, @Body() updateDto: UpdateDynadotDto) {
    return this.dynadotService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa dynadot connect' })
  remove(@Param('id') id: string) {
    return this.dynadotService.remove(id);
  }
} 