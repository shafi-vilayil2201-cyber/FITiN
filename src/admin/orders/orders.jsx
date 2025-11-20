import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const eqId = (a, b) => String(a) === String(b);

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      setError("");
      try {
        const [ordersRes, usersRes] = await Promise.all([
          fetch(`${API_BASE}/orders`),
          fetch(`${API_BASE}/users`),
        ]);

        if (!mounted) return;

        let ordersData = [];
        if (ordersRes.ok) {
          const od = await ordersRes.json();
          ordersData = Array.isArray(od) ? od : [];
        } else {
          console.warn("orders fetch returned non-ok:", ordersRes.status);
          ordersData = [];
        }
        let usersData = [];
        if (usersRes.ok) {
          usersData = await usersRes.json();
        } else {
          console.warn("[orders] /users fetch returned non-ok:", usersRes.status);
        }
        const map = {};
        if (Array.isArray(usersData)) {
          usersData.forEach((u) => {
            map[String(u.id)] = u;
          });
        }

        setUsersMap(map);
        setOrders(ordersData);
      } catch (err) {
        console.error("[orders] loadAll failed:", err);
        setError("Unable to load orders. Check server or network.");
        setOrders([]);
        setUsersMap({});
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/users`),
      ]);

      const od = ordersRes.ok ? await ordersRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];

      const map = {};
      if (Array.isArray(usersData)) usersData.forEach((u) => (map[String(u.id)] = u));
      setUsersMap(map);
      setOrders(Array.isArray(od) ? od : []);
      setError("");
    } catch (err) {
      console.error("[orders] refresh failed:", err);
      setError("Unable to refresh orders.");
    } finally {
      setLoading(false);
    }
  };

  const displayCustomer = (o) => {
    if (o.shippingDetails && o.shippingDetails.name) return o.shippingDetails.name;
    const u = usersMap[String(o.userId)];
    if (u && (u.name || u.email)) return u.name || u.email;
    return "—";
  };

  const displayTotal = (o) => {
    if (o.totalAmount !== undefined) return `₹${o.totalAmount}`;
    if (o.total !== undefined) return `₹${o.total}`;
    if (Array.isArray(o.items)) {
      const sum = o.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
      return `₹${sum}`;
    }
    return "—";
  };

  async function updateOrderStatus(orderId, newStatus) {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    const targetId = String(orderId);
    setUpdating(orderId);

    const prevOrders = orders.slice();
    setOrders((prev) => prev.map((o) => (eqId(o.id, targetId) ? { ...o, status: newStatus } : o)));

    try {
      const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(targetId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn(`[orders] PATCH /orders/${targetId} returned ${res.status}: ${text}`);
        throw new Error(`Top-level patch failed: ${res.status}`);
      }

      await refresh();
    } catch (err) {
      console.error("[orders] updateOrderStatus failed:", err);
      alert("Failed to update status. See console for details.");
      setOrders(prevOrders); 
    } finally {
      setUpdating(null);
    }
  }

  async function deleteOrder(orderId) {
    if (!window.confirm("Delete this order? This action cannot be undone.")) return;
    const targetId = String(orderId);
    setDeleting(orderId);

    const prevOrders = orders.slice();
    setOrders((prev) => prev.filter((o) => !eqId(o.id, targetId)));
    try {
      const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(targetId)}`, { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn(`[orders] DELETE /orders/${targetId} returned ${res.status}: ${text}`);
        throw new Error(`Top-level delete failed: ${res.status}`);
      }

      await refresh();
    } catch (err) {
      console.error("[orders] deleteOrder failed:", err);
      alert("Failed to delete order. See console for details.");
      setOrders(prevOrders);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Orders</h2>
          <p className="text-sm text-slate-500">Recent orders and status</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={refresh} className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow">
            Refresh
          </button>
        </div>
      </header>

      <div className="bg-white border p-5 rounded-2xl overflow-hidden shadow-xl border-emerald-100/20 bg-gradient-to-b from-emerald-100 to-white group transform transition-all duration-200 hover:shadow-lg">
        <div className="overflow-x-auto rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 ">
              <tr>
                <th className="px-4 py-3 text-left text-slate-600 ">#</th>
                <th className="px-4 py-3 text-left text-slate-600">Order ID</th>
                <th className="px-4 py-3 text-left text-slate-600">Customer</th>
                <th className="px-4 py-3 text-left text-slate-600">Total</th>
                <th className="px-4 py-3 text-left text-slate-600">Date</th>
                <th className="px-4 py-3 text-left text-slate-600">Status</th>
                <th className="px-4 py-3 text-right text-slate-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-red-600">{error}</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">No orders</td>
                </tr>
              ) : (
                orders.map((o, i) => {
                  const isExpanded = String(expanded) === String(o.id);
                  return (
                    <React.Fragment key={String(o.id)}>
                      <tr className="bg-slate-50 hover:bg-white/80 hover:shadow-md hover:-translate-y-1 transition-all">
                        <td className="px-4 py-3 align-top">{i + 1}</td>
                        <td className="px-4 py-3 align-top text-slate-700 font-medium">{o.id}</td>
                        <td className="px-4 py-3 align-top">{displayCustomer(o)}</td>
                        <td className="px-4 py-3 align-top">{displayTotal(o)}</td>
                        <td className="px-4 py-3 align-top text-slate-500">{o.orderDate ? new Date(o.orderDate).toLocaleString() : "—"}</td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center gap-3">
                            <select value={o.status || "Pending"} onChange={(e) => updateOrderStatus(o.id, e.target.value)} disabled={updating === o.id} className="text-sm px-2 py-1 rounded-md border">
                              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {updating === o.id && <span className="text-xs text-slate-400">Updating...</span>}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setExpanded(isExpanded ? null : o.id)} className="px-2 py-1 text-sm rounded-md border hover:bg-slate-50">{isExpanded ? "Hide" : "Details"}</button>
                            <button onClick={() => deleteOrder(o.id)} disabled={deleting === o.id} className="px-2 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">
                              {deleting === o.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-white">
                          <td colSpan="7" className="px-4 py-4 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2">
                                <h4 className="font-semibold text-slate-700 mb-2">Items</h4>
                                <div className="space-y-3">
                                  {Array.isArray(o.items) && o.items.length > 0 ? (
                                    o.items.map((it, idx) => (
                                      <div key={idx} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden flex items-center justify-center">
                                          {it.image ? <img src={it.image} alt={it.name} className="object-cover w-full h-full" /> : <span className="text-slate-400">No image</span>}
                                        </div>
                                        <div>
                                          <div className="font-medium text-slate-800">{it.name || it.productName || "—"}</div>
                                          <div className="text-sm text-slate-500">{it.quantity ? `Qty: ${it.quantity}` : "Qty: 1"} • ₹{it.price ?? "—"}</div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-slate-500">No items data</div>
                                  )}
                                </div>
                              </div>

                              <div className="md:col-span-1">
                                <h4 className="font-semibold text-slate-700 mb-2">Shipping</h4>
                                {o.shippingDetails ? (
                                  <div className="text-sm text-slate-600 space-y-1">
                                    <div>{o.shippingDetails.name}</div>
                                    <div>{o.shippingDetails.address}</div>
                                    <div>{o.shippingDetails.city} • {o.shippingDetails.postalCode}</div>
                                    <div>{o.shippingDetails.phone}</div>
                                  </div>
                                ) : (
                                  <div className="text-slate-500">No shipping info</div>
                                )}

                                <div className="mt-4">
                                  <div className="text-sm text-slate-500">Order total</div>
                                  <div className="text-lg font-bold text-slate-800">{displayTotal(o)}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}