import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model.js';
import { Library } from '../models/library.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})

export class ProfilePage implements OnInit {
  currentUser: User | null = null;
  detailsUser: User | null = null;
  libraryManager: Library | null = null;
  isLoading = false;
  
  isUser = false;
  isLibrarian = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  this.currentUser = this.authService.getUser();
  this.isUser = this.currentUser?.role == 'user';
  this.isLibrarian = this.currentUser?.role == 'librarian';
  console.log('Utente corrente:', this.currentUser);

  if (!this.currentUser) {
    this.router.navigate(['/home']);
    return;
  }

  this.loadProfileDetail();
  }

  loadProfileDetail(){
    this.isLoading = true;

    this.http.get<User>(`${this.apiUrl}/details-profile/${this.currentUser?.id}`).subscribe({
      next: (user) => {
        this.detailsUser = user;
        console.log("dettagli: ", this.detailsUser);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      }
    });
  }
}
