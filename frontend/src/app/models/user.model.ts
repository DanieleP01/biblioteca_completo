export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId?: number;
  username?: string;
}