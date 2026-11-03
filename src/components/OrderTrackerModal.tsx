import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MessageCircle,
  Package
} from 'lucide-react';
import { Order, OrderStatus, StoreSettings } from '../types';
import { api, formatTZS } from '../services/api';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Imepokelewa (Pending)', desc: 'Boutique is preparing your items' },
  { status: 'Dispatched', label: 'Iko Njia (Dispatched)', desc: 'Out for delivery in Dodoma / via courier' },
  { status: 'Delivered', label: 'Imefika (Delivered)', desc: 'Successfully delivered to customer' },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const results = await api.trackOrder(query.trim());
      setOrders(results);
      if (results.length === 0) {
        setError(`Hakuna oda iliyopatikana kwa "${query}". Hakikisha umeingiza Order ID sahihi (mfano HOC-4921) au namba ya simu uliyoweka wakati wa oda.`);
      }
    } catch (err: any) {
      setError(err.message || 'Hitilafu imetokea wakati wa kutafuta oda.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Pending') return 0;
    if (status === 'Dispatched') return 1;
    if (status === 'Delivered') return 2;
    return -1; // Cancelled
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-2xl bg-[#0f0f14] border border-[#272736] text-[#f4eedb] shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#9a9486] hover:text-white hover:bg-[#1a1a24] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#d4af37] uppercase font-bold">
              HOME OF CHROMEWELL Delivery Tracking
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
              Fuatilia Oda Yako (Track Your Order)
            </h2>
            <p className="text-xs text-[#a8a192]">
              Ingiza Order Reference (e.g. <strong className="text-[#e5c378]">HOC-4921</strong>) au namba yako ya simu. Mawasiliano: <strong className="text-white">Olivia ❤️</strong> ({settings.phoneDisplay}).
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#736e63]" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ingiza HOC-XXXX au 07XXXXXXXX..."
                className="w-full bg-[#15151e] border border-[#2b2b3a] focus:border-[#c5a059] pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#c5a059] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
            >
              {loading ? 'Inatafuta...' : 'Tafuta'}
            </button>
          </form>

          {error && (
            <div className="bg-red-950/60 border border-red-800 text-red-200 text-xs p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Results List */}
          {orders.length > 0 && (
            <div className="space-y-4 pt-3 max-h-[50vh] overflow-y-auto pr-1">
              {orders.map((order) => {
                const stepIdx = getStepIndex(order.status);
                return (
                  <div
                    key={order.id}
                    className="bg-[#14141c] border border-[#262636] p-4 sm:p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#21212e] pb-3">
                      <div>
                        <span className="font-mono text-sm font-bold text-[#e5c378]">
                          {order.id}
                        </span>
                        <span className="text-xs text-[#8e8779] ml-2">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase px-2 py-0.5 font-bold tracking-wider bg-[#221c10] border border-[#c5a059] text-[#e5c378]">
                          {order.status}
                        </span>
                        <span className="font-mono text-xs font-bold text-white">
                          {formatTZS(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    {order.status !== 'Cancelled' ? (
                      <div className="py-2">
                        <div className="grid grid-cols-3 gap-2 text-center relative">
                          {STATUS_STEPS.map((step, idx) => {
                            const isDone = stepIdx >= idx;
                            const isCurrent = stepIdx === idx;
                            return (
                              <div key={step.status} className="flex flex-col items-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                                    isDone
                                      ? 'bg-[#c5a059] text-black shadow-md shadow-[#c5a059]/20'
                                      : 'bg-[#20202c] text-[#777]'
                                  }`}
                                >
                                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className={`text-[11px] font-medium leading-tight ${isCurrent ? 'text-[#e5c378] font-bold' : isDone ? 'text-white' : 'text-[#777]'}`}>
                                  {step.label.split(' ')[0]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-950/40 p-2 text-xs text-red-300">
                        Oda hii imesitishwa (Order has been cancelled).
                      </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-1.5 text-xs text-[#cfc8b8] pt-1 border-t border-[#1e1e2b]">
                      <p className="text-[11px] text-[#8e8779] uppercase font-semibold">Vitu vilivyomo:</p>
                      {order.items.map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {it.quantity}x {it.name} {it.selectedSize ? `(${it.selectedSize})` : ''}
                          </span>
                          <span className="font-mono text-[#a8a192]">
                            {formatTZS(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & WhatsApp contact */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1e1e2b] text-[11px] text-[#8e8779]">
                      <span>Kuletewa: <strong className="text-white">{order.deliveryAddress}</strong></span>
                      <a
                        href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Habari Olivia ❤️, ninaulizia maendeleo ya oda yangu ya HOME OF CHROMEWELL Ref: ${order.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline flex items-center gap-1 font-medium"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Uliza Olivia ❤️ (WhatsApp)</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
