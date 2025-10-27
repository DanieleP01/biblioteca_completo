import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonicModule]
})
export class LoginPage implements OnInit {
  loginData = {
    identifier: '', //username o email
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  submitLogin() {
    if (!this.loginData.identifier || !this.loginData.password) {
      this.errorMessage = 'Username/Email e password obbligatori';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post<any>('http://localhost:3000/api/login', {
      identifier: this.loginData.identifier,
      password: this.loginData.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Login effettuato!';
        
        // Salva il token
        localStorage.setItem('token', response.token);

        //Salva l'username
        localStorage.setItem('username', response.user.username);
        
        // Attendi mezzo secondo poi reindirizza
        setTimeout(() => {
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.error || 'Errore login';
      }
    });
  }
}
