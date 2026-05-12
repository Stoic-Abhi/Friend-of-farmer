// src/controllers/notification.controller.js

import * as svc from '../services/notification.service.js';
import { success, failure } from '../utils/response.js';

export async function list(req, res) {
  try {
    const notifications = await svc.getUserNotifications(req.user.userId);
    const unreadCount   = await svc.getUnreadCount(req.user.userId);
    return success(res, { notifications, unreadCount }, 'Notifications fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function markRead(req, res) {
  try {
    await svc.markAsRead(req.params.id, req.user.userId);
    return success(res, {}, 'Notification marked as read.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function markAllRead(req, res) {
  try {
    await svc.markAllAsRead(req.user.userId);
    return success(res, {}, 'All notifications marked as read.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}
