import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listingsAPI } from "../services/api";
import toast from "react-hot-toast";

export default function PetsAndSupplies() {
  const { categoryName } = useParams(); // route: /category-filtered-product/:categoryName
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const category = categoryName || ""; // if no param, fetch all
    // try several helpers
    const p = (listingsAPI.fetchByCategory && listingsAPI.fetchByCategory(category, 100, 1))
      || (listingsAPI.getAll && listingsAPI.getAll())
      || (listingsAPI.fetchRecent && listingsAPI.fetchRecent(100))
      || Promise.resolve([]);
    p.then(data => setItems(Array.isArray(data) ? data.filter(Boolean) : []))
     .catch(err => {
       console.error(err);
       toast.error("Failed to load listings");
     })
     .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{categoryName ? `Category: ${categoryName}` : "Pets & Supplies"}</h2>

      {loading ? <div className="text-center py-10">Loading...</div> : (
        items.length === 0 ? (
          <div className="text-center py-10">No listings found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item._id || item.title} className="border rounded overflow-hidden bg-white shadow">
                <img src={item.imageUrl || item.image || "https://via.placeholder.com/800x500?text=No+Image"} alt={item.title || item.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title || item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="mt-2 text-gray-700">{item.location}</p>
                  <p className="mt-2 font-bold">{(item.price === 0 || item.Price === 0) ? "Free for Adoption" : `${(item.price || item.Price)} ৳`}</p>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/listing/${item._id}`} className="px-3 py-2 bg-blue-600 text-white rounded">See Details</Link>
                    {/* optional quick adopt/purchase for public */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
