import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from 'src/shared/model/baseModel.dto';
import * as mongooseDelete from 'mongoose-delete';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission extends BaseModel {
  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string;

  @Prop()
  module: string;

  @Prop({ type: Object })
  deletedBy?: {
    _id: string;
    name: string;
  };
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.plugin(mongooseDelete.default, {
  deletedAt: true,
  overrideMethods: 'all',
});
