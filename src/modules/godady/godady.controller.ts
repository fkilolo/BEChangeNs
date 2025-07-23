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
import { GodadyService } from './godady.service';
import { CreateGodadyDto } from './dto/create-godady.dto';
import { UpdateGodadyDto } from './dto/update-godady.dto';
import { User } from '@/shared/decorators/customize.decorator';
import { IUser } from '../users/users.interface';

@ApiTags('Godady')
@Controller('godady')
export class GodadyController {
  constructor(private readonly godadyService: GodadyService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo kết nối Godady' })
  create(@Body() dto: CreateGodadyDto, @User() user: IUser) {
    return this.godadyService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả kết nối Godady' })
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
    @User() user: IUser,
  ) {
    return this.godadyService.findAll(+current, +pageSize, qs, user);
  }

 

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật kết nối Godady' })
  update(@Param('id') id: string, @Body() dto: UpdateGodadyDto) {
    return this.godadyService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá mềm kết nối Godady' })
  remove(@Param('id') id: string) {
    return this.godadyService.remove(id);
  }

  @Get('domains/list')
  @ApiOperation({ summary: 'Lấy danh sách domain từ GoDaddy' })
  getDomains(@User() user: IUser) {
    return this.godadyService.getDomains(user);
  }

  @Post('update-nameserver')
  @ApiOperation({ summary: 'Cập nhật nameserver cho một domain' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain', 'ns1', 'ns2'],
      properties: {
        domain: { type: 'string', example: 'example.com' },
        ns1: { type: 'string', example: 'ns1.domain.com' },
        ns2: { type: 'string', example: 'ns2.domain.com' },
      },
    },
  })
  updateNameserver(@Body() body: { domain: string; ns1: string; ns2: string }, @User() user: IUser) {
    return this.godadyService.updateDomainNameserver(body.domain, body.ns1, body.ns2, user);
  }

  @Post('update-nameservers')
  @ApiOperation({ summary: 'Cập nhật nameserver cho danh sách domain' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domainList', 'ns1', 'ns2'],
      properties: {
        domainList: {
          type: 'array',
          items: { type: 'string', example: 'example.com' },
        },
        ns1: { type: 'string', example: 'ns1.domain.com' },
        ns2: { type: 'string', example: 'ns2.domain.com' },
      },
    },
  })
  updateNameservers(
    @Body() body: { domainList: string[]; ns1: string; ns2: string },
    @User() user: IUser,
  ) {
    return this.godadyService.updateDomainNameserversBulk(body.domainList, body.ns1, body.ns2, user);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết kết nối Godady' })
  async findOne(@Param('id') id: string) {
    const data = await this.godadyService.findOne(id);
    if (!data) throw new NotFoundException('Không tìm thấy kết nối GoDaddy');
    return data;
  }
}
