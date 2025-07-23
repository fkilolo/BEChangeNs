import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDynadotDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  apikey: string;

  @ApiProperty()
  @IsString()
  secretkey: string;

  @ApiProperty()
  @IsNumber()
  total_domain: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userName?: string;
} 