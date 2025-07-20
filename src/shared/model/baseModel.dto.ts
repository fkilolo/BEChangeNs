import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";

export class BaseModel {
  //create
  @Prop()
  createdAt: Date;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  //update
  @Prop()
  updatedAt: Date;
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  //delete
  @Prop({ default: false })
  isDeleted: boolean;
  @Prop()
  deletedAt: Date;
  @Prop({ type: Object })
  deleteBy: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
}
