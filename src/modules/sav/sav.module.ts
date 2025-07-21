import { Module } from '@nestjs/common';
import { SavService } from './sav.service';
import { SavController } from './sav.controller';

@Module({
  controllers: [SavController],
  providers: [SavService],
})
export class SavModule {}
