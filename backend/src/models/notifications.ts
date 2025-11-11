import { openDb } from './db.js';

// Crea una notifica
export async function createNotification(notificationData: any) {
    const db = await openDb();

    const result = await db.run(
    `INSERT INTO notifications (recipient_id, recipient_role, title, message, type)
        VALUES (?, ?, ?, ?, ?)`,
    notificationData.recipient_id,
    notificationData.recipient_role,
    notificationData.title,
    notificationData.message,
    notificationData.type
    );

    await db.close();
    return result.lastID as number;
}

//recupera tutte le notifiche (notifiche non lette soltanto 5, le più recenti)
export async function getAllNotifications(userId: number) {
  const db = await openDb();
  const notifications = await db.all(
    `SELECT * FROM notifications
    WHERE recipient_id = ? AND (
      is_read = 0  
      OR id IN (
        SELECT id FROM notifications 
        WHERE recipient_id = ? AND is_read = 1
        ORDER BY created_at DESC 
        LIMIT 5 
      )
    )
    ORDER BY is_read ASC, created_at DESC`,
    userId, userId
  );
  await db.close();
  return notifications;
}

// Segna una notifica come letta
export async function markAsRead(notificationId: number) {
    const db = await openDb();

    const result = await db.run(
    `UPDATE notifications SET is_read = 1 WHERE id = ?`,
    notificationId
    );

    await db.close();
    return result.changes;
}

// Recupera il count di notifiche non lette
export async function getUnreadCount(userId: number) {
    const db = await openDb();

    const row = await db.get(
    `SELECT COUNT(*) as count FROM notifications WHERE recipient_id = ? AND is_read = 0`,
    userId
    );

    await db.close();
    return row?.count || 0;
}

