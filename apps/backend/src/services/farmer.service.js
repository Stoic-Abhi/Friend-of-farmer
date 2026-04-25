// src/services/farmer.service.js
// Farmer-specific queries — profile, saved farmers, inventory.

import prisma from '../config/prisma.js';

/** Public farmer profile: their active listings + avg rating */
export async function getFarmerProfile(farmerId) {
  const farmer = await prisma.user.findUnique({
    where:  { id: farmerId, role: 'FARMER' },
    select: {
      id:    true,
      email: true,
      phone: true,
      products: {
        where:   { isActive: true },
        orderBy: { harvestDate: 'desc' },
        include: {
          reviews: { select: { rating: true } },
          _count:  { select: { reviews: true } },
        },
      },
      savedBy:  { select: { consumerId: true } },
      _count:   { select: { products: true, reviews: true } },
    },
  });
  if (!farmer) throw Object.assign(new Error('Farmer not found.'), { status: 404 });

  const allRatings = farmer.products.flatMap(p => p.reviews.map(r => r.rating));
  const avgRating  = allRatings.length
    ? Number((allRatings.reduce((s, r) => s + r, 0) / allRatings.length).toFixed(1))
    : null;

  return { ...farmer, avgRating };
}

/** List all farmers (public) */
export async function listFarmers({ search, district, page = 1, limit = 20 } = {}) {
  const where = { role: 'FARMER', isVerified: true };
  if (district) where.products = { some: { district: { contains: district, mode: 'insensitive' } } };

  const [total, farmers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip:    (Number(page) - 1) * Number(limit),
      take:    Number(limit),
      select: {
        id: true, email: true, phone: true,
        _count: { select: { products: true } },
      },
    }),
  ]);

  return { total, page: Number(page), farmers };
}

/** Consumer: save a farmer */
export async function saveFarmer(consumerId, farmerId) {
  const farmer = await prisma.user.findUnique({ where: { id: farmerId, role: 'FARMER' } });
  if (!farmer) throw Object.assign(new Error('Farmer not found.'), { status: 404 });

  return prisma.savedFarmer.upsert({
    where:  { consumerId_farmerId: { consumerId, farmerId } },
    create: { consumerId, farmerId },
    update: {},
  });
}

/** Consumer: unsave a farmer */
export async function unsaveFarmer(consumerId, farmerId) {
  return prisma.savedFarmer.deleteMany({ where: { consumerId, farmerId } });
}

/** Consumer: list saved farmers */
export async function getSavedFarmers(consumerId) {
  const saved = await prisma.savedFarmer.findMany({
    where:   { consumerId },
    include: {
      farmer: {
        select: {
          id: true, email: true, phone: true,
          products: {
            where: { isActive: true },
            select: { district: true, reviews: { select: { rating: true } } },
            take: 10,
          },
        },
      },
    },
  });

  return saved.map(s => {
    const ratings = s.farmer.products.flatMap(p => p.reviews.map(r => r.rating));
    const avgRating = ratings.length
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : null;
    const districts = [...new Set(s.farmer.products.map(p => p.district))];
    return { ...s.farmer, avgRating, districts };
  });
}

/** Farmer: inventory summary */
export async function getInventory(farmerId) {
  return prisma.product.findMany({
    where:   { farmerId, isActive: true },
    select:  { id: true, name: true, quantityKg: true, pricePerKg: true, harvestDate: true, category: true },
    orderBy: { quantityKg: 'asc' },
  });
}
