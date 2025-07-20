import mongoose from "mongoose";

export class UserShorten {
  _id: mongoose.Schema.Types.ObjectId;
  userName: string;
}
