import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseModel } from 'src/shared/model/baseModel.dto';
import mongooseDelete from 'mongoose-delete';
import { User } from 'src/modules/users/schemas/user.schema';

export type SavDocument = HydratedDocument<Sav>;

@Schema({ timestamps: true })
export class Sav extends BaseModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  apikey: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: 0 })
  total_domain: number;
  
}

export const SavSchema = SchemaFactory.createForClass(Sav);

SavSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});
