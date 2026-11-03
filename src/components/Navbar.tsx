import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  ShieldCheck, 
  Compass, 
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { CartItem, ProductCategory, StoreSettings } from '../types';
import { formatTZS } from '../services/api';

interface NavbarProps {
  cart: CartItem[];
  settings: StoreSettings;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Clothes',
  'Shoes',
  'Official Wear',
  'Rings',
  'Chains',
  'Perfumes',
  'Accessories',
];

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  settings,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenAdmin,
  onOpenTracker,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0c]/95 backdrop-blur-md border-b border-[#22222a]">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1c160e] via-[#352712] to-[#1c160e] text-[#f3deb3] border-b border-[#4d3b1b] text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-medium text-[#fcf9f2]">
              Dodoma Flagship: <span className="text-[#d4af37] font-semibold">Near CBE College Gate</span> • Free Campus Pickup
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-xs text-[#ded5c0]">
            <a 
              href={`https://wa.me/${settings.whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#e5c378] hover:text-white transition-colors font-medium bg-[#2a1e0c] px-2.5 py-0.5 border border-[#5a431c]"
            >
              <span>Contact: <strong className="text-white">Olivia ❤️</strong></span>
              <span className="text-[#d4af37] font-mono">{settings.phoneDisplay}</span>
            </a>
            <span className="text-[#554b38]">|</span>
            <span className="font-mono text-[#e5c378]">Lipa M-Pesa: {settings.mpesaTillNumber}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <button
              onClick={onOpenTracker}
              className="text-xs text-[#e5c378] hover:text-white underline underline-offset-4 decoration-[#c5a059]/40 hover:decoration-[#c5a059] transition-all cursor-pointer"
            >
              Track Order
            </button>
            <span className="text-[#554b38]">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-xs text-[#a09886] hover:text-[#e5c378] transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#dcd7cb] hover:text-[#c5a059] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#dcd7cb] hover:text-[#c5a059] ml-1"
              aria-label="Toggle search bar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex flex-col items-center lg:items-start cursor-pointer select-none" onClick={() => onSelectCategory('all')}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.16em] font-bold text-white uppercase">
                CHROMEWELL
              </span>
            </div>
            <div className="flex items-center gap-1.5 -mt-1">
              <span className="text-[9px] tracking-[0.32em] text-[#d4af37] uppercase font-semibold">
                HOME OF CHROMEWELL • DODOMA
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a867b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search dresses, perfumes, gold chains, official wear..."
                className="w-full bg-[#131318]/90 text-[#f4eedb] text-sm pl-10 pr-4 py-2.5 border border-[#2a2a38] focus:border-[#d4af37] focus:outline-none transition-colors placeholder:text-[#6a665d]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9a9486] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Habari Olivia ❤️, I am inquiring from HOME OF CHROMEWELL Dodoma website.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 border border-[#3d321d] bg-[#1a1710] text-[#f3deb3] hover:bg-[#282114] hover:border-[#d4af37] transition-all text-xs font-medium cursor-pointer shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Olivia ❤️</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2.5 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:brightness-110 active:scale-95 shadow-md shadow-[#c5a059]/10 cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartCount > 0 && (
                <span className="bg-black text-[#e5c378] px-1.5 py-0.5 text-[10px] font-bold">
                  {totalCartCount}
                </span>
              )}
              {totalCartCount > 0 && (
                <span className="hidden md:inline text-[11px] font-mono border-l border-black/30 pl-2">
                  {formatTZS(totalCartPrice)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        {searchOpen && (
          <div className="lg:hidden pb-3 pt-1 border-t border-[#22222a]">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a867b]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products in Dodoma..."
                className="w-full bg-[#131318] text-[#f4eedb] text-sm pl-10 pr-4 py-2 border border-[#272733] focus:border-[#c5a059] focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center justify-between py-3 border-t border-[#1d1d24] text-xs font-medium uppercase tracking-[0.14em]">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => onSelectCategory('all')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                selectedCategory === 'all'
                  ? 'text-[#e5c378] border-b-2 border-[#c5a059] font-semibold'
                  : 'text-[#a9a498] hover:text-[#f4eedb]'
              }`}
            >
              All Collections
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                  selectedCategory === cat
                    ? 'text-[#e5c378] border-b-2 border-[#c5a059] font-semibold'
                    : 'text-[#a9a498] hover:text-[#f4eedb]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-[#8e8779] normal-case tracking-normal flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Delivery within 2 hrs in Dodoma</span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d12] border-b border-[#262633] px-4 py-4 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-[#8a8374] font-semibold">
            Boutique Categories
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 text-xs uppercase tracking-wider ${
                selectedCategory === 'all'
                  ? 'bg-[#221c10] text-[#e5c378] border border-[#c5a059]'
                  : 'bg-[#15151c] text-[#cfc9bc]'
              }`}
            >
              All Items
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs uppercase tracking-wider ${
                  selectedCategory === cat
                    ? 'bg-[#221c10] text-[#e5c378] border border-[#c5a059]'
                    : 'bg-[#15151c] text-[#cfc9bc]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1d1d26] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 bg-[#15151d] text-xs text-[#e5c378] flex items-center justify-between"
            >
              <span>Track Your Existing Order</span>
              <span className="text-[10px] text-[#a19987]">Enter ID / Phone →</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 bg-[#15151d] text-xs text-[#a19987] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
