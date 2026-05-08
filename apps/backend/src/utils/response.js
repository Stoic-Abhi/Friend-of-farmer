// src/utils/response.js
// Consistent JSON response shape across all endpoints.

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object}  data     - payload to send
 * @param {string}  message  - human-readable message
 * @param {number}  status   - HTTP status code (default 200)
 */
export function success(res, data = {}, message = 'Success', status = 200) {
  return res.status(status).json({ ok: true, message, data });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string}  message  - human-readable error
 * @param {number}  status   - HTTP status code (default 400)
 * @param {object}  errors   - optional field-level validation errors
 */
export function failure(res, message = 'Something went wrong', status = 400, errors = null) {
  const body = { ok: false, message };
  if (errors) body.errors = errors;
  return res.status(status).json(body);
}
