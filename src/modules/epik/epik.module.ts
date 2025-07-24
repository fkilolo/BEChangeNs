import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EpikService } from './epik.service';
import { EpikController } from './epik.controller';
import { Epik, EpikSchema } from './schemas/epik.schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Epik.name, schema: EpikSchema },
    ]),
  ],
  controllers: [EpikController],
  providers: [EpikService], 
  exports: [EpikService],   
})
export class EpikModule {}
