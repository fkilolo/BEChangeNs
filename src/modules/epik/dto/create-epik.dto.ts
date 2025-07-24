import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class CreateEpikDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Tên kết nội epik" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "signature kết nội epik" })
  signature: string;

  @ApiProperty()
  @IsOptional()
  total_domain: number;

  @ApiProperty()
  @IsNotEmpty({ message: "email kết nội epik" })
  userName: string;
}
