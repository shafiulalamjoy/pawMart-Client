// src/services/api.js
// API wrapper used by pages. Attaches Firebase ID token when available.
// Exports listingsAPI and ordersAPI.

import { getAuth } from "firebase/auth";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function call(path, method = "GET", body) {
  const auth = getAuth();
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // try parse JSON safely
  const text = await res.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || res.statusText || "API error";
    throw new Error(msg);
  }
  return data;
}

export const listingsAPI = {
  // getAll({ category, limit, page })
  getAll: (opts = {}) => {
    const q = new URLSearchParams();
    if (opts.category) q.set("category", opts.category);
    if (opts.limit) q.set("limit", opts.limit);
    if (opts.page) q.set("page", opts.page);
    const qp = q.toString() ? `?${q.toString()}` : "";
    return call(`/listings${qp}`, "GET");
  },

  // get single listing
  getOne: (id) => call(`/listings/${id}`, "GET"),

  // create new listing (protected)
  create: (payload) => call(`/listings`, "POST", payload),

  // update listing (protected)
  update: (id, payload) => call(`/listings/${id}`, "PUT", payload),

  // delete listing (protected)
  remove: (id) => call(`/listings/${id}`, "DELETE"),

  // convenience wrapper
  fetchByCategory: (category, limit = 12, page = 1) =>
    listingsAPI.getAll({ category, limit, page }),
};

export const ordersAPI = {
  // create an order (protected)
  create: (payload) => call(`/orders`, "POST", payload),

  // get current user's orders (protected)
  getMine: () => call(`/orders`, "GET"),

  // admin / other endpoints (if your server exposes them)
  getAll: () => call(`/orders/all`, "GET"),
  // you can add more helpers as needed
};
