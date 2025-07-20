import { Controller } from '@nestjs/common';
import { PublicServiceService } from './public-service.service';

@Controller('public-service')
export class PublicServiceController {
  constructor(private readonly publicServiceService: PublicServiceService) {}

}
