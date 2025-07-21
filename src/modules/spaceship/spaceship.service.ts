import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Spaceship } from './schemas/spaceship.schema';
import { CreateSpaceshipDto } from './dto/create-spaceship.dto';
import { UpdateSpaceshipDto } from './dto/update-spaceship.dto';

@Injectable()
export class SpaceshipService {
  constructor(
    @InjectModel(Spaceship.name) private readonly spaceshipModel: Model<Spaceship>,
  ) {}

  async create(createDto: CreateSpaceshipDto) {
    return this.spaceshipModel.create(createDto);
  }

  async findAll(current = 1, pageSize = 10) {
    const skip = (current - 1) * pageSize;
    const [result, total] = await Promise.all([
      this.spaceshipModel.find().skip(skip).limit(pageSize),
      this.spaceshipModel.countDocuments()
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
    const doc = await this.spaceshipModel.findById(id);
    if (!doc) throw new NotFoundException('Spaceship not found');
    return doc;
  }

  async update(id: string, updateDto: UpdateSpaceshipDto) {
    const doc = await this.spaceshipModel.findByIdAndUpdate(id, updateDto, { new: true });
    if (!doc) throw new NotFoundException('Spaceship not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.spaceshipModel.findByIdAndDelete(id);
    if (!doc) throw new NotFoundException('Spaceship not found');
    return doc;
  }
} 