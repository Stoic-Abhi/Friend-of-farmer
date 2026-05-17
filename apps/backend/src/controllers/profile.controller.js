// src/controllers/profile.controller.js

import * as profileSvc from '../services/profile.service.js';
import { success, failure } from '../utils/response.js';
import { validationResult } from 'express-validator';

export async function getMyProfile(req, res) {
  try {
    const profile = await profileSvc.getFullProfile(req.user.userId);
    return success(res, profile, 'Profile fetched.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

export async function updateMyProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return failure(res, 'Validation error.', 422, errors.array());
  }

  try {
    const profile = await profileSvc.updateProfile(req.user.userId, req.body);
    return success(res, profile, 'Profile updated.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

export async function updateGeolocation(req, res) {
  try {
    const { latitude, longitude, accuracy } = req.body;
    const geo = await profileSvc.updateGeolocation(req.user.userId, {
      latitude, longitude, accuracy,
    });
    return success(res, geo, 'Geolocation updated.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}

export async function getPublicProfile(req, res) {
  try {
    const profile = await profileSvc.getPublicProfile(req.params.userId);
    return success(res, profile, 'Public profile fetched.');
  } catch (err) {
    return failure(res, err.message, err.status ?? 500);
  }
}
