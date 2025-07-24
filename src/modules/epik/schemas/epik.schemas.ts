import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseModel } from 'src/shared/model/baseModel.dto';
import mongooseDelete from 'mongoose-delete';


export type EpikDocument = HydratedDocument<Epik>;

@Schema({ timestamps: true })
export class Epik extends BaseModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  signature: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: 0 })
  total_domain: number;
  
}

export const EpikSchema = SchemaFactory.createForClass(Epik);

EpikSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
