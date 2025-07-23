import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dynadot } from './schemas/dynadot.schema';
import { CreateDynadotDto } from './dto/create-dynadot.dto';
import { UpdateDynadotDto } from './dto/update-dynadot.dto';
import { IUser } from '../users/users.interface';

@Injectable()
export class DynadotService {
  constructor(
    @InjectModel(Dynadot.name) private readonly dynadotModel: Model<Dynadot>,
  ) {}

  async create(createDto: CreateDynadotDto, user: IUser) {
    if (!createDto.userName || createDto.userName.trim() === '') {
      createDto.userName = user.userName;
    }
    return this.dynadotModel.create(createDto);
  }

  async findAll(current = 1, pageSize = 10, search?: string) {
    const skip = (current - 1) * pageSize;
    const filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const [result, total] = await Promise.all([
      this.dynadotModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      this.dynadotModel.countDocuments(filter)
    ]);
    return {
      meta: {
        current,
        pageSize,
        pages: Math.ceil(total / pageSize),
        total
      },
      result
    };
  }

  async findOne(id: string) {
    const doc = await this.dynadotModel.findById(id);
    if (!doc) throw new NotFoundException('Dynadot not found');
    return doc;
  }

  async update(id: string, updateDto: any) {
    if (updateDto.userName === '') {
      delete updateDto.userName;
    }
    const doc = await this.dynadotModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!doc) throw new NotFoundException('Dynadot not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.dynadotModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Dynadot not found');
    return doc;
  }
} 