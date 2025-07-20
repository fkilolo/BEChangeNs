import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, Length } from 'class-validator';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'userName'] as const) {
    @IsNotEmpty({ message: '_id không được để trống'})
    _id: string;

    @ApiProperty()
    @IsOptional()
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
    status: number;

    @ApiProperty()
    telegramId: number;

    @ApiProperty()
    telegramName: string;
}
