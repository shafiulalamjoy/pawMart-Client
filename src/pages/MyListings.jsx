import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { listingsAPI } from "../services/api";

export default function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        // Prefer server-provided user listings
        if (listingsAPI.getMine) {
          const data = await listingsAPI.getMine();
          setItems(Array.isArray(data) ? data : []);
        } else if (listingsAPI.fetchMine) {
          const data = await listingsAPI.fetchMine();
          setItems(Array.isArray(data) ? data : []);
        } else {
          // fallback: fetch all and filter client-side
          const all = (listingsAPI.getAll && await listingsAPI.getAll()) || (listingsAPI.fetchRecent && await listingsAPI.fetchRecent(100)) || [];
          setItems(Array.isArray(all) ? all.filter(it => it.ownerEmail === user?.email) : []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your listings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing?")) return;
    try {
      if (listingsAPI.remove) {
        await listingsAPI.remove(id);
      } else if (listingsAPI.delete) {
        await listingsAPI.delete(id);
      } else {
        throw new Error("Delete API not available");
      }
      setItems(prev => prev.filter(i => (i._id || i.id) !== id));
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      {items.length === 0 ? (
        <div>No listings yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map(it => (
                <tr key={it._id || it.id}>
                  <td className="px-4 py-2"><img src={it.imageUrl || it.image} alt={it.title || it.name} className="w-24 h-16 object-cover rounded" /></td>
                  <td className="px-4 py-2">{it.title || it.name}</td>
                  <td className="px-4 py-2">{it.category}</td>
                  <td className="px-4 py-2">{(it.price === 0 || it.Price === 0) ? "Free" : `${it.price || it.Price} ৳`}</td>
                  <td className="px-4 py-2">{it.location}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => window.location.href = `/listing/${it._id}`} className="px-2 py-1 mr-2 border rounded">View</button>
                    <button onClick={() => handleDelete(it._id || it.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
