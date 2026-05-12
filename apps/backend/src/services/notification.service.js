// src/services/notification.service.js
// Fire-and-forget notification helpers + query/mutation for the API.

import prisma from '../config/prisma.js';

/**
 * Create a single notification.
 * Used by other services in fire-and-forget mode (.catch(console.error)).
 */
export async function createNotification({ userId, type, message }) {
  return prisma.notification.create({
    data: { userId, type, message },
  });
}

/**
 * Create notifications for multiple users at once.
 */
export async function createNotifications(entries) {
  return prisma.notification.createMany({ data: entries });
}

/**
 * Get all notifications for a user, newest first.
 */
export async function getUserNotifications(userId) {
  return prisma.notification.findMany({
    where:   { userId },
    orderBy: { createdAt: 'desc' },
    take:    50,
  });
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(notificationId, userId) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw Object.assign(new Error('Notification not found.'), { status: 404 });
  }
  if (notification.userId !== userId) {
    throw Object.assign(new Error('Forbidden.'), { status: 403 });
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data:  { isRead: true },
  });
}

/**
 * Mark all notifications for a user as read.
 */
export async function markAllAsRead(userId) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data:  { isRead: true },
  });
}

/**
 * Get unread count for badge.
 */
export async function getUnreadCount(userId) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

/* ── Fire-and-forget helpers used by order/product services ── */

export function notifyOrderPlaced(order) {
  const items = order.items?.map(i => i.product?.name).join(', ') ?? 'items';
  const promises = [];

  // Notify each farmer whose products are in this order
  const farmerIds = [...new Set(order.items?.map(i => i.product?.farmerId).filter(Boolean) ?? [])];
  for (const farmerId of farmerIds) {
    promises.push(
      createNotification({
        userId:  farmerId,
        type:    'ORDER_PLACED',
        message: `New order received for ${items} — ₹${order.totalRs}`,
      })
    );
  }

  // Notify consumer
  if (order.consumerId) {
    promises.push(
      createNotification({
        userId:  order.consumerId,
        type:    'ORDER_PLACED',
        message: `Your order for ${items} has been placed — ₹${order.totalRs}`,
      })
    );
  }

  return Promise.all(promises);
}

export function notifyStatusChanged(order) {
  if (order.consumerId) {
    return createNotification({
      userId:  order.consumerId,
      type:    'ORDER_STATUS_CHANGED',
      message: `Your order #${order.id.slice(0, 8)} is now ${order.status}.`,
    });
  }
}

export function notifyLowStock(product) {
  return createNotification({
    userId:  product.farmerId,
    type:    'LOW_STOCK',
    message: `⚠️ "${product.name}" is running low — ${product.quantityKg} kg remaining.`,
  });
}
