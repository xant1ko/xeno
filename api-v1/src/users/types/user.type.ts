import { ObjectId } from 'mongodb';

// Описываем поля пользователя, которые сохраняются в MongoDB.
export type UserDocument = {
  _id: ObjectId;
  login: string;
  normalized_login: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};

// Описываем безопасное представление пользователя для будущих API-ответов.
export type UserPublic = {
  id: string;
  login: string;
  created_at: Date;
  updated_at: Date;
};

// Описываем данные, необходимые repository для создания пользователя.
export type CreateUserData = {
  login: string;
  normalized_login: string;
  password_hash: string;
};
