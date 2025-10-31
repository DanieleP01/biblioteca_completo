import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'book-detail/:id',
    loadComponent: () => import('./book-detail/book-detail.page').then( m => m.BookDetailPage)
  },
  {
    path: 'library-detail/:id',
    loadComponent: () => import('./library-detail/library-detail.page').then( m => m.LibraryDetailPage)
  },
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration.page').then( m => m.RegistrationPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'loan-request',
    loadComponent: () => import('./loan-request/loan-request.page').then( m => m.LoanRequestPage)
  },
  {
    path: 'loan-control',
    loadComponent: () => import('./loan-control/loan-control.page').then( m => m.LoanControlPage)
  },
  {
    path: 'my-books',
    loadComponent: () => import('./my-books/my-books.page').then( m => m.MyBooksPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'loans-library',
    loadComponent: () => import('./loans-library/loans-library.page').then( m => m.loanslibrary)
  },  {
    path: 'loans-history',
    loadComponent: () => import('./loans-history/loans-history.page').then( m => m.LoansHistoryPage)
  },



];
