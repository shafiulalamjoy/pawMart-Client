// src/services/api.js
import { auth } from "../firebase/initFirebase"; // path relative to src/services
// If you prefer getAuth():
// import { getAuth } from "firebase/auth";

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000"; // change to your backend

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken(/* forceRefresh */ false);
  } catch (err) {
    console.warn("Failed to get ID token", err);
    return null;
  }
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = headers["Content-Type"] || "application/json";

  // attach token when available
  const token = await getIdToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    // try to parse error body
    let body;
    try { body = await res.json(); } catch (e) { body = await res.text(); }
    const err = new Error(body?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.body = body;
    throw err;
  }

  // return json if possible, else text
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

export const listingsAPI = {
  // create a new listing (POST /listings)
  async create(payload) {
    return request("/listings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // get recent listings (GET /listings?limit=6)
  async list({ limit = 6, page = 1 } = {}) {
    const q = new URLSearchParams({ limit: String(limit), page: String(page) }).toString();
    return request(`/listings?${q}`, { method: "GET" });
  },

  // get a single listing by id (GET /listings/:id)
  async get(id) {
    return request(`/listings/${encodeURIComponent(id)}`, { method: "GET" });
  },

  // optionally add update/delete methods if your backend supports them
  async update(id, payload) {
    return request(`/listings/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async remove(id) {
    return request(`/listings/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
