import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Sparkles 
} from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { formatTZS } from '../services/api';

interface ProductModalProps {
  product: Product | null;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  settings,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSize, selectedColor);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 1200);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Habari Olivia ❤️ (HOME OF CHROMEWELL Dodoma)! 👑\nI want to order:\n*Product:* ${product.name}\n*Category:* ${product.category}\n*Quantity:* ${quantity}\n*Size:* ${selectedSize || 'Standard'}${selectedColor ? `\n*Color:* ${selectedColor}` : ''}\n*Price:* ${formatTZS(product.price * quantity)}\n\nPlease let me know if I can pick this up near CBE College or have it delivered in Dodoma.`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-4xl bg-[#0f0f14] border border-[#272733] shadow-2xl text-[#f4eedb] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#1b1b24] text-[#cfc8b8] hover:text-white hover:bg-[#282836] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col bg-[#14141b] p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#22222d]">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a24] mb-3">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-[#c5a059] text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#c5a059]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="flex flex-col justify-between p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#a09a8d] uppercase tracking-wider">
                <span className="text-[#c5a059] font-semibold">{product.category}</span>
                <span className="font-mono">ID: {product.id}</span>
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white leading-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold font-mono text-[#e5c378]">
                  {formatTZS(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-mono text-[#736e63] line-through">
                    {formatTZS(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs text-[#25D366] font-semibold">
                    Save {formatTZS(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#b8b2a5] leading-relaxed">
                {product.description}
              </p>

              {/* Sizes Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#1e1e28]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#ded8cb] uppercase tracking-wider">Select Size:</span>
                    <span className="text-[#c5a059] font-mono">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#c5a059] text-black font-bold border border-[#c5a059]'
                            : 'bg-[#171720] text-[#cfc8b8] border border-[#2d2d3c] hover:border-[#c5a059]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#ded8cb] uppercase tracking-wider">Select Shade / Color:</span>
                    <span className="text-[#c5a059]">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1 text-xs transition-all cursor-pointer ${
                          selectedColor === c
                            ? 'bg-[#2a2213] text-[#e5c378] border border-[#c5a059]'
                            : 'bg-[#171720] text-[#9f988b] border border-[#2d2d3c]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Counter */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-[#ded8cb]">Quantity:</span>
                <div className="flex items-center border border-[#2d2d3c] bg-[#171720]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm text-[#ded8cb] hover:text-[#c5a059] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono text-[#f4eedb] min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm text-[#ded8cb] hover:text-[#c5a059] transition-colors"
                  >
                    +
                  </button>
                </div>
                {product.inStock ? (
                  <span className="text-xs text-[#52ab65] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stockCount} items)
                  </span>
                ) : (
                  <span className="text-xs text-red-400">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#1e1e28]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={handleAdd}
                  className={`py-3.5 px-4 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !product.inStock
                      ? 'bg-[#222] text-[#666] cursor-not-allowed'
                      : justAdded
                      ? 'bg-[#1f4228] text-[#80eb9a]'
                      : 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black hover:brightness-110'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatTZS(product.price * quantity)}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="py-3.5 px-4 bg-[#14281a] border border-[#225030] text-[#25D366] hover:bg-[#1a3523] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </button>
              </div>

              {/* Dodoma Pickup Reassurance */}
              <div className="bg-[#14141c] p-3 text-xs text-[#ded5c0] flex items-center gap-2.5 border border-[#2b2b3a]">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>
                  Pickup Available at <strong className="text-white">HOME OF CHROMEWELL Dodoma</strong> near CBE College gate, or contact <strong className="text-[#f3deb3]">Olivia ❤️</strong> ({settings.phoneDisplay}) for instant doorstep delivery.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
