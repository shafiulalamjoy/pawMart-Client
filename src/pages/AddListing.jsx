import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { listingsAPI } from "../services/api"; // earlier wrapper that attaches token
import { useNavigate } from "react-router-dom";

export default function AddListing() {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Pets");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // set price to 0 if Pets selected and price empty
  const effectivePrice = category === "Pets" ? 0 : Number(price || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      title,
      category,
      price: effectivePrice,
      location,
      description,
      imageUrl,
      date: date || null,
      // email is set server-side from token; but keep for readonly display
      ownerEmail: user?.email,
    };

    setLoading(true);
    try {
      const created = await listingsAPI.create(payload);
      toast.success("Listing created");
      // navigate to details or my listings
      navigate("/my-listings");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product / Pet Name</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2">
              <option>Pets</option>
              <option>Food</option>
              <option>Accessories</option>
              <option>Care</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Price (৳) </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              disabled={category === "Pets"}
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder={category === "Pets" ? "0 (adoption)" : "Enter price"}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="City, area" />
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium">Pick Up Date</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium">Your Email</label>
          <input value={user?.email || ""} readOnly className="mt-1 block w-full border rounded px-3 py-2 bg-gray-50" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Saving..." : "Save Listing"}
        </button>
      </form>
    </div>
  );
}
