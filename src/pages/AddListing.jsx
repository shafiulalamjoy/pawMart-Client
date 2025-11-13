import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { listingsAPI } from "../services/api";
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
      ownerEmail: user?.email,
    };

    setLoading(true);
    try {
      await listingsAPI.create(payload);
      toast.success("Listing created");
      navigate("/my-listings");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow text-gray-900">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Add Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-blue-700">Product / Pet Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-600 focus:ring-blue-600"
          />
        </div>

        {/* Category + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
            >
              <option>Pets</option>
              <option>Food</option>
              <option>Accessories</option>
              <option>Care</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700">Price (৳)</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min="0"
              disabled={category === "Pets"}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
              placeholder={category === "Pets" ? "0 (adoption)" : "Enter price"}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
            placeholder="City, area"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Image URL</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
            placeholder="https://..."
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Pick Up Date</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-blue-600"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Your Email</label>
          <input
            value={user?.email || ""}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-700"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Saving..." : "Save Listing"}
        </button>

      </form>
    </div>
  );
}
