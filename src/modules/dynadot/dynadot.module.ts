import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dynadot, DynadotSchema } from './schemas/dynadot.schema';
import { DynadotService } from './dynadot.service';
import { DynadotController } from './dynadot.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dynadot.name, schema: DynadotSchema }])],
  controllers: [DynadotController],
  providers: [DynadotService],
})
export class DynadotModule {} 