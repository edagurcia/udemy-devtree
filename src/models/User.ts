import mongoose from "mongoose";

export type TUser = {
  handle: string;
  name: string;
  email: string;
  password: string;
};

const userSchema = new mongoose.Schema({
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
});

const User = mongoose.model<TUser>("User", userSchema);

export default User;
