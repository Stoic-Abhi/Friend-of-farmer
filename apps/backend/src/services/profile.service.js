// src/services/profile.service.js

import prisma from '../config/prisma.js';

/**
 * Get or create a profile for a user.
 * Uses upsert to create a blank profile if none exists.
 */
export async function getOrCreateProfile(userId) {
  return prisma.userProfile.upsert({
    where:  { userId },
    create: { userId },
    update: {},
  });
}

/**
 * Update profile fields. Creates profile if it doesn't exist.
 */
export async function updateProfile(userId, data) {
  const { displayName, bio, avatarUrl, addressLine, landmark,
          district, state, pincode, latitude, longitude,
          geoAccuracy, landSizeHa } = data;

  return prisma.userProfile.upsert({
    where:  { userId },
    create: {
      userId, displayName, bio, avatarUrl, addressLine, landmark,
      district, state, pincode, latitude, longitude, geoAccuracy, landSizeHa,
    },
    update: {
      ...(displayName !== undefined && { displayName }),
      ...(bio !== undefined && { bio }),
      ...(avatarUrl !== undefined && { avatarUrl }),
      ...(addressLine !== undefined && { addressLine }),
      ...(landmark !== undefined && { landmark }),
      ...(district !== undefined && { district }),
      ...(state !== undefined && { state }),
      ...(pincode !== undefined && { pincode }),
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
      ...(geoAccuracy !== undefined && { geoAccuracy }),
      ...(landSizeHa !== undefined && { landSizeHa }),
    },
  });
}

/**
 * Update geolocation fields only — lightweight PATCH.
 */
export async function updateGeolocation(userId, { latitude, longitude, accuracy }) {
  return prisma.userProfile.upsert({
    where:  { userId },
    create: {
      userId, latitude, longitude, geoAccuracy: accuracy,
      geoUpdatedAt: new Date(),
    },
    update: {
      latitude, longitude, geoAccuracy: accuracy,
      geoUpdatedAt: new Date(),
    },
  });
}

/**
 * Get full profile for the authenticated user (includes all certifications).
 */
export async function getFullProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, phone: true, role: true,
      isVerified: true, createdAt: true,
      profile: true,
      certifications: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
  return user;
}

/**
 * Get public profile for display (only VERIFIED certifications).
 */
export async function getPublicProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, phone: true, role: true, createdAt: true,
      profile: {
        select: {
          displayName: true, bio: true, avatarUrl: true,
          district: true, state: true,
        },
      },
      certifications: {
        where: { status: 'VERIFIED' },
        select: {
          id: true, certType: true, certName: true,
          issuedBy: true, expiresAt: true, status: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) throw Object.assign(new Error('User not found.'), { status: 404 });
  return user;
}
