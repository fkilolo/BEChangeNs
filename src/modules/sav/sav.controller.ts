import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SavService } from './sav.service';

@ApiTags('Sav')
@Controller('sav')
export class SavController {
  constructor(private readonly savService: SavService) {}

  @Get('domains')
  @ApiOperation({ summary: 'Get active domains' })
  @ApiResponse({ status: 200, description: 'List of active domains' })
  getActiveDomains() {
    return this.savService.getActiveDomains();
  }

  @Get('auction-sales')
  @ApiOperation({ summary: 'Get recent auction sales' })
  @ApiResponse({ status: 200, description: 'Recent auction sales' })
  getRecentAuctionSales() {
    return this.savService.getRecentAuctionSales();
  }

  @Get('premium-sales')
  @ApiOperation({ summary: 'Get recent premium sales' })
  @ApiResponse({ status: 200, description: 'Recent premium domain sales' })
  getRecentPremiumSales() {
    return this.savService.getRecentPremiumSales();
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
  removeDomainForSale(@Body('domain_name') domainName: string) {
    return this.savService.removeDomainForSale(domainName);
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
  submitAuthCode(@Body() body: { domain_name: string; auth_code: string }) {
    return this.savService.submitAuthCode(body.domain_name, body.auth_code);
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
  updateAutoRenewal(@Body() body: { domain_name: string; enabled: boolean }) {
    return this.savService.updateAutoRenewal(body.domain_name, body.enabled);
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
  updateDomainForSalePrice(@Body() body: { domain_name: string; sale_price: number }) {
    return this.savService.updateDomainForSalePrice(body.domain_name, body.sale_price);
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
  updateDomainNameservers(@Body() body: { domain_name: string; ns_1: string; ns_2: string }) {
    return this.savService.updateDomainNameservers(body.domain_name, body.ns_1, body.ns_2);
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
  updateDomainPrivacy(@Body() body: { domain_name: string; enabled: boolean }) {
    return this.savService.updateDomainPrivacy(body.domain_name, body.enabled);
  }

  @Post('update-whois')
  @ApiOperation({ summary: 'Update WHOIS contact information for a domain' })
  @ApiBody({
    description: 'Full WHOIS contact payload',
    schema: {
      type: 'object',
      properties: {
        domain_name: { type: 'string', example: 'example.com' },
        registrant: {
          type: 'object',
          example: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
          },
        },
      },
    },
  })
  updateDomainWhoisContacts(@Body() body: any) {
    return this.savService.updateDomainWhoisContacts(body);
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
  listExternalDomainForSale(@Body() body: { domain_name: string; sale_price: number }) {
    return this.savService.listExternalDomainForSale(body.domain_name, body.sale_price);
  }

  @Get('pricing')
  @ApiOperation({ summary: 'Get domain pricing list' })
  @ApiResponse({ status: 200, description: 'Pricing for different TLDs' })
  getDomainPricing() {
    return this.savService.getDomainPricing();
  }
}
