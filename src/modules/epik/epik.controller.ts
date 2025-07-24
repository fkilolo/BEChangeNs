import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { EpikService } from './epik.service';
import { CreateEpikDto } from './dto/create-epik.dto';
import { UpdateEpikDto } from './dto/update-epik.dto';
import { User } from '@/shared/decorators/customize.decorator';
import { IUser } from '../users/users.interface';

@ApiTags('Epik')
@Controller('epik')
export class EpikController {
  constructor(private readonly epikService: EpikService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo kết nối Epik' })
  create(@Body() dto: CreateEpikDto, @User() user: IUser) {
    return this.epikService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả kết nối Epik' })
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
    @User() user: IUser,
  ) {
    return this.epikService.findAll(+current, +pageSize, qs, user);
  }

  @Get('domains/list/:id')
  @ApiOperation({ summary: 'Lấy danh sách domain từ Epik' })
  getDomains(@Param('id') id: string, @User() user: IUser) {
    return this.epikService.getDomains(id, user);
  }

  @Post('update-nameserver/:id')
  @ApiOperation({ summary: 'Cập nhật nameserver cho một domain Epik' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain', 'ns1', 'ns2'],
      properties: {
        domain: { type: 'string', example: 'test.com' },
        ns1: { type: 'string', example: 'ns1.epik.com' },
        ns2: { type: 'string', example: 'ns2.epik.com' },
      },
    },
  })
  updateNameserver(@Param('id') id: string, @Body() body: { domain: string; ns1: string; ns2: string }, @User() user: IUser) {
    return this.epikService.updateNameserver(id, body.domain, body.ns1, body.ns2, user);
  }

  @Post('update-nameservers/:id')
  @ApiOperation({ summary: 'Cập nhật nameserver cho danh sách domain Epik' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domainList', 'ns1', 'ns2'],
      properties: {
        domainList: {
          type: 'array',
          items: { type: 'string', example: 'test.com' },
        },
        ns1: { type: 'string', example: 'ns1.epik.com' },
        ns2: { type: 'string', example: 'ns2.epik.com' },
      },
    },
  })
  updateNameservers(@Param('id') id: string, @Body() body: { domainList: string[]; ns1: string; ns2: string }, @User() user: IUser) {
    return this.epikService.updateNameserversBulk(id, body.domainList, body.ns1, body.ns2, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết kết nối Epik' })
  async findOne(@Param('id') id: string) {
    const data = await this.epikService.findOne(id);
    if (!data) throw new NotFoundException('Không tìm thấy kết nối Epik');
    return data;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật kết nối Epik' })
  update(@Param('id') id: string, @Body() dto: UpdateEpikDto) {
    return this.epikService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá mềm kết nối Epik' })
  remove(@Param('id') id: string) {
    return this.epikService.remove(id);
  }

  @Get('domains/:domain/info/:id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết domain từ Epik' })
  getDomainInfo(@Param('domain') domain: string, @Param('id') id: string, @User() user: IUser) {
    return this.epikService.getDomainInfo(id, domain, user);
  }

}
