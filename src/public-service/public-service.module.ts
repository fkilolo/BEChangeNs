import { Module } from '@nestjs/common';
import { PublicServiceService } from './public-service.service';
import { PublicServiceController } from './public-service.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
  ],
  controllers: [PublicServiceController],
  providers: [PublicServiceService],
  exports: [PublicServiceService],
})
export class PublicServiceModule {}
