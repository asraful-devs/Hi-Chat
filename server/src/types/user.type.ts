import type { Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    fullName: string;
    password: string;
    profilePic: string;
    createdAt: Date;
    updatedAt: Date;
}
