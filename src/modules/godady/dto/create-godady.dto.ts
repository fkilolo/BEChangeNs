import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateGodadyDto {
  @ApiProperty({ example: 'Kết nối GoDaddy 1' })
  @IsNotEmpty({ message: 'Tên kết nối không được để trống' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'abc123apikey' })
  @IsNotEmpty({ message: 'API key không được để trống' })
  @IsString()
  apikey: string;

  @ApiProperty({ example: 'xyz456secret' })
  @IsNotEmpty({ message: 'Secret key không được để trống' })
  @IsString()
  secretkey: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email tài khoản GoDaddy không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  userName: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  total_domain?: number;
}
