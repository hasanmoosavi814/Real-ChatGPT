export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt?: string;
};

export type RegisterRequest = {
  email: string;
  name?: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = User;

export type LogoutResponse = {
  success: true;
};
