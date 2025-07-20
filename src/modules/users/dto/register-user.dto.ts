import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import mongoose from "mongoose";

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: "name không được để trống" })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: "Email không đúng định dạng" })
  @IsNotEmpty({ message: "Email không được để trống" })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Họ và tên không được để trống" })
  @Length(1, 200)
  fullName: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Số điện thoại không được để trống" })
  @Length(1, 100)
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Password không được để trống" })
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Role không được để trống" })
  role: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  telegram: string;
}
