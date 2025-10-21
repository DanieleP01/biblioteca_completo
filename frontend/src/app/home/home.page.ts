import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule  } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})

export class HomePage implements OnInit{
  books: any[] = [];
  libraries: any[] = [];

  isHeaderHidden = false;
  lastScrollTop = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/libri')
      .subscribe(libri => this.books = libri);

    this.http.get<any[]>('http://localhost:3000/api/librerie')
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

}
