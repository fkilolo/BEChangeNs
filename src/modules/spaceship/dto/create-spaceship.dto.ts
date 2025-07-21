import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateSpaceshipDto {
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

  @ApiProperty()
  @IsString()
  userName: string;
} 