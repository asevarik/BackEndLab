import mongoose,{Schema,Document} from "mongoose";
import { UserObject } from "../zod/User";

export interface IUser extends Document,UserObject{}

const UserSchema:Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true,
      },
      name: {
        type: String,
        required: [true, 'first name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
      },
      password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [5, 'Password must be at least 5 characters'],
      },
    }
,{timestamps:true})

export const UserModel = mongoose.model<IUser>('User',UserSchema);