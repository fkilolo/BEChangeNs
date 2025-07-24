import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class UpdateNameserversDto {
  @ApiProperty({ example: '687e64d77991cf96ad413bf0' })
  @IsString()
  conect_id: string;

  @ApiProperty({ type: [String], example: ['test12.click', 'test13.click'] })
  @IsArray()
  @IsString({ each: true })
  domain: string[];

  @ApiProperty({ type: [String], example: ['ns1.eztestlan12.com', 'ns2.eztestlan11.com'] })
  @IsArray()
  @IsString({ each: true })
  hosts: string[];
} 