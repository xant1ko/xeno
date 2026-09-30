import { ObjectId } from 'mongodb';

export type CategoryDocument = {
  _id: ObjectId;
  user_id: ObjectId;
  name: string;
  created_at: Date;
  updated_at: Date;
};
