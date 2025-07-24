import { PartialType } from '@nestjs/swagger';
import { CreateEpikDto } from './create-epik.dto';

export class UpdateEpikDto extends PartialType(CreateEpikDto) {}
