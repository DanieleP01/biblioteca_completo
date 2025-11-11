import { Router } from 'express';
import * as notificationsController from '../controllers/notificationsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = Router();

//crea una notifica
router.post('/create', notificationsController.createNotificationController);

//recupera tutte le notifiche (limit 4 per notifiche lette, le più recenti)
router.get('/all/:userId', notificationsController.getAllNotificationsController);

//segna come letta una notifica
router.patch('/:notificationId/read', notificationsController.markAsReadController);

//conta il numero di notifiche non lette
router.get('/count/:userId', notificationsController.getUnreadCountController);

export default router;