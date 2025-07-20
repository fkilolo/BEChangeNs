import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Role } from "src/app-auth/roles/schemas/role.schemas";
import { BaseModel } from "src/shared/model/baseModel.dto";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseModel {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Object })
  userBusinessId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  position: string[];

  @Prop()
  status: number;

  @Prop()
  telegramName: string;

  @Prop()
  telegramId: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
