import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class UpdateAllNameserversDto {
  @ApiProperty({ example: '687e64d77991cf96ad413bf0' })
  @IsString()
  conect_id: string;

  @ApiProperty({ type: [String], example: ['ns1.eztestlan4.com', 'ns2.eztestlan4.com'] })
  @IsArray()
  @IsString({ each: true })
  hosts: string[];
} 