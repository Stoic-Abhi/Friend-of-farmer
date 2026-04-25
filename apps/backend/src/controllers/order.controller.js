// src/controllers/order.controller.js

import * as svc from '../services/order.service.js';
import { success, failure } from '../utils/response.js';

export async function placeOrder(req, res) {
  try {
    return success(res, await svc.placeOrder(req.user.userId, req.body), 'Order placed.', 201);
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function myOrders(req, res) {
  try {
    return success(res, await svc.getConsumerOrders(req.user.userId), 'Orders fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function getOrder(req, res) {
  try {
    return success(res, await svc.getOrderById(req.params.id, req.user.userId), 'Order fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function farmerOrders(req, res) {
  try {
    return success(res, await svc.getFarmerOrders(req.user.userId), 'Incoming orders fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function updateStatus(req, res) {
  try {
    return success(
      res,
      await svc.updateOrderStatus(req.params.id, req.user.userId, req.body.status),
      'Order status updated.'
    );
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}
