import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MessageCircle, 
  Truck, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem, StoreSettings } from '../types';
import { formatTZS, generateWhatsAppMessage } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  selectedDeliveryZone: string;
  onSelectDeliveryZone: (zone: string) => void;
  onUpdateQuantity: (productId: string, quantity: number, size?: string) => void;
  onRemoveItem: (productId: string, size?: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  selectedDeliveryZone,
  onSelectDeliveryZone,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const currentZoneRate = settings.deliveryRates.find(
    (rate) => rate.zone === selectedDeliveryZone
  ) || settings.deliveryRates[0];

  const deliveryFee = currentZoneRate ? currentZoneRate.fee : 0;
  const total = subtotal + deliveryFee;

  const handleWhatsAppCheckoutDirect = () => {
    const draftOrder = {
      id: 'HOC-WA' + Math.floor(1000 + Math.random() * 9000),
      customerName: 'Boutique Customer',
      customerPhone: 'Provided on WhatsApp',
      deliveryAddress: 'Dodoma / Inquired via WhatsApp',
      deliveryZone: selectedDeliveryZone,
      deliveryFee,
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        selectedSize: i.selectedSize,
        selectedColor: i.selectedColor,
        image: i.product.images[0],
      })),
      subtotal,
      total,
      paymentMethod: 'whatsapp' as const,
      checkoutType: 'whatsapp' as const,
    };

    const encoded = generateWhatsAppMessage(draftOrder, settings);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e13] border-l border-[#262633] text-[#f4eedb] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#21212d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
              <h2 className="font-serif-luxury text-xl font-bold tracking-wide text-white">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9a9485] hover:text-white hover:bg-[#1a1a24] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181822] flex items-center justify-center text-[#c5a059]">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif-luxury text-lg text-white font-semibold">Your bag is empty</p>
                  <p className="text-xs text-[#8f887b]">
                    Explore our latest official wear, shoes, rings & perfumes.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#c5a059] text-black text-xs font-semibold uppercase tracking-wider hover:brightness-110 cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-3 bg-[#13131a] p-3 border border-[#20202c]"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-24 object-cover object-top shrink-0 bg-[#1c1c26]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif-luxury text-sm font-semibold text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          className="text-[#736e64] hover:text-red-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#9a9486] mt-0.5">
                        {item.selectedSize && (
                          <span className="font-mono bg-[#1c1c28] px-1.5 py-0.5 border border-[#2c2c3b]">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-[10px] text-[#baa884]">
                            {item.selectedColor}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-mono font-bold text-[#e5c378] mt-1">
                        {formatTZS(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1d1d28]">
                      <div className="flex items-center border border-[#2a2a38] bg-[#161622]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                          className="p-1 text-[#bbb] hover:text-[#c5a059]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                          className="p-1 text-[#bbb] hover:text-[#c5a059]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono text-[#ded8cb]">
                        {formatTZS(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout Options */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#0a0a0e] border-t border-[#21212d] space-y-4">
              {/* Delivery Zone Selection */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs text-[#ded8cb]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-[#c5a059]" />
                    Delivery / Pickup Destination:
                  </span>
                  <span className="text-[#c5a059] font-mono font-bold">
                    {deliveryFee === 0 ? 'FREE' : formatTZS(deliveryFee)}
                  </span>
                </label>
                <select
                  value={selectedDeliveryZone}
                  onChange={(e) => onSelectDeliveryZone(e.target.value)}
                  className="w-full bg-[#14141c] text-[#f4eedb] border border-[#2b2b3a] text-xs p-2.5 focus:border-[#c5a059] focus:outline-none cursor-pointer"
                >
                  {settings.deliveryRates.map((rate) => (
                    <option key={rate.zone} value={rate.zone}>
                      {rate.zone} ({rate.fee === 0 ? 'FREE' : formatTZS(rate.fee)})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#8e8779]">
                  {currentZoneRate?.description}
                </p>
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-[#1d1d28] text-xs">
                <div className="flex justify-between text-[#a09a8e]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#ded8cb]">{formatTZS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#a09a8e]">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-[#ded8cb]">
                    {deliveryFee === 0 ? 'FREE' : formatTZS(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-[#222230]">
                  <span className="font-serif-luxury tracking-wide">Total Amount</span>
                  <span className="font-mono text-[#e5c378] text-base">{formatTZS(total)}</span>
                </div>
              </div>

              {/* Two Distinct Checkout Buttons */}
              <div className="space-y-2 pt-2">
                {/* 1. Direct Website Checkout */}
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black font-bold text-xs uppercase tracking-[0.16em] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/10 cursor-pointer"
                >
                  <span>Website Checkout (M-Pesa / Tigo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 2. WhatsApp Checkout */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckoutDirect}
                  className="w-full py-3 px-4 bg-[#14281a] border border-[#245432] text-[#25D366] hover:bg-[#1a3523] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Checkout (Olivia ❤️)</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] text-[#736e63] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#c5a059]" /> Lipa Till: {settings.mpesaTillNumber}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#c5a059]" /> Near CBE College
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
