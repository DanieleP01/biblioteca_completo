import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from '../models/book.model.js';
import { Library } from '../models/library.model.js';
import { AuthService } from '../services/auth.service.js';
import { UserPopoverComponent } from '../components/user-popover/user-popover.component.js';
import { LoginPopoverComponent } from '../components/login-popover/login-popover.component.js';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonicModule, UserPopoverComponent, LoginPopoverComponent, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})

export class HomePage implements OnInit{
  books: Book[] = [];
  libraries: Library[] = [];

  //variabili utilizzate solo per la ricerca (così da non andare a svuotare le card della home)
  searchBooks: Book[] = [];
  searchLibraries: Library[] = [];

  isLoggedIn = false; //boolean per il controllo di login
  isLoading = false;

  isHeaderHidden = false;
  lastScrollTop = 0;

  searchQuery = ''; 
  isSearchModalOpen = false; //gestisce l'apertura della modale

  currentUser: any = null;
  isLibrarian = false;

  isUser = false;
  isAdmin = false;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService,
    private popoverController: PopoverController,
  ) {}

  ngOnInit() {

    this.isLoading = true;
    this.loadData();

    //verifica se l'utente è loggato
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getUser();
    this.isUser = this.currentUser?.role === 'user';
    console.log(this.currentUser);
    this.isLibrarian = this.currentUser?.role === 'librarian';
    this.isAdmin = this.currentUser?.role === 'admin';
  }

  loadData(){
    this.http.get<Book[]>('http://localhost:3000/api/libri')
      .subscribe(libri => this.books = libri);

    this.http.get<Library[]>('http://localhost:3000/api/librerie')
      .subscribe(librerie => this.libraries = librerie);
  }

  //apre il popover corretto in base allo stato di login
  async presentPopover(event: any) {
    let component;
    
    if (this.isLoggedIn) {
      component = UserPopoverComponent;
    } else {
      component = LoginPopoverComponent;
    }

    const popover = await this.popoverController.create({
      component: component,
      event: event,
      translucent: true
    });

    await popover.present();
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

   // apre la finestra modale di ricerca su mobile
  toggleMobileSearch() {
    this.openSearchModal();
  }

  //CERCA al click
  onSearchInput(event: any) {
    const query = this.searchQuery.trim();
    this.performSearch(query);
  }

  //esegue la ricerca chiamando il backend
  performSearch(query: string) {
    this.isLoading = true;

    this.http.get<any>('http://localhost:3000/api/search', {
      params: { q: query }
    }).subscribe({
      next: (response) => {
        this.searchBooks = response.books;
        this.searchLibraries = response.libraries;
        this.isLoading = false;
        this.openSearchModal();
      },
      error: (err) => {
        console.log("errore");
        this.isLoading = false;
      }
    });
  }

  // funzioni della finestra modale di ricerca
  openSearchModal(){
    this.isSearchModalOpen = true;
  }

  closeSearchModal(){
    this.isSearchModalOpen = false;
    this.searchQuery = ''; 
  }

  onSelectBook(book: any) {
    this.closeSearchModal();
    //timeout impostato, per favorire il tempo di chiusura della finestra modale
    setTimeout(() => {
      this.goToBookDetail(book.id);
    }, 200); 
  }

  onSelectLibrary(library: any) {
    this.closeSearchModal();
    //timeout impostato, per favorire il tempo di chiusura della finestra modale
    setTimeout(() => {
      this.goToLibraryDetail(library.id);
    }, 200); 
  }

  //se l'utente clicca sulla barra di ricerca e dopo preme x per chiuderla
  onClearSearch(){
    this.searchQuery = '';
    this.loadData();
  }

  // Logout
  handleLogout() {
    this.authService.logout(); //rimuove il token
    this.isLoggedIn = false;   
    this.router.navigate(['/home']);
    this.popoverController.dismiss();
  }

  //Dettagli Libro
  goToBookDetail(bookId: number) {
    this.router.navigate(['/book-detail', bookId]);
  }

  //dettagli Biblioteca
  goToLibraryDetail(libraryId: number) {
    this.router.navigate(['/library-detail', libraryId]);
  }

  //richiesta prestito
  goToLoanRequest(){
    this.router.navigate(['/loan-request']);
  }
  //controllo prestiti bibliotecario
  goToLoanControl() {
  this.router.navigate(['/loan-control']);
}

}
