import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ordersAPI } from "../services/api";
import { getAuth } from "firebase/auth";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        if (ordersAPI.fetchMine) {
          const data = await ordersAPI.fetchMine();
          setOrders(Array.isArray(data) ? data : []);
        } else if (ordersAPI.getMine) {
          const data = await ordersAPI.getMine();
          setOrders(Array.isArray(data) ? data : []);
        } else {
          // fallback: call /api/orders
          const token = await auth.currentUser?.getIdToken();
          const res = await fetch((import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api/orders", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally { setLoading(false); }
    })();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("My Orders", 14, 20);
    const rows = orders.map(o => [
      o.listingName || o.productName,
      o.buyerName,
      o.price,
      o.quantity,
      o.address,
      (o.date || "").split("T")[0] || ""
    ]);
    doc.autoTable({
      head: [["Product", "Buyer", "Price", "Qty", "Address", "Date"]],
      body: rows,
      startY: 30,
    });
    doc.save("my-orders.pdf");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded">Download Report (PDF)</button>
      </div>

      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Buyer</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(o => (
                <tr key={o._id || o.id}>
                  <td className="px-4 py-2">{o.listingName || o.productName}</td>
                  <td className="px-4 py-2">{o.buyerName}</td>
                  <td className="px-4 py-2">{o.price}</td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2">{o.address}</td>
                  <td className="px-4 py-2">{(o.date || "").split("T")[0] || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
