import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
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
}
