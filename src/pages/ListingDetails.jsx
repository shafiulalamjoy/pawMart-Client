import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listingsAPI, ordersAPI } from "../services/api";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";

export default function ListingDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // order modal state
  const [showOrder, setShowOrder] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    setLoading(true);
    const p = (listingsAPI.fetchOne && listingsAPI.fetchOne(id))
      || (listingsAPI.getOne && listingsAPI.getOne(id))
      || (listingsAPI.get && listingsAPI.get(id))
      || Promise.reject(new Error("listingsAPI.getOne not available"));
    p.then(setItem).catch(err => {
      console.error(err);
      toast.error("Failed to load listing");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return toast.error("You must be signed in");
    setOrdering(true);
    const payload = {
      listingId: item._id || id,
      listingName: item.title || item.name,
      buyerName: user.displayName || user.email,
      price: item.price || item.Price || 0,
      quantity: item.category === "Pets" ? 1 : (1),
      address,
      date: date || new Date().toISOString(),
      phone,
      notes,
    };
    try {
      if (ordersAPI.create) {
        await ordersAPI.create(payload);
      } else {
        // fallback: direct fetch
        const token = await user.getIdToken();
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      toast.success("Order placed");
      setShowOrder(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!item) return <div className="p-6">Listing not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={item.imageUrl || item.image || "https://via.placeholder.com/800x500?text=No+Image"} alt={item.title} className="w-full h-96 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold">{item.title || item.name}</h1>
          <p className="text-sm text-gray-600 mt-1">{item.category}</p>
          <p className="mt-4 text-gray-800">{item.description}</p>
          <p className="mt-4 font-bold">{(item.price === 0 || item.Price === 0) ? "Free for Adoption" : `${(item.price || item.Price)} ৳`}</p>
          <p className="mt-2 text-gray-600">Location: {item.location}</p>
          <p className="mt-2 text-gray-600">Owner: {item.ownerEmail || item.email}</p>

          <div className="mt-6">
            <button onClick={() => setShowOrder(true)} className="px-4 py-2 bg-green-600 text-white rounded">
              Adopt / Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Order / Adopt</h3>
            <form onSubmit={handleOrder} className="space-y-3">
              <div>
                <label className="block text-sm">Name</label>
                <input value={getAuth().currentUser?.displayName || getAuth().currentUser?.email} readOnly className="mt-1 block w-full border rounded px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm">Email</label>
                <input value={getAuth().currentUser?.email} readOnly className="mt-1 block w-full border rounded px-3 py-2 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm">Address</label>
                <input value={address} onChange={e=>setAddress(e.target.value)} required className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm">Phone</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} required className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm">Pick Up Date</label>
                <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="mt-1 block w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm">Notes</label>
                <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows="3" className="mt-1 block w-full border rounded px-3 py-2" />
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={()=>setShowOrder(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={ordering} className="px-3 py-2 bg-blue-600 text-white rounded">
                  {ordering ? "Placing..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
