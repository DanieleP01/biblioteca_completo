import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

@Injectable({
    providedIn: 'root'
})

export class NotificationService {

    private apiUrl = 'http://localhost:3000/api'; 

    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    private unreadCountSubject = new BehaviorSubject<number>(0);

    notifications$ = this.notificationsSubject.asObservable();
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient) {}

    // carica tutte le notifiche (tutte le non lette e soltanto le 4 più recenti di non lette)
    loadAllNotifications(userId: number): void {
        this.http.get<Notification[]>(`${this.apiUrl}/notifications/all/${userId}`)  // Cambia l'endpoint
        .subscribe({
            next: (notifications) => {
            this.notificationsSubject.next(notifications);
            this.updateUnreadCount(userId);
            },
            error: (err) => console.error('Errore caricamento notifiche:', err),
        });
    }

    // Aggiorna il count di notifiche non lette
    private updateUnreadCount(userId: number): void {
        this.http.get<{ unreadCount: number }>(`${this.apiUrl}/notifications/count/${userId}`)
            .subscribe({
                next: (data) => {
                    this.unreadCountSubject.next(data.unreadCount);
                },error: (err) => {
                    console.error('Errore caricamento count:', err);
                }   
            });
    }

    // Segna una notifica come letta
    markAsRead(notificationId: number, userId: number): void {
        this.http.patch(`${this.apiUrl}/notifications/${notificationId}/read`, {})
            .subscribe({
                next: () => {
                    const currentNotifications = this.notificationsSubject.getValue();
                    
                    //Cicla attraverso tutte le notifiche
                    const updatedNotifications = currentNotifications.map((n) => {
                        //Se l'ID corrisponde a quella che stai leggendo
                        if(n.id === notificationId){
                        //Crea una COPIA della notifica e metti is_read = true
                        return { ...n, is_read: true };
                        }
                        //Altrimenti ritorna la notifica invariata
                        return n;
                    });
                    
                    //aggiorna il template
                    this.notificationsSubject.next(updatedNotifications);

                    const currentCount = this.unreadCountSubject.getValue();
                    if(currentCount > 0){
                        this.unreadCountSubject.next(currentCount - 1);
                    }
                },
                error: (err) => console.error('Errore aggiornamento notifica:', err),
            });
    }

    // Ottieni l'array attuale di notifiche
    getNotifications(): Notification[] {
        return this.notificationsSubject.getValue();
    }

    // Ottieni il count attuale
    getUnreadCount(): number {
        return this.unreadCountSubject.getValue();
    }

    // Sincronizza le notifiche ogni 30 secondi
    startPolling(userId: number): void {
        interval(30000)
        .pipe(switchMap(() => this.http.get<Notification[]>(`${this.apiUrl}/notifications/unread/${userId}`)))
        .subscribe({
            next: (notifications) => {
                this.notificationsSubject.next(notifications);
                this.updateUnreadCount(userId);
            },
            error: (err) => 
                console.error('Errore polling notifiche:', err),
        });
    }
}