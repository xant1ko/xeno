export type Operation = {
  id: string;
  account_name: string;
  card_number: string;
  date: string;
  transaction_amount: number;
  currency: string;
  status: string;
  default_category: string;
  custom_category: string;
  description: string;
  message: string;
  created_at: string;
  updated_at: string;
};

export type OperationsPage = {
  items: Operation[];
  total: number;
  page: number;
  limit: number;
};

export type OperationsQuery = {
  page?: number;
  limit?: number;
};
