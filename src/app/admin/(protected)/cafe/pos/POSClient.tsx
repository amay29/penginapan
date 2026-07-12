"use client";

import { useState, useEffect } from "react";
import { processCafeOrder } from "@/actions/cafe";
import { Coffee, Minus, Plus, ShoppingCart, Trash2, User, Loader2, ArrowRight, Sun, Moon, Printer } from "lucide-react";
import "./print.css";

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
  
  // State to hold the last completed order for printing
  const [lastOrder, setLastOrder] = useState<{
    items: CartItem[];
    total: number;
    paymentMethod: string;
    guestName: string;
    date: Date;
  } | null>(null);

  const [isLightMode, setIsLightMode] = useState(false);

  const t = {
    bg: isLightMode ? "bg-surface-100 text-surface-950" : "",
    panel: isLightMode ? "bg-white border-surface-200" : "bg-surface-900 border-surface-600/30",
    item: isLightMode ? "bg-white border-surface-200 hover:border-gold-500 hover:bg-surface-50" : "bg-surface-900 border-surface-600/30 hover:border-gold-500/50 hover:bg-surface-800",
    textHeader: isLightMode ? "text-surface-950" : "text-surface-50",
    textMuted: isLightMode ? "text-surface-500" : "text-surface-400",
    cartItemBg: isLightMode ? "bg-white border-surface-200" : "bg-surface-950 border-surface-600/20",
    input: isLightMode ? "bg-white border-surface-300 text-surface-950" : "bg-surface-900 border-surface-600/50 text-surface-100",
    divider: isLightMode ? "border-surface-200" : "border-surface-600/30",
    cartHeader: isLightMode ? "bg-surface-50" : "bg-surface-950",
  };

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
      
      // Save order for receipt printing
      setLastOrder({
        items: [...cart],
        total: totalAmount,
        paymentMethod,
        guestName: guestName || (paymentMethod === "ROOM_CHARGE" ? "Room Charge" : "Walk-in"),
        date: new Date()
      });

      setCart([]);
      setGuestName("");
      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      alert(res.error);
    }
  };

  return (
    <>
      <div className={`flex flex-col lg:flex-row h-[calc(100vh-80px)] gap-6 -m-6 p-6 transition-colors duration-300 ${t.bg}`}>
      
      {/* Left: Menu Items */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`font-serif text-3xl font-light tracking-wide flex items-center gap-3 ${t.textHeader}`}>
            <Coffee className="h-6 w-6 text-gold-500" />
            Rosa Cafe POS
          </h1>
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className={`p-2 rounded-full border transition-colors ${isLightMode ? 'border-surface-300 bg-white hover:bg-surface-100 text-surface-600' : 'border-surface-600/50 bg-surface-800 hover:bg-surface-700 text-surface-400'}`}
            title="Toggle Light/Dark Mode"
          >
            {isLightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className={`text-xs uppercase tracking-widest mb-4 pb-2 border-b ${t.textMuted} ${t.divider}`}>
              {category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {menuItems.filter(i => i.category === category).map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`${t.item} border p-4 text-left transition-colors group flex flex-col justify-between aspect-square rounded-sm`}
                >
                  <span className={`${isLightMode ? 'text-surface-900' : 'text-surface-100'} font-medium group-hover:text-gold-500 transition-colors line-clamp-2`}>
                    {item.name}
                  </span>
                  <span className={`${t.textMuted} font-mono text-sm mt-4`}>
                    Rp {item.price.toLocaleString("id-ID")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Cart & Checkout */}
      <div className={`w-full lg:w-96 flex flex-col border shrink-0 h-full overflow-hidden rounded-sm transition-colors ${t.panel}`}>
        <div className={`p-5 border-b flex items-center justify-between transition-colors ${t.divider} ${t.cartHeader}`}>
          <h2 className={`font-serif text-xl flex items-center gap-2 ${t.textHeader}`}>
            <ShoppingCart className="h-5 w-5 text-gold-500" /> Current Order
          </h2>
          <span className={`text-xs ${t.textMuted}`}>{cart.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className={`h-full flex flex-col items-center justify-center text-sm ${t.textMuted}`}>
              <ShoppingCart className="h-12 w-12 mb-3 opacity-20" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-3 border rounded-sm transition-colors ${t.cartItemBg}`}>
                <div className="flex-1 min-w-0 pr-4">
                  <p className={`text-sm truncate font-medium ${isLightMode ? 'text-surface-900' : 'text-surface-100'}`}>{item.name}</p>
                  <p className={`font-mono text-xs mt-1 ${t.textMuted}`}>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`flex items-center border rounded-sm ${isLightMode ? 'border-surface-200' : 'border-surface-600/50'}`}>
                    <button onClick={() => updateQuantity(item.id, -1)} className={`px-2 py-1 ${t.textMuted} hover:text-gold-500`}><Minus className="h-3 w-3" /></button>
                    <span className={`px-2 font-mono text-xs ${isLightMode ? 'text-surface-900' : 'text-surface-100'}`}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className={`px-2 py-1 ${t.textMuted} hover:text-gold-500`}><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-surface-500 hover:text-red-400 p-1"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`p-5 border-t space-y-5 transition-colors ${t.divider} ${t.cartHeader}`}>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-[10px] uppercase tracking-widest mb-2 ${t.textMuted}`}>Metode Pembayaran</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none rounded-sm ${t.input}`}
              >
                <option value="CASH">Tunai (Cash)</option>
                <option value="QRIS">QRIS / Transfer</option>
                <option value="ROOM_CHARGE">Tagihkan ke Kamar (Room Charge)</option>
              </select>
            </div>

            {paymentMethod === "ROOM_CHARGE" ? (
              <div>
                <label className={`block text-[10px] uppercase tracking-widest mb-2 ${t.textMuted}`}>Pilih Kamar / Tamu</label>
                <select 
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none rounded-sm ${t.input}`}
                >
                  <option value="">-- Pilih Tamu --</option>
                  {activeBookings.map(b => (
                    <option key={b.id} value={b.id}>{b.unit.name} - {b.guestName}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className={`block text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1 ${t.textMuted}`}>
                  <User className="h-3 w-3" /> Nama Pemesan (Opsional)
                </label>
                <input 
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Mis. Meja 4 / Walk-in"
                  className={`w-full border px-3 py-2 text-sm focus:outline-none focus:border-gold-500 transition-colors rounded-sm ${t.input} ${isLightMode ? 'placeholder:text-surface-400' : 'placeholder:text-surface-600'}`}
                />
              </div>
            )}
          </div>

          <div className={`pt-4 border-t flex items-end justify-between ${t.divider}`}>
            <div>
              <p className={`text-[10px] uppercase tracking-widest mb-1 ${t.textMuted}`}>Total</p>
              <p className="font-serif text-2xl text-gold-500">Rp {totalAmount.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-3 text-center rounded-sm flex flex-col gap-2">
              <p>{successMsg}</p>
              {lastOrder && (
                <button 
                  onClick={() => window.print()}
                  className="bg-emerald-600 text-white py-2 rounded-sm hover:bg-emerald-500 flex items-center justify-center gap-2 font-medium"
                >
                  <Printer className="h-4 w-4" /> Cetak Struk
                </button>
              )}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading || (paymentMethod === "ROOM_CHARGE" && !selectedBookingId)}
            className="w-full bg-gold-500 text-surface-950 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-gold-400 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors rounded-sm"
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

    {/* Hidden Receipt Element for Printing */}
    {lastOrder && (
      <div id="receipt-print" className="hidden">
        <div className="text-center mb-4 border-b border-dashed border-black pb-4">
          <h2 className="text-xl font-bold m-0">Rosa Cafe</h2>
          <p className="text-xs m-0 mt-1">Glamping & Pool</p>
          <p className="text-xs m-0 mt-1">{lastOrder.date.toLocaleString("id-ID")}</p>
        </div>
        
        <div className="mb-2">
          <p className="text-xs m-0">Tamu: {lastOrder.guestName}</p>
          <p className="text-xs m-0">Bayar: {lastOrder.paymentMethod}</p>
        </div>

        <table className="w-full text-xs mt-4 mb-4 border-b border-dashed border-black pb-4">
          <tbody>
            {lastOrder.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-1">{item.name} <br/> {item.quantity}x @ {item.price.toLocaleString("id-ID")}</td>
                <td className="py-1 text-right align-bottom">{(item.price * item.quantity).toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL:</span>
          <span>Rp {lastOrder.total.toLocaleString("id-ID")}</span>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-dashed border-black">
          <p className="text-xs">Terima kasih atas kunjungan Anda!</p>
        </div>
      </div>
    )}
    </>
  );
}
