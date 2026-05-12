// src/services/order.service.js

import prisma from '../config/prisma.js';
import { notifyOrderPlaced, notifyLowStock, notifyStatusChanged } from './notification.service.js';

const DELIVERY_FEE = 30;

/* ── Place order ─────────────────────────────────────────────── */

export async function placeOrder(consumerId, { items, deliveryAddress }) {
  if (!items?.length) throw Object.assign(new Error('Cart is empty.'), { status: 400 });

  const productIds = [...new Set(items.map(i => i.productId))];
  const products   = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length)
    throw Object.assign(new Error('One or more products are unavailable.'), { status: 400 });

  // Build line items + validate stock
  const lineItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    const qty     = Number(item.quantityKg);
    if (qty > Number(product.quantityKg))
      throw Object.assign(
        new Error(`Only ${product.quantityKg} kg of "${product.name}" available.`),
        { status: 400 }
      );
    const subtotalRs = Number((qty * Number(product.pricePerKg)).toFixed(2));
    return { productId: product.id, quantityKg: qty, pricePerKg: Number(product.pricePerKg), subtotalRs };
  });

  const subtotalRs = lineItems.reduce((s, i) => s + i.subtotalRs, 0);
  const totalRs    = Number((subtotalRs + DELIVERY_FEE).toFixed(2));

  // Atomic: create order, decrement inventory
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        consumerId,
        subtotalRs,
        deliveryFeeRs: DELIVERY_FEE,
        totalRs,
        deliveryAddress,
        items: { create: lineItems },
      },
      include: { items: { include: { product: { select: { id: true, name: true, farmerId: true } } } } },
    });

    for (const item of lineItems) {
      await tx.product.update({
        where: { id: item.productId },
        data:  { quantityKg: { decrement: item.quantityKg } },
      });
    }

    // Check for low stock after decrement
    for (const item of lineItems) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (product && product.quantityKg <= 5) {
        notifyLowStock(product).catch(console.error);
      }
    }

    return order;
  });

  // Fire-and-forget: notify farmers and consumer
  notifyOrderPlaced(result).catch(console.error);

  return result;
}

/* ── Consumer: my orders ─────────────────────────────────────── */

export async function getConsumerOrders(consumerId) {
  return prisma.order.findMany({
    where:   { consumerId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, farmerId: true, farmer: { select: { id: true, email: true, phone: true } } },
          },
        },
      },
    },
  });
}

export async function getOrderById(orderId, consumerId) {
  const order = await prisma.order.findUnique({
    where:   { id: orderId },
    include: {
      items:    { include: { product: { include: { farmer: { select: { id: true, email: true, phone: true } } } } } },
      consumer: { select: { id: true, email: true, phone: true } },
    },
  });
  if (!order)                   throw Object.assign(new Error('Order not found.'), { status: 404 });
  if (order.consumerId !== consumerId) throw Object.assign(new Error('Forbidden.'), { status: 403 });
  return order;
}

/* ── Farmer: incoming orders ─────────────────────────────────── */

export async function getFarmerOrders(farmerId) {
  return prisma.order.findMany({
    where:   { items: { some: { product: { farmerId } } } },
    orderBy: { createdAt: 'desc' },
    include: {
      consumer: { select: { id: true, email: true, phone: true } },
      items: {
        where:   { product: { farmerId } },
        include: { product: { select: { id: true, name: true, pricePerKg: true } } },
      },
    },
  });
}

export async function updateOrderStatus(orderId, farmerId, status) {
  const VALID = ['PACKED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];
  if (!VALID.includes(status)) throw Object.assign(new Error(`Invalid status: ${status}`), { status: 400 });

  const order = await prisma.order.findFirst({
    where: { id: orderId, items: { some: { product: { farmerId } } } },
  });
  if (!order) throw Object.assign(new Error('Order not found or forbidden.'), { status: 404 });

  const updated = await prisma.order.update({ where: { id: orderId }, data: { status } });

  // Fire-and-forget: notify consumer of status change
  notifyStatusChanged(updated).catch(console.error);

  return updated;
}
