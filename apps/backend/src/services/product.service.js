// src/services/product.service.js

import prisma from '../config/prisma.js';

function buildOrderBy(sort) {
  const map = {
    'price-asc':  { pricePerKg: 'asc' },
    'price-desc': { pricePerKg: 'desc' },
    rating:       { reviews: { _count: 'desc' } },
    fresh:        { harvestDate: 'desc' },
  };
  return map[sort] ?? { harvestDate: 'desc' };
}

function enrichProduct(p) {
  const reviews   = p.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;
  const harvestDays = Math.floor(
    (Date.now() - new Date(p.harvestDate).getTime()) / 86_400_000
  );
  return {
    ...p,
    avgRating:   avgRating ? Number(avgRating.toFixed(1)) : null,
    reviewCount: p._count?.reviews ?? reviews.length,
    harvestDays,
  };
}

export async function listProducts({ category, district, isOrganic, sort, search, page = 1, limit = 20 } = {}) {
  const where = { isActive: true };

  if (search) {
    where.OR = [
      { name:     { contains: search, mode: 'insensitive' } },
      { district: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (category)               where.category  = category.toUpperCase();
  if (district)               where.district  = { contains: district, mode: 'insensitive' };
  if (isOrganic !== undefined) where.isOrganic = isOrganic === 'true' || isOrganic === true;

  const skip = (Number(page) - 1) * Number(limit);

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take:    Number(limit),
      orderBy: buildOrderBy(sort),
      include: {
        farmer:  { select: { id: true, email: true, phone: true } },
        reviews: { select: { rating: true } },
        _count:  { select: { reviews: true } },
      },
    }),
  ]);

  return { total, page: Number(page), limit: Number(limit), products: products.map(enrichProduct) };
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where:   { id },
    include: {
      farmer:  { select: { id: true, email: true, phone: true } },
      reviews: {
        include: { reviewer: { select: { id: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: { select: { reviews: true } },
    },
  });
  if (!product) throw Object.assign(new Error('Product not found.'), { status: 404 });
  return enrichProduct(product);
}

export async function createProduct(farmerId, data) {
  return prisma.product.create({
    data: {
      farmerId,
      name:          data.name,
      category:      data.category.toUpperCase(),
      pricePerKg:    Number(data.pricePerKg),
      quantityKg:    Number(data.quantityKg),
      harvestDate:   new Date(data.harvestDate),
      location:      data.location,
      district:      data.district ?? data.location,
      description:   data.description ?? null,
      certification: (data.certification ?? 'CONVENTIONAL').toUpperCase(),
      delivery:      (data.delivery ?? 'PICKUP').toUpperCase(),
      isOrganic:     data.isOrganic === true || data.isOrganic === 'true',
      images:        data.images ?? [],
    },
  });
}

export async function updateProduct(id, farmerId, data) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing)                  throw Object.assign(new Error('Product not found.'), { status: 404 });
  if (existing.farmerId !== farmerId) throw Object.assign(new Error('Forbidden.'), { status: 403 });

  return prisma.product.update({
    where: { id },
    data: {
      ...(data.name        != null && { name:        data.name }),
      ...(data.pricePerKg  != null && { pricePerKg:  Number(data.pricePerKg) }),
      ...(data.quantityKg  != null && { quantityKg:  Number(data.quantityKg) }),
      ...(data.harvestDate != null && { harvestDate: new Date(data.harvestDate) }),
      ...(data.description != null && { description: data.description }),
      ...(data.isActive    != null && { isActive:    data.isActive }),
    },
  });
}

export async function deleteProduct(id, farmerId) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing)                  throw Object.assign(new Error('Product not found.'), { status: 404 });
  if (existing.farmerId !== farmerId) throw Object.assign(new Error('Forbidden.'), { status: 403 });
  return prisma.product.update({ where: { id }, data: { isActive: false } });
}

export async function getMyProducts(farmerId) {
  const products = await prisma.product.findMany({
    where:   { farmerId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { reviews: true, orderItems: true } }, reviews: { select: { rating: true } } },
  });
  return products.map(enrichProduct);
}

export async function addReview(productId, reviewerId, { rating, comment }) {
  if (rating < 1 || rating > 5) throw Object.assign(new Error('Rating must be 1–5.'), { status: 400 });
  return prisma.review.upsert({
    where:  { reviewerId_productId: { reviewerId, productId } },
    create: { productId, reviewerId, rating: Number(rating), comment },
    update: { rating: Number(rating), comment },
  });
}

export async function farmerStats(farmerId) {
  const [totalOrders, earningsAgg, activeListings, ratingAgg] = await Promise.all([
    prisma.orderItem.count({ where: { product: { farmerId } } }),
    prisma.orderItem.aggregate({
      where: { product: { farmerId } },
      _sum:  { subtotalRs: true },
    }),
    prisma.product.count({ where: { farmerId, isActive: true } }),
    prisma.review.aggregate({
      where:  { product: { farmerId } },
      _avg:   { rating: true },
      _count: { rating: true },
    }),
  ]);

  return {
    totalOrders,
    totalEarningsRs: Number((earningsAgg._sum.subtotalRs ?? 0).toFixed(2)),
    activeListings,
    avgRating:       Number((ratingAgg._avg.rating ?? 0).toFixed(1)),
    reviewCount:     ratingAgg._count.rating,
  };
}
