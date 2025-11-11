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

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  city?: string | null;
  province?: string | null;
  role: string;
  library_id: number;
  library_name: string;
  library_address: string;
}

