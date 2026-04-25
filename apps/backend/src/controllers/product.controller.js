// src/controllers/product.controller.js

import * as svc from '../services/product.service.js';
import { success, failure } from '../utils/response.js';

export async function list(req, res) {
  try {
    return success(res, await svc.listProducts(req.query), 'Products fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function getOne(req, res) {
  try {
    return success(res, await svc.getProductById(req.params.id), 'Product fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function create(req, res) {
  try {
    return success(res, await svc.createProduct(req.user.userId, req.body), 'Product listed.', 201);
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function update(req, res) {
  try {
    return success(res, await svc.updateProduct(req.params.id, req.user.userId, req.body), 'Product updated.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function remove(req, res) {
  try {
    await svc.deleteProduct(req.params.id, req.user.userId);
    return success(res, {}, 'Product removed.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function myProducts(req, res) {
  try {
    return success(res, await svc.getMyProducts(req.user.userId), 'Listings fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function addReview(req, res) {
  try {
    return success(res, await svc.addReview(req.params.id, req.user.userId, req.body), 'Review submitted.', 201);
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}

export async function stats(req, res) {
  try {
    return success(res, await svc.farmerStats(req.user.userId), 'Stats fetched.');
  } catch (err) { return failure(res, err.message, err.status ?? 500); }
}
