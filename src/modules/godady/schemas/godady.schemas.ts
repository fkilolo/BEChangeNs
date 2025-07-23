import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Godady {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  apikey: string;

  @Prop({ required: true })
  secretkey: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: 0 })
  total_domain: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export type GodadyDocument = Godady & Document;
export const GodadySchema = SchemaFactory.createForClass(Godady);
