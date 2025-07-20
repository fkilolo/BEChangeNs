import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'name không được để trống' })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description không được để trống' })
    description: string;
    
    @ApiProperty()
    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive có giá trị là boolean' })
    isActive: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: 'permissions không được để trống' })
    @IsArray({ message: 'permissions có định dạng là array' })
    @IsMongoId({each: true, message: 'each permissions là object id'})
    permissions: mongoose.Schema.Types.ObjectId[];
}
