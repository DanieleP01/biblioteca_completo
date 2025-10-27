import { Injectable } from '@angular/core';
import { User } from '../models/user.model.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | null = null;
  
  // Salva il token dopo il login
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Ottiene il token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica se l'utente è loggato
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  saveUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    
    if (!userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Errore parsing user da localStorage:', e);
      return null;
    }
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user?.id || null;
  }

  getUserFullName(): string | null {
    const user = this.getUser();
    return user ? `${user.firstName} ${user.lastName}` : null;
  }
  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }
}
