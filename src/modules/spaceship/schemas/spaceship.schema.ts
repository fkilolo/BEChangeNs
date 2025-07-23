import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Spaceship extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  apikey: string;

  @Prop({ required: true })
  secretkey: string;

  @Prop({ required: true, default: 0 })
  total_domain: number;

  @Prop()
  userName: string;
}

export const SpaceshipSchema = SchemaFactory.createForClass(Spaceship); 