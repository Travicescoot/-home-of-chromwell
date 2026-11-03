import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  ArrowLeft,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { CartItem, Order, StoreSettings } from '../types';
import { api, formatTZS, generateWhatsAppMessage } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: StoreSettings;
  selectedDeliveryZone: string;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  selectedDeliveryZone,
  onOrderSuccess,
  onClearCart,
}) => {
  if (!isOpen) return null;

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState(selectedDeliveryZone || settings.deliveryRates[0].zone);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'airtel' | 'tigopesa' | 'cash_on_delivery'>('mpesa');
  const [paymentReference, setPaymentReference] = useState('');
  
  // Processing & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedTill, setCopiedTill] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const zoneRate = settings.deliveryRates.find((r) => r.zone === deliveryZone) || settings.deliveryRates[0];
  const deliveryFee = zoneRate ? zoneRate.fee : 0;
  const total = subtotal + deliveryFee;

  const handleCopyTill = () => {
    navigator.clipboard.writeText(settings.mpesaTillNumber);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  const validate = (): boolean => {
    if (!customerName.trim()) {
      setError('Tafadhali ingiza jina lako kamili (Please enter your full name).');
      return false;
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      setError('Tafadhali ingiza namba sahihi ya simu ya Tanzania (e.g. 0765892411 au +255...).');
      return false;
    }
    if (!deliveryAddress.trim()) {
      setError('Tafadhali weka anwani yako ya Dodoma au mtaa unaotaka kuletewa (Delivery address required).');
      return false;
    }
    setError(null);
    return true;
  };

  // 1. Direct Website Checkout
  const handleWebsiteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData: Partial<Order> = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryZone,
        deliveryFee,
        notes: notes.trim(),
        paymentMethod,
        paymentReference: paymentReference.trim(),
        checkoutType: 'website',
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.product.images[0],
        })),
      };

      const created = await api.createOrder(orderData);
      setCompletedOrder(created);
      onOrderSuccess(created);
      onClearCart();
    } catch (err: any) {
      setError(err.message || 'Hitilafu imetokea wakati wa kutuma oda. Jaribu tena au tumia WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. WhatsApp Checkout
  const handleWhatsAppCheckout = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData: Partial<Order> = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryZone,
        deliveryFee,
        notes: notes.trim(),
        paymentMethod: 'whatsapp',
        checkoutType: 'whatsapp',
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.product.images[0],
        })),
      };

      const created = await api.createOrder(orderData);
      setCompletedOrder(created);
      onOrderSuccess(created);
      onClearCart();

      // Open WhatsApp with populated message
      const encoded = generateWhatsAppMessage(created, settings);
      window.open(`https://wa.me/${settings.whatsappNumber}?text=${encoded}`, '_blank');
    } catch (err: any) {
      setError(err.message || 'Hitilafu imetokea. Tafadhali jaribu tena.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-2xl bg-[#0e0e13] border border-[#272736] text-[#f4eedb] shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!completedOrder && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#9a9486] hover:text-white hover:bg-[#1a1a24] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* View A: ORDER CONFIRMATION / SUCCESS */}
        {completedOrder ? (
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 bg-[#162a1b] border border-[#2b5e39] text-[#25D366] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#25D366]/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-widest text-[#d4af37] uppercase font-bold">
                Order Received • HOME OF CHROMEWELL
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-white">
                Ahsante, {completedOrder.customerName}!
              </h2>
              <p className="text-sm text-[#b8b09f] max-w-md mx-auto">
                Oda yako imepokelewa rasmi na <strong className="text-white">Olivia ❤️</strong>. Kumbukumbu namba yako ya ufuatiliaji ni:
              </p>
              <div className="inline-block bg-[#171722] border border-[#303042] px-4 py-2 font-mono text-xl font-bold text-[#e5c378] tracking-widest">
                {completedOrder.id}
              </div>
            </div>

            {/* Payment Prompt if M-Pesa */}
            {completedOrder.paymentMethod === 'mpesa' && (
              <div className="bg-[#15151f] border border-[#37374b] p-4 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-[#252533] pb-2">
                  <span className="text-xs font-semibold uppercase text-white flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#c5a059]" /> Lipa Kwa M-Pesa Till
                  </span>
                  <span className="font-mono text-sm font-bold text-[#e5c378]">
                    {formatTZS(completedOrder.total)}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-[#cfc8b8]">
                  <p>1. Piga <strong className="text-white">*150*00#</strong></p>
                  <p>2. Chagua <strong>Lipa kwa M-Pesa</strong></p>
                  <p>3. Chagua <strong>Nunua Bidhaa (Buy Goods)</strong></p>
                  <div className="flex items-center justify-between bg-[#1f1f2c] p-2 border border-[#3b3b4f]">
                    <span>Namba ya Till: <strong className="font-mono text-[#e5c378] text-sm">{settings.mpesaTillNumber}</strong></span>
                    <button
                      onClick={handleCopyTill}
                      className="text-xs bg-[#2b2b3a] px-2 py-1 text-[#e5c378] flex items-center gap-1 cursor-pointer hover:bg-[#39394d]"
                    >
                      {copiedTill ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedTill ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#9b9486]">Jina la Biashara: <strong className="text-white">{settings.mpesaTillName}</strong></p>
                </div>
              </div>
            )}

            {/* Actions after order */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${generateWhatsAppMessage(completedOrder, settings)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#152e1c] border border-[#265d36] text-[#25D366] hover:bg-[#1c3e26] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm with Olivia ❤️ ({settings.phoneDisplay})</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-[#c5a059] text-black hover:brightness-110 text-xs font-bold uppercase tracking-wider"
              >
                Back to Boutique
              </button>
            </div>
          </div>
        ) : (
          /* View B: CHECKOUT FORM */
          <form onSubmit={handleWebsiteCheckout} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#c5a059] uppercase tracking-wider font-semibold">
                <Truck className="w-4 h-4" />
                <span>Secure Checkout • Dodoma, Tanzania</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
                Customer & Delivery Details
              </h2>
            </div>

            {error && (
              <div className="bg-red-950/60 border border-red-800 text-red-200 text-xs p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#cfc8b8] mb-1 font-medium">
                    Jina Kamili (Full Name) *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7468]" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Amina Kiangi"
                      className="w-full bg-[#15151e] border border-[#2b2b3a] focus:border-[#c5a059] pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#cfc8b8] mb-1 font-medium">
                    Namba ya Simu (Phone / WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a7468]" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 0765 892 411 / +255..."
                      className="w-full bg-[#15151e] border border-[#2b2b3a] focus:border-[#c5a059] pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc8b8] mb-1 font-medium">
                  Eneo la Kuletewa / Kuchukua (Delivery / Pickup Zone) *
                </label>
                <select
                  value={deliveryZone}
                  onChange={(e) => setDeliveryZone(e.target.value)}
                  className="w-full bg-[#15151e] border border-[#2b2b3a] focus:border-[#c5a059] px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  {settings.deliveryRates.map((rate) => (
                    <option key={rate.zone} value={rate.zone}>
                      {rate.zone} — {rate.fee === 0 ? 'FREE' : formatTZS(rate.fee)} ({rate.description})
                    </option>
                  ))}
                </select>
              </div>

              {/* Exact Delivery Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc8b8] mb-1 font-medium">
                  Anwani Kamili ya Dodoma / Eneo lako (Street, Building, or Hostel) *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#7a7468]" />
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. CBE Campus Hostel Block B, au Area D karibu na St. Gasper, au Kisasa..."
                    className="w-full bg-[#15151e] border border-[#2b2b3a] focus:border-[#c5a059] pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc8b8] mb-2 font-medium">
                  Chaguo la Malipo (Payment Method)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-2.5 text-left border text-xs transition-all cursor-pointer ${
                      paymentMethod === 'mpesa'
                        ? 'bg-[#221c10] border-[#c5a059] text-[#e5c378]'
                        : 'bg-[#15151d] border-[#2b2b39] text-[#aaa]'
                    }`}
                  >
                    <p className="font-bold text-white">Lipa M-Pesa</p>
                    <p className="text-[10px] text-[#999]">Till: {settings.mpesaTillNumber}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel')}
                    className={`p-2.5 text-left border text-xs transition-all cursor-pointer ${
                      paymentMethod === 'airtel'
                        ? 'bg-[#221c10] border-[#c5a059] text-[#e5c378]'
                        : 'bg-[#15151d] border-[#2b2b39] text-[#aaa]'
                    }`}
                  >
                    <p className="font-bold text-white">Airtel Money</p>
                    <p className="text-[10px] text-[#999]">{settings.airtelMoneyNumber}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tigopesa')}
                    className={`p-2.5 text-left border text-xs transition-all cursor-pointer ${
                      paymentMethod === 'tigopesa'
                        ? 'bg-[#221c10] border-[#c5a059] text-[#e5c378]'
                        : 'bg-[#15151d] border-[#2b2b39] text-[#aaa]'
                    }`}
                  >
                    <p className="font-bold text-white">Tigo Pesa</p>
                    <p className="text-[10px] text-[#999]">{settings.tigoPesaNumber}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-2.5 text-left border text-xs transition-all cursor-pointer ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'bg-[#221c10] border-[#c5a059] text-[#e5c378]'
                        : 'bg-[#15151d] border-[#2b2b39] text-[#aaa]'
                    }`}
                  >
                    <p className="font-bold text-white">Cash on Delivery</p>
                    <p className="text-[10px] text-[#999]">Dodoma CBD / CBE</p>
                  </button>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc8b8] mb-1 font-medium">
                  Maelezo ya Ziada (Special Notes / Gift packaging)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please wrap in gift packaging or call before arrival"
                  className="w-full bg-[#15151e] border border-[#2b2b3a] focus:border-[#c5a059] px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Order Summary Box */}
              <div className="bg-[#14141c] p-4 border border-[#242432] space-y-2 text-xs">
                <div className="flex justify-between text-[#a09a8e]">
                  <span>Vitu ulivyochagua ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-mono text-white">{formatTZS(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#a09a8e]">
                  <span>Gharama ya Usafiri ({deliveryZone})</span>
                  <span className="font-mono text-white">
                    {deliveryFee === 0 ? 'BURE (FREE)' : formatTZS(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#232332]">
                  <span className="font-serif-luxury tracking-wide">JUMLA KUU (TOTAL)</span>
                  <span className="font-mono text-[#e5c378] text-base">{formatTZS(total)}</span>
                </div>
              </div>
            </div>

            {/* Dual Submission Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black font-bold text-xs uppercase tracking-[0.16em] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c5a059]/10"
              >
                {isSubmitting ? (
                  <span>Inatuma oda yako...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Thibitisha Oda Hapa (Complete Website Checkout)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleWhatsAppCheckout}
                className="w-full py-3 px-4 bg-[#14281a] border border-[#235632] text-[#25D366] hover:bg-[#1a3523] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kamilisha Oda WhatsApp kwa Olivia ❤️ ({settings.phoneDisplay})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
