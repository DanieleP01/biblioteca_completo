import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Library } from '../models/library.model.js';
import { Book } from '../models/book.model.js';
import { AuthService } from '../services/auth.service.js';
import { libraryBook } from '../models/library.model.js';

@Component({
  selector: 'app-library-detail',
  templateUrl: './library-detail.page.html',
  styleUrls: ['./library-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule]
})

export class LibraryDetailPage implements OnInit {
  library: Library | null = null;
  libraryBooks: libraryBook[] = [];
  isLoading = true;
  isLoggedIn = false;

  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); //prende l'id dalla route
    if(id) {
      this.loadLibraryDetails(id);
      this.loadLibraryBooks(id);
    } else {
      this.router.navigate(['home']);
    }
    this.checkLoginStatus();
  }

  loadLibraryDetails(id: String){
    this.isLoading = true;
    this.http.get<Library>(`${this.apiUrl}/librerie/${id}`)
          .subscribe({
            next: (librerie) => {
              this.library = librerie;
            },
            error: () => {
              this.isLoading = false;
              this.router.navigate(['/home']);
            }
          });
  }

  loadLibraryBooks(id: String){
    this.isLoading = true;

    this.http.get<any>(`${this.apiUrl}/libraries/${id}/books`).subscribe({
      next: (res) => {
        this.libraryBooks = res;
        //console.log("Libri della biblioteca: ", this.libraryBook);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Errore nel caricamento delle richieste');
      }
    });
  }

  //Dettagli Libro
  goToBookDetail(bookId: number) {
    this.router.navigate(['/book-detail', bookId]);
  }

  checkLoginStatus(){
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
