export interface UserRegistration {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  city?: string | null;
  province?: string | null;
}

export interface AuthResponse {
  message: string;
  userId?: number;
  username?: string;
}

