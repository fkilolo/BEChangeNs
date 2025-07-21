import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class CreateSavDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Tên kết nội ovh" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "apikey kết nội ovh" })
  apikey: string;

  @ApiProperty()
  @IsOptional()
  total_domain: number;

  @ApiProperty()
  @IsNotEmpty({ message: "email kết nội ovh" })
  userName: string;
}
