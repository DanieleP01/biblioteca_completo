import { Request, Response } from 'express';
import * as NotificationsModel from '../models/notifications.js';

// Crea una notifica
export async function createNotificationController(req: Request, res: Response) {
    try {

    const { recipient_id, recipient_role, title, message, type } = req.body;

    const notificationId = await NotificationsModel.createNotification({
        recipient_id,
        recipient_role,
        title,
        message,
        type,
    });

    res.status(201).json({ message: 'Notifica creata', id: notificationId });
    } catch (error: any) {
    res.status(500).json({ error: error.message });
    }
}

// Recupera TUTTE le notifiche (non lette + ultime 4 lette)
export async function getAllNotificationsController(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId);
    const notifications = await NotificationsModel.getAllNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Segna notifica come letta
export async function markAsReadController(req: Request, res: Response) {
    try {
    const notificationId = Number(req.params.notificationId);
    await NotificationsModel.markAsRead(notificationId);
    res.json({ message: 'Notifica segnata come letta' });
    } catch (error: any) {
    res.status(500).json({ error: error.message });
    }
}

// Recupera count notifiche non lette
export async function getUnreadCountController(req: Request, res: Response) {
    try {
        
    const userId = Number(req.params.userId);
    const unreadCount = await NotificationsModel.getUnreadCount(userId);

    res.json({ unreadCount });
    } catch (error: any) {
    res.status(500).json({ error: error.message });
    }
}