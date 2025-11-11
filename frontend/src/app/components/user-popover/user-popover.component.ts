import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController, AlertController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationsPopoverComponent } from '../notifications-popover.component.ts/notifications-popover.component';
import { NotificationService } from 'src/app/services/notification.service.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html', 
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule]
})

export class UserPopoverComponent implements OnInit, OnDestroy{
  @Input() onLogout: () => void = () => {};

  username: string = '';
  isLibrarian = false;
  isUser = false;
  isAdmin = false;

  //variabili per le notifiche
  unreadCount: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private authService: AuthService,
    private alertController: AlertController,
    public notificationService: NotificationService
  ) {

    this.username = this.authService.getUser()?.username || '';
    //console.log(this.username);
  }

  ngOnInit() {
    this.isLibrarian = this.authService.getUserRole() == 'librarian';
    this.isUser = this.authService.getUserRole() == 'user';
    this.isAdmin = this.authService.getUserRole() == 'admin';

    //Carica notifiche
    const userId = this.authService.getUserId();
    if(userId){
      this.notificationService.loadAllNotifications(userId as number);

      // Subscribe al count (badge)
      this.notificationService.unreadCount$.subscribe((count) => {
        this.unreadCount = count;
      });
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  async openNotificationsPopover(event: any) {
    const popover = await this.popoverController.create({
      component: NotificationsPopoverComponent,
      event: event,
      side: 'end',
      showBackdrop: false,
      cssClass: 'transparent-popover',
      componentProps: {
        notificationService: this.notificationService 
      }
    });
    await popover.present();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.popoverController.dismiss();
  }

  goToMyBooks() {
    this.router.navigate(['/my-books']);
    this.popoverController.dismiss();
  }

  goToMyLoansHistory(){
    this.router.navigate(['/loans-history']);
    this.popoverController.dismiss();
  }

  goToLoansLibrary(){
    this.router.navigate(['/loans-library']);
    this.popoverController.dismiss();
  }

  goToInventory(){
    this.router.navigate(['/inventory-reservations']);
    this.popoverController.dismiss();
  }

  goToBookManagement(){
    this.router.navigate(['/book-management']);
    this.popoverController.dismiss();
  }

  // Alert di conferma prima del logout
  async confirmLogout() {
    this.popoverController.dismiss();
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Sei sicuro di voler effettuare il logout?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Conferma',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.onLogout();
    this.popoverController.dismiss();
    window.location.reload();
  }
}
