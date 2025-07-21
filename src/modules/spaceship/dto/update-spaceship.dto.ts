import { PartialType } from '@nestjs/swagger';
import { CreateSpaceshipDto } from './create-spaceship.dto';

export class UpdateSpaceshipDto extends PartialType(CreateSpaceshipDto) {} 