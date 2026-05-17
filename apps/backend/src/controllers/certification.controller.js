// src/controllers/certification.controller.js

import * as certSvc from '../services/certification.service.js';
import { success, failure } from '../utils/response.js';
import { validationResult } from 'express-validator';

export async function getMyCerts(req, res) {
  try {
    const certs = await certSvc.getMyCertifications(req.user.userId);
    return success(res, certs, 'Certifications fetched.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

export async function addCert(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return failure(res, 'Validation error.', 422, errors.array());
  }

  try {
    const cert = await certSvc.addCertification(req.user.userId, req.body);
    return success(res, cert, 'Certification added.', 201);
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

export async function updateCert(req, res) {
  try {
    const cert = await certSvc.updateCertification(req.params.id, req.user.userId, req.body);
    return success(res, cert, 'Certification updated.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

export async function deleteCert(req, res) {
  try {
    await certSvc.deleteCertification(req.params.id, req.user.userId);
    return success(res, {}, 'Certification deleted.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}
