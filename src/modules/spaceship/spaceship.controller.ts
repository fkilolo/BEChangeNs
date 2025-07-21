import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SpaceshipService } from './spaceship.service';
import { CreateSpaceshipDto } from './dto/create-spaceship.dto';
import { UpdateSpaceshipDto } from './dto/update-spaceship.dto';

@ApiTags('Spaceship')
@Controller('spaceship')
export class SpaceshipController {
  constructor(private readonly spaceshipService: SpaceshipService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới spaceship connect' })
  create(@Body() createDto: CreateSpaceshipDto) {
    return this.spaceshipService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách spaceship connect' })
  findAll(
    @Query('current') current: number = 1,
    @Query('pageSize') pageSize: number = 10
  ) {
    return this.spaceshipService.findAll(+current, +pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết spaceship connect' })
  findOne(@Param('id') id: string) {
    return this.spaceshipService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật spaceship connect' })
  update(@Param('id') id: string, @Body() updateDto: UpdateSpaceshipDto) {
    return this.spaceshipService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa spaceship connect' })
  remove(@Param('id') id: string) {
    return this.spaceshipService.remove(id);
  }
} 