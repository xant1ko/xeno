import { ObjectId } from 'mongodb';

export type OperationFields = {
  account_name: string;
  card_number: string;
  date: Date;
  transaction_amount: number;
  currency: string;
  status: string;
  default_category: string;
  custom_category: string;
  description: string;
  message: string;
};

export type OperationDocument = OperationFields & {
  _id: ObjectId;
  user_id: ObjectId;
  created_at: Date;
  updated_at: Date;
};

export type OperationsPage = {
  items: OperationDocument[];
  total: number;
};
