import { PartialType } from '@nestjs/swagger';
import { CreateGodadyDto } from './create-godady.dto';

export class UpdateGodadyDto extends PartialType(CreateGodadyDto) {}
