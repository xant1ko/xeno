export type AuthUser = {
  id: string;
  login: string;
  created_at: string;
  updated_at: string;
};

export type LoginRequest = {
  login: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
};
