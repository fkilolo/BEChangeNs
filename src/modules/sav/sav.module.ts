import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavService } from './sav.service';
import { SavController } from './sav.controller';
import { Sav, SavSchema } from './schemas/sav.schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sav.name, schema: SavSchema },
    ]),
  ],
  controllers: [SavController],
  providers: [SavService], 
  exports: [SavService],   
})
export class SavModule {}
