import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule  } from '@ionic/angular';
import { Router } from '@angular/router';
import { Book } from '../models/book.model.js';
import { Library } from '../models/library.model.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})

export class HomePage implements OnInit{
  books: Book[] = [];
  libraries: Library[] = [];

  isHeaderHidden = false;
  lastScrollTop = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<Book[]>('http://localhost:3000/api/libri')
      .subscribe(libri => this.books = libri);

    this.http.get<Library[]>('http://localhost:3000/api/librerie')
      .subscribe(librerie => this.libraries = librerie);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;

    // Nasconde l'header se scorri verso il basso, mostra se scorri verso l'alto
    if (scrollTop > this.lastScrollTop && scrollTop > 70) {
      this.isHeaderHidden = true;
    } else if (scrollTop < this.lastScrollTop) {
      this.isHeaderHidden = false;
    }
    this.lastScrollTop = scrollTop;
  }

  goToBookDetail(bookId: number) {
    this.router.navigate(['/book-detail', bookId]);
  }

  goToLibraryDetail(libraryId: number) {
    this.router.navigate(['/library-detail', libraryId]);
  }
}
