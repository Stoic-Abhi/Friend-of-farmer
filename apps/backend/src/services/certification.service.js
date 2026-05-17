// src/services/certification.service.js

import prisma from '../config/prisma.js';

/**
 * Add a new certification for a farmer.
 */
export async function addCertification(userId, data) {
  // Verify user is a farmer
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'FARMER') {
    throw Object.assign(new Error('Only farmers can add certifications.'), { status: 403 });
  }

  return prisma.farmerCertification.create({
    data: {
      userId,
      certType:    data.certType,
      certName:    data.certName,
      issuedBy:    data.issuedBy ?? null,
      certNumber:  data.certNumber ?? null,
      issuedAt:    data.issuedAt ? new Date(data.issuedAt) : null,
      expiresAt:   data.expiresAt ? new Date(data.expiresAt) : null,
      documentUrl: data.documentUrl,
    },
  });
}

/**
 * Update an existing certification (ownership-checked).
 */
export async function updateCertification(certId, userId, data) {
  const cert = await prisma.farmerCertification.findUnique({ where: { id: certId } });
  if (!cert) throw Object.assign(new Error('Certification not found.'), { status: 404 });
  if (cert.userId !== userId) throw Object.assign(new Error('Forbidden.'), { status: 403 });

  return prisma.farmerCertification.update({
    where: { id: certId },
    data: {
      ...(data.certName    !== undefined && { certName:    data.certName }),
      ...(data.issuedBy    !== undefined && { issuedBy:    data.issuedBy }),
      ...(data.certNumber  !== undefined && { certNumber:  data.certNumber }),
      ...(data.documentUrl !== undefined && { documentUrl: data.documentUrl }),
      ...(data.expiresAt   !== undefined && { expiresAt:   data.expiresAt ? new Date(data.expiresAt) : null }),
    },
  });
}

/**
 * Delete a certification (ownership-checked).
 */
export async function deleteCertification(certId, userId) {
  const cert = await prisma.farmerCertification.findUnique({ where: { id: certId } });
  if (!cert) throw Object.assign(new Error('Certification not found.'), { status: 404 });
  if (cert.userId !== userId) throw Object.assign(new Error('Forbidden.'), { status: 403 });

  return prisma.farmerCertification.delete({ where: { id: certId } });
}

/**
 * Get all certifications for the authenticated farmer.
 */
export async function getMyCertifications(userId) {
  return prisma.farmerCertification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
