import { PartialType } from '@nestjs/swagger';
import { CreateSavDto } from './create-sav.dto';

export class UpdateSavDto extends PartialType(CreateSavDto) {}
