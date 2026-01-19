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
import { NotificationService } from '../services/notification.service.js';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  //providers: [NotificationService],
  imports: [CommonModule, HttpClientModule, IonicModule, UserPopoverComponent, LoginPopoverComponent, FormsModule]
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

  currentUser: User | null = null;

  //variabili per controllare il tipo di utente
  isLibrarian = false;
  isUser = false;
  isAdmin = false;

  unreadCount: number = 0; //per il badge notifiche

  private subscription: Subscription = new Subscription();
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private authService: AuthService,
    private popoverController: PopoverController,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Carica le notifiche all'avvio
    const userId = this.authService.getUserId();
    if (userId) {
      this.notificationService.loadAllNotifications(userId);

      this.subscription.add(
        this.notificationService.unreadCount$.subscribe((count) => {
          this.unreadCount = count;
        })
      );
    }

    this.isLoading = true;
    this.loadData();

    //verifica se l'utente è loggato
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentUser = this.authService.getUser();
    this.isUser = this.currentUser?.role === 'user';

    //console.log(this.currentUser);
    this.isLibrarian = this.currentUser?.role === 'librarian';
    this.isAdmin = this.currentUser?.role === 'admin';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData(){
    this.http.get<Book[]>(`${this.apiUrl}/books`)
      .subscribe(books => this.books = books);

    this.http.get<Library[]>(`${this.apiUrl}/libraries`)
      .subscribe(libraries => this.libraries = libraries);
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

  //CERCA alla digitazione del titolo o di una parte di esso
  onSearchInput(event: any) {
    const query = this.searchQuery.trim();
    this.performSearch(query);
  }

  //esegue la ricerca chiamando il backend
  performSearch(query: string) {
    this.isLoading = true;

    this.http.get<any>(`${this.apiUrl}/search`, {
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
    setTimeout(() => {
      this.goToBookDetail(book.id);
    }, 200); 
  }

  onSelectLibrary(library: any) {
    this.closeSearchModal();
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

  //richiesta prestito (utente)
  goToLoanRequest(){
    this.router.navigate(['/loan-request']);
  }

  //controllo prestiti (bibliotecario)
  goToLoanControl() {
    this.router.navigate(['/loan-control']);
  }

  //controllo richiesta di copie (amministratore)
  goToCopyControl(){
    this.router.navigate(['/copyrequest-control']);
  }

}
