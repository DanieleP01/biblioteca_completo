import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../models/book.model.js';
import { AuthService } from '../services/auth.service.js';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule]
})

export class BookDetailPage implements OnInit {
  book: Book | null = null;
  isLoading = true;
  isLoggedIn = false; //controller login

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 
    if(id) {
      this.loadBookDetails(id);
    } else {
      this.router.navigate(['home']);
    }
    this.checkLoginStatus();
  }

  loadBookDetails(id: String) {
    this.isLoading = true;
    this.http.get<Book>(`http://localhost:3000/api/libri/${id}`)
          .subscribe({
            next: (libro) => {
              this.book = libro;
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              this.router.navigate(['/home']);
            }
          });
  }

  checkLoginStatus(){
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  onReserve() {}

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
