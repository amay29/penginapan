"use client";

import { useState } from "react";
import { processCafeOrder } from "@/actions/cafe";
import { Coffee, Minus, Plus, ShoppingCart, Trash2, User, Loader2, ArrowRight } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Booking {
  id: string;
  guestName: string;
  unit: { name: string };
}

export default function POSClient({ menuItems, activeBookings }: { menuItems: MenuItem[], activeBookings: Booking[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [guestName, setGuestName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const categories = Array.from(new Set(menuItems.map(i => i.category)));

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    
    const res = await processCafeOrder({
      items: cart.map(i => ({ itemId: i.id, quantity: i.quantity, price: i.price })),
      totalAmount,
      paymentMethod,
      bookingId: paymentMethod === "ROOM_CHARGE" ? selectedBookingId : undefined,
      guestName: paymentMethod !== "ROOM_CHARGE" ? guestName : undefined,
    });

    setLoading(false);
    
    if (res.success) {
      setSuccessMsg("Pesanan berhasil diproses!");
      setCart([]);
      setGuestName("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-6 -m-6 p-6">
      
      {/* Left: Menu Items */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2">
        <h1 className="font-serif text-3xl font-light tracking-wide text-surface-50 mb-6 flex items-center gap-3">
          <Coffee className="h-6 w-6 text-gold-400" />
          Rosa Cafe POS
        </h1>

        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-surface-500 mb-4 pb-2 border-b border-surface-600/30">
              {category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {menuItems.filter(i => i.category === category).map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className="bg-surface-900 border border-surface-600/30 p-4 text-left hover:border-gold-500/50 hover:bg-surface-800 transition-colors group flex flex-col justify-between aspect-square"
                >
                  <span className="text-surface-100 font-medium group-hover:text-gold-400 transition-colors line-clamp-2">
                    {item.name}
                  </span>
                  <span className="text-surface-400 font-mono text-sm mt-4">
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Cart & Checkout */}
      <div className="w-full lg:w-96 flex flex-col bg-surface-900 border border-surface-600/30 shrink-0 h-full overflow-hidden">
        <div className="p-5 border-b border-surface-600/30 flex items-center justify-between bg-surface-950">
          <h2 className="font-serif text-xl text-surface-50 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gold-400" /> Current Order
          </h2>
          <span className="text-xs text-surface-500">{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-surface-500 text-sm">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-surface-950 p-3 border border-surface-600/20">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-surface-100 text-sm truncate font-medium">{item.name}</p>
                  <p className="text-surface-500 font-mono text-xs mt-1">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center border border-surface-600/50 rounded-sm">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-surface-400 hover:text-surface-100 hover:bg-surface-800"><Minus className="h-3 w-3" /></button>
                    <span className="px-2 font-mono text-xs text-surface-100">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-surface-400 hover:text-surface-100 hover:bg-surface-800"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-surface-500 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-surface-600/30 bg-surface-950 space-y-5">
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-surface-400 mb-2">Metode Pembayaran</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-surface-900 border border-surface-600/50 text-surface-100 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none"
              >
                <option value="CASH">Tunai (Cash)</option>
                <option value="QRIS">QRIS / Transfer</option>
                <option value="ROOM_CHARGE">Tagihkan ke Kamar (Room Charge)</option>
              </select>
            </div>

            {paymentMethod === "ROOM_CHARGE" ? (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-surface-400 mb-2">Pilih Kamar / Tamu</label>
                <select 
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full bg-surface-900 border border-surface-600/50 text-surface-100 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none"
                >
                  <option value="">-- Pilih Tamu --</option>
                  {activeBookings.map(b => (
                    <option key={b.id} value={b.id}>{b.unit.name} - {b.guestName}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-surface-400 mb-2 flex items-center gap-1">
                  <User className="h-3 w-3" /> Nama Pemesan (Opsional)
                </label>
                <input 
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Mis. Meja 4 / Walk-in"
                  className="w-full bg-surface-900 border border-surface-600/50 text-surface-100 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors placeholder:text-surface-600"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-surface-600/30 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-surface-500 mb-1">Total</p>
              <p className="font-serif text-2xl text-gold-400">Rp {totalAmount.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2 text-center">
              {successMsg}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading || (paymentMethod === "ROOM_CHARGE" && !selectedBookingId)}
            className="w-full bg-gold-500 text-surface-950 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold-400 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>
                Proses Pembayaran <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
