// src/controllers/farmer.controller.js

import * as svc from '../services/farmer.service.js';
import { success, failure } from '../utils/response.js';

export async function getProfile(req, res) {
  try {
    return success(res, await svc.getFarmerProfile(req.params.id), 'Farmer profile fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function listFarmers(req, res) {
  try {
    return success(res, await svc.listFarmers(req.query), 'Farmers fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function saveFarmer(req, res) {
  try {
    await svc.saveFarmer(req.user.userId, req.params.id);
    return success(res, {}, 'Farmer saved.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function unsaveFarmer(req, res) {
  try {
    await svc.unsaveFarmer(req.user.userId, req.params.id);
    return success(res, {}, 'Farmer unsaved.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function savedFarmers(req, res) {
  try {
    return success(res, await svc.getSavedFarmers(req.user.userId), 'Saved farmers fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function inventory(req, res) {
  try {
    return success(res, await svc.getInventory(req.user.userId), 'Inventory fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}
