import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserRegistration, AuthResponse } from '../models/user.model.js';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class RegistrationPage {
  user: UserRegistration = { 
    firstName: '',
    lastName: '',
    username: '', 
    email: '', 
    password: '',
    confirmPassword: '',
    city: '',
    province: '' 
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  submitRegistration() {

    //validazione password
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Le password non coincidono';
      return;
    }
    
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.http.post<AuthResponse>(
      'http://localhost:3000/api/registrazione', {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
        city: this.user.city || null,
        province: this.user.province || null
      }).subscribe({
      next: (response: AuthResponse) => {
        this.successMessage = response.message;
        this.isLoading = false;
        console.log("Registrazione avvenuta");
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.log('errore');
        this.errorMessage = err.error.error;
        this.isLoading = false;
      }
    });
  }

}
