import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Spaceship, SpaceshipSchema } from './schemas/spaceship.schema';
import { SpaceshipService } from './spaceship.service';
import { SpaceshipController } from './spaceship.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Spaceship.name, schema: SpaceshipSchema }])],
  controllers: [SpaceshipController],
  providers: [SpaceshipService],
})
export class SpaceshipModule {} 