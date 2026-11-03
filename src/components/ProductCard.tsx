import React, { useState } from 'react';
import { Eye, ShoppingBag, MessageCircle, Check } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { formatTZS } from '../services/api';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  onAddToCart: (product: Product, size?: string) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  onAddToCart,
  onOpenDetails,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleWhatsAppQuickInquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Habari Olivia ❤️ (HOME OF CHROMEWELL Dodoma)! I am interested in purchasing:\n*${product.name}*\nCategory: ${product.category}\nPrice: ${formatTZS(product.price)}${selectedSize ? `\nSize: ${selectedSize}` : ''}\nIs it available at your boutique near CBE College?`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col bg-[#111116] border border-[#21212c] hover:border-[#c5a059]/60 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181820]">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges / Status */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black text-[10px] font-bold tracking-widest uppercase px-2 py-1 shadow-sm">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-red-950 text-red-200 border border-red-800 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="px-3.5 py-2 bg-[#0d0d12]/90 text-[#f4eedb] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-[#3d3d4e] hover:border-[#c5a059] hover:text-[#e5c378] transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 justify-between space-y-3">
        <div>
          {/* Category & Stock text */}
          <div className="flex items-center justify-between text-[11px] text-[#8e887b] uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            {product.inStock && product.stockCount <= 5 ? (
              <span className="text-[#e5a059] font-medium lowercase">Only {product.stockCount} left</span>
            ) : (
              <span className="text-[#649e6d]">In Dodoma Store</span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-serif-luxury text-base font-semibold text-[#f5f3ee] group-hover:text-[#e5c378] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Pricing in TZS */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm font-bold font-mono text-[#e5c378]">
              {formatTZS(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#736e63] font-mono line-through">
                {formatTZS(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Sizes Quick Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[10px] text-[#8a8476] mb-1">
              <span>Sizes:</span>
              <span className="text-[#ded8cb]">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2 py-0.5 text-[10px] uppercase font-mono transition-all ${
                    selectedSize === sz
                      ? 'bg-[#c5a059] text-black font-bold'
                      : 'bg-[#181822] text-[#b0aaa0] hover:text-white border border-[#2b2b3a]'
                  }`}
                >
                  {sz.length > 10 ? sz.substring(0, 8) + '..' : sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e1e28]">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleQuickAdd}
            className={`py-2 px-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              !product.inStock
                ? 'bg-[#181820] text-[#555] cursor-not-allowed'
                : isAddedRecently
                ? 'bg-[#1e3a24] text-[#7ce495] border border-[#2e5a38]'
                : 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black hover:brightness-110'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Bag</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsAppQuickInquiry}
            className="py-2 px-2 bg-[#122216] border border-[#1f4228] text-[#25D366] hover:bg-[#1a3321] text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
            title="Inquire via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
