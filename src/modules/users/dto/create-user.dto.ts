import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsOptional, Length} from 'class-validator';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'tài khoản không được để trống'})
    @Length(1, 100)
    userName: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Mật khẩu không được để trống'})
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Quyền không được để trống'})
    @IsMongoId({message: 'Quyền là object id'})
    role: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    @IsNotEmpty({ message: 'team không được để trống' })
    @IsArray({ message: 'team có định dạng là array' })
    @IsMongoId({each: true, message: 'each team là object id'})
    team: mongoose.Schema.Types.ObjectId[];

    @ApiProperty()
    @IsOptional()
    email: string;

    @ApiProperty({
        description: 'Chức vụ',
    })
    @IsOptional()
    position: string[];

    @ApiProperty({
        description: 'Trạng thái tài khoản',
    })
    @IsOptional()
    status: number;

    @ApiProperty()
    @IsOptional()
    telegramId: number;

    @ApiProperty()
    @IsOptional()
    telegramName: string;
}