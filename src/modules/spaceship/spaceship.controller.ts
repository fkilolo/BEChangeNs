import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
import { SpaceshipService } from './spaceship.service';
import { CreateSpaceshipDto } from './dto/create-spaceship.dto';
import { UpdateSpaceshipDto } from './dto/update-spaceship.dto';
import { ResponseMessage } from 'src/shared/decorators/customize.decorator';
import { UpdateNameserversDto } from './dto/update-nameservers.dto';
import { UpdateAllNameserversDto } from './dto/update-all-nameservers.dto';

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

  @Get('domains/:id')
  @ResponseMessage('Lấy danh sách domain từ spaceship thành công')
  @ApiOperation({ summary: 'Lấy danh sách domain từ spaceship connect' })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  getDomains(
    @Param('id') id: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('orderBy') orderBy?: string
  ) {
    return this.spaceshipService.getDomains(id, take, skip, orderBy);
  }

  @Post('domains/update_nameservers')
  @ResponseMessage('Cập nhật nameserver cho domain thành công')
  @ApiOperation({ summary: 'Cập nhật nameserver cho nhiều domain qua spaceship' })
  @ApiBody({ type: UpdateNameserversDto })
  updateNameservers(@Body() body: UpdateNameserversDto) {
    return this.spaceshipService.updateNameservers(body);
  }

  @Post('domains/update_all_nameservers')
  @ResponseMessage('Cập nhật nameserver cho toàn bộ domain thành công')
  @ApiOperation({ summary: 'Cập nhật nameserver cho toàn bộ domain qua spaceship' })
  @ApiBody({ type: UpdateAllNameserversDto })
  async updateAllNameservers(@Body() body: UpdateAllNameserversDto) {
    return this.spaceshipService.updateAllNameservers(body);
  }
} 