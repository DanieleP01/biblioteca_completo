import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PopoverController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Notification } from 'src/app/models/notification.model.js';

@Component({
  selector: 'app-notifications-popover',
  templateUrl: './notifications-popover.component.html',
  styleUrls: ['./notifications-popover.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule]
})
export class NotificationsPopoverComponent implements OnInit, OnDestroy {
    //@Input() notificationService!: NotificationService;

    notifications: Notification[] = [];
    unreadCount: number = 0;
    currentUserId: number | null = 0;
    private subscription: Subscription = new Subscription();

    constructor(
    public notificationService: NotificationService,
    private authService: AuthService,
    private popoverController: PopoverController,
    ) {}

    ngOnInit() {
    const currentUserId = this.authService.getUserId();
    if(currentUserId){
        this.currentUserId = currentUserId;
        //console.log('console dal popover: ',this.currentUserId);
        this.notificationService.loadAllNotifications(this.currentUserId);
        
        this.subscription.add(
            this.notificationService.notifications$.subscribe((notifications) => {
            this.notifications = notifications;
        })
    );
    }
    this.subscription.add(
        this.notificationService.unreadCount$.subscribe((count) => {
            this.unreadCount = count;
        })
    );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getUnreadNotifications(): Notification[] {
        return this.notifications.filter((n) => !n.is_read);
    }

    getReadNotifications(): Notification[] {
        return this.notifications.filter((n) => n.is_read);
    }

    markAsRead(notification: Notification) {
        if (!notification.is_read && this.currentUserId) {
            this.notificationService.markAsRead(notification.id, this.currentUserId as number);
        }
    }

    markAllAsRead() {
        this.getUnreadNotifications().forEach((n) => {
            this.markAsRead(n);
        });
    }

    closePopover() {
        this.popoverController.dismiss();
    }
}