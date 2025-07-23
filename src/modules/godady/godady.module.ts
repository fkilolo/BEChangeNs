import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GodadyController } from './godady.controller';
import { GodadyService } from './godady.service';
import { Godady, GodadySchema } from './schemas/godady.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Godady.name, schema: GodadySchema }]),
  ],
  controllers: [GodadyController],
  providers: [GodadyService],
})
export class GodadyModule {}
