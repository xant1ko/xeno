import { ObjectId } from 'mongodb';
export type UserDocument = {
  _id: ObjectId;
  login: string;
  normalized_login: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};
export type UserPublic = {
  id: string;
  login: string;
  created_at: Date;
  updated_at: Date;
};
export type CreateUserData = {
  login: string;
  normalized_login: string;
  password_hash: string;
};
