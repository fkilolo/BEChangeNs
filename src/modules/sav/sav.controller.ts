import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SavService } from './sav.service';
import { ResponseMessage } from '@/decorator/customize';
import { User } from '@/shared/decorators/customize.decorator';
import { IUser } from '../users/users.interface';
import { CreateSavDto } from './dto/create-sav.dto';
import { UpdateSavDto } from './dto/update-sav.dto';
import { JwtAuthGuard } from '@/app-auth/auth/jwt-auth.guard';

@ApiTags('Sav')
@Controller('sav')
export class SavController {
  constructor(private readonly savService: SavService) {}

  
  @Post()
  @ApiOperation({ summary: 'Tạo kết nối Sav' })
  create(@Body() createSavDto: CreateSavDto, @User() user: IUser) {
    return this.savService.create(createSavDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả kết nối Sav' })
  
  findAll(
  @Query("current") current: string,
  @Query("pageSize") pageSize: string,
  @Query() qs: string,
  @User() user: IUser) {
    return this.savService.findAll(+current, +pageSize, qs, user);
  }

  

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật kết nối Sav' })
  update(@Param('id') id: string, @Body() updateSavDto: UpdateSavDto) {
    return this.savService.update(id, updateSavDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá mềm kết nối Sav' })
  remove(@Param('id') id: string) {
    return this.savService.remove(id);
  }

  
  @Get('domains')
  @ApiOperation({ summary: 'Get active domains' })
  @ApiResponse({ status: 200, description: 'List of active domains' })
  getActiveDomains(@User() user: IUser) {
    return this.savService.getActiveDomains(user);
  }

  @Get('auction-sales')
  @ApiOperation({ summary: 'Get recent auction sales' })
  @ApiResponse({ status: 200, description: 'Recent auction sales' })
  getRecentAuctionSales(@User() user: IUser) {
    return this.savService.getRecentAuctionSales(user);
  }

  @Get('premium-sales')
  @ApiOperation({ summary: 'Get recent premium sales' })
  @ApiResponse({ status: 200, description: 'Recent premium domain sales' })
  getRecentPremiumSales(@User() user: IUser) {
    return this.savService.getRecentPremiumSales(user);
  }

  @Post('remove-domain-sale')
  @ApiOperation({ summary: 'Remove a domain from sale' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain_name'],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
      },
    },
  })
  removeDomainForSale(@Body('domain_name') domainName: string, @User() user: IUser) {
    return this.savService.removeDomainForSale(domainName, user);
  }

  @Post('submit-auth-code')
  @ApiOperation({ summary: 'Submit auth code to transfer domain' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain_name', 'auth_code'],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        auth_code: { type: 'string', example: 'ABCD-1234-EFGH' },
      },
    },
  })
  submitAuthCode(@Body() body: { domain_name: string; auth_code: string }, @User() user: IUser) {
    return this.savService.submitAuthCode(body.domain_name, body.auth_code, user);
  }

  @Post('update-auto-renew')
  @ApiOperation({ summary: 'Update auto-renew status for a domain' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain_name', 'enabled'],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        enabled: { type: 'boolean', example: true },
      },
    },
  })
  updateAutoRenewal(@Body() body: { domain_name: string; enabled: boolean }, @User() user: IUser) {
    return this.savService.updateAutoRenewal(body.domain_name, body.enabled, user);
  }

  @Post('update-sale-price')
  @ApiOperation({ summary: 'Update sale price of a domain' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain_name', 'sale_price'],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        sale_price: { type: 'number', example: 999.99 },
      },
    },
  })
  updateDomainForSalePrice(@Body() body: { domain_name: string; sale_price: number }, @User() user: IUser) {
    return this.savService.updateDomainForSalePrice(body.domain_name, body.sale_price, user);
  }

  @Post('update-nameservers')
  @ApiOperation({ summary: 'Update nameservers for a domain' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain_name', 'ns_1', 'ns_2'],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        ns_1: { type: 'string', example: 'ns1.sav.com' },
        ns_2: { type: 'string', example: 'ns2.sav.com' },
      },
    },
  })
  updateDomainNameservers(@Body() body: { domain_name: string; ns_1: string; ns_2: string }, @User() user: IUser) {
    return this.savService.updateDomainNameservers(body.domain_name, body.ns_1, body.ns_2, user);
  }

  @Post('update-all-nameservers')
  @ApiOperation({ summary: 'Cập nhật nameservers cho tất cả domain đang active' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['ns_1', 'ns_2'],
      properties: {
        ns_1: { type: 'string', example: 'ns1.sav.com' },
        ns_2: { type: 'string', example: 'ns2.sav.com' },
      },
    },
  })
  
  updateAllDomainNameservers(
    @Body() body: { ns_1: string; ns_2: string },
    @User() user: IUser,
  ) {
    return this.savService.updateAllDomainNameservers(body.ns_1, body.ns_2, user);
  }
  

  @Post('update-privacy')
  @ApiOperation({ summary: 'Update privacy protection for a domain' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain_name', 'enabled'],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        enabled: { type: 'boolean', example: true },
      },
    },
  })
  updateDomainPrivacy(@Body() body: { domain_name: string; enabled: boolean }, @User() user: IUser) {
    return this.savService.updateDomainPrivacy(body.domain_name, body.enabled, user);
  }


  @Post('update-whois')
  @ApiOperation({ summary: 'Update WHOIS contact information for a domain' })
  @ApiBody({
    required: true,
    description: 'Full WHOIS contact payload',
    schema: {
      type: 'object',
      required: [
        'domain_name',
        'name',
        'email_address',
        'street',
        'city',
        'country',
        'phone',
        'state',
        'postal_code',
      ],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        name: { type: 'string', example: 'John Doe' },
        organization: { type: 'string', example: 'Example Corp' },
        email_address: { type: 'string', example: 'john@example.com' },
        street: { type: 'string', example: '123 Main St' },
        city: { type: 'string', example: 'New York' },
        country: { type: 'string', example: 'US' },
        phone: { type: 'string', example: '+1234567890' },
        state: { type: 'string', example: 'NY' },
        postal_code: { type: 'string', example: '10001' },
        update_registrant: { type: 'boolean', example: true },
        update_tech: { type: 'boolean', example: false },
        update_admin: { type: 'boolean', example: true },
      },
    },
  })
  updateDomainWhoisContacts(@Body() body: any, @User() user: IUser) {
    return this.savService.updateDomainWhoisContacts(body, user);
  }



  @Post('list-domain-sale')
  @ApiOperation({ summary: 'List external domain for sale' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['domain_name', 'sale_price'],
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        sale_price: { type: 'number', example: 1200 },
      },
    },
  })
      listExternalDomainForSale(@Body() body: { domain_name: string; sale_price: number }, @User() user: IUser) {
    return this.savService.listExternalDomainForSale(body.domain_name, body.sale_price, user);
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Get domain pricing list' })
  @ApiResponse({ status: 200, description: 'Pricing for different TLDs' })
    getDomainPricing(@User() user: IUser) {
    return this.savService.getDomainPricing(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết kết nối Sav' })
  async findOne(@Param('id') id: string) {
    const data = await this.savService.findOne(id);
    if (!data) throw new NotFoundException('Không tìm thấy kết nối Sav');
    return data;
  }
}
