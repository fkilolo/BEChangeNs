import { PartialType } from '@nestjs/swagger';
import { CreateDynadotDto } from './create-dynadot.dto';

export class UpdateDynadotDto extends PartialType(CreateDynadotDto) {} 