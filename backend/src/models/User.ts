import mongoose, { Schema, Document } from "mongoose";

export type TUser = Document & {
  handle: string;
  name: string;
  email: string;
  password: string;
  description: string;
  image: string;
  links: string;
};

const userSchema = new Schema({
  handle: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  image: {
    type: String,
    trim: true,
    default: "",
  },
  links: {
    type: String,
    default: "[]",
  },
});

const User = mongoose.model<TUser>("User", userSchema);

export default User;
