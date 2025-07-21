import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Permission } from "src/app-auth/permissions/schemas/permission.schemas";
import { BaseModel } from "src/shared/model/baseModel.dto";
import mongooseDelete from 'mongoose-delete';
export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role extends BaseModel {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all', // Ghi đè find, count, etc.
});