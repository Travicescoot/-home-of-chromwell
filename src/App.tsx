/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  MessageCircle, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  ChevronUp, 
  PhoneCall,
  CheckCircle,
  Truck
} from 'lucide-react';
import { CartItem, Order, Product, StoreSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './data/initialData';
import { api, formatTZS } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  // Store Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hoc_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Modals & Drawers
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Delivery Choice
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState<string>(
    INITIAL_SETTINGS.deliveryRates[0].zone
  );

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('hoc_cart_v2', JSON.stringify(cart));
  }, [cart]);

  // Initial Fetch from API
  useEffect(() => {
    async function init() {
      try {
        const [fetchedProducts, fetchedSettings] = await Promise.all([
          api.getProducts(),
          api.getSettings(),
        ]);
        if (fetchedProducts && fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
        if (fetchedSettings) {
          setSettings(fetchedSettings);
          if (fetchedSettings.deliveryRates?.[0]) {
            setSelectedDeliveryZone(fetchedSettings.deliveryRates[0].zone);
          }
        }
      } catch (err) {
        console.warn('Using initial seed data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const finalSize = size || product.sizes?.[0] || 'Standard';
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === finalSize
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedSize: finalSize,
            selectedColor: color || product.colors?.[0],
          },
        ];
      }
    });

    showToast(`Added ${product.name} (${finalSize}) to your bag`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!size || item.selectedSize === size)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && (!size || item.selectedSize === size))
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOpenProductDetails = (product: Product) => {
    setActiveProduct(product);
    setIsProductModalOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else {
      // 'featured'
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f4eedb] flex flex-col selection:bg-[#c5a059] selection:text-black">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#14141c] text-[#f4eedb] border border-[#c5a059] px-4 py-2.5 text-xs font-medium shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#c5a059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        cart={cart}
        settings={settings}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Hero Banner (visible on 'all' or default view) */}
      {selectedCategory === 'all' && !searchQuery && (
        <HeroBanner
          settings={settings}
          onExploreCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Category Navigation & Filter Sub-Bar */}
      <div id="catalog-section">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          inStockOnly={inStockOnly}
          onToggleInStock={setInStockOnly}
          totalProductsCount={filteredProducts.length}
        />
      </div>

      {/* Main Product Catalog Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#0f0f14] border border-[#20202c] p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#c5a059] mx-auto opacity-60" />
            <h3 className="font-serif-luxury text-2xl font-bold text-white">
              No Pieces Found
            </h3>
            <p className="text-xs text-[#9a9486] max-w-sm mx-auto">
              We couldn't find any items matching your selected criteria. Try resetting filters or exploring other categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="px-5 py-2.5 bg-[#c5a059] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                settings={settings}
                onAddToCart={(prod, size) => handleAddToCart(prod, 1, size)}
                onOpenDetails={handleOpenProductDetails}
              />
            ))}
          </div>
        )}

        {/* Dodoma CBE Boutique Notice & Location Callout */}
        <section className="mt-16 relative overflow-hidden bg-gradient-to-r from-[#17140f]/95 via-[#251d11]/95 to-[#17140f]/95 border border-[#52411e] p-6 sm:p-10 shadow-2xl">
          {/* Visual ambient aura */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#91233c]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs text-[#d4af37] font-bold uppercase tracking-wider bg-[#2a1e0c] px-3 py-1 border border-[#5d471e]">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Visit HOME OF CHROMEWELL • Dodoma Flagship</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                Near CBE College Gate, Dodoma
              </h3>
              <p className="text-xs text-[#ded5c0] max-w-xl leading-relaxed">
                Want to try on our tailored power suits, official dresses, heels or smell our bespoke oud and French perfumes in person? Walk in freely at our boutique near College of Business Education (CBE) in Dodoma! Free pick-up for all students and lecturers.
              </p>
              <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-[#f3deb3]">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <span>Contact Person:</span>
                  <span className="text-[#d4af37] text-sm">Olivia ❤️</span>
                </span>
                <span className="text-[#554b38]">|</span>
                <a
                  href={`tel:${settings.phoneDisplay}`}
                  className="flex items-center gap-1 hover:text-white transition-colors font-mono"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{settings.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Habari Olivia ❤️, I would like directions to HOME OF CHROMEWELL boutique near CBE College Dodoma.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#142e1b] border border-[#255f34] text-[#25D366] hover:bg-[#1b3e24] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/10"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Olivia ❤️ ({settings.phoneDisplay})</span>
              </a>

              <button
                onClick={() => setIsTrackerOpen(true)}
                className="px-5 py-3.5 bg-[#171720] border border-[#37374b] text-white hover:border-[#d4af37] text-xs font-medium uppercase tracking-wider cursor-pointer shadow-md"
              >
                Track My Order
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Modals and Drawers */}
      <ProductModal
        product={activeProduct}
        settings={settings}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        selectedDeliveryZone={selectedDeliveryZone}
        onSelectDeliveryZone={setSelectedDeliveryZone}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        settings={settings}
        selectedDeliveryZone={selectedDeliveryZone}
        onOrderSuccess={(order) => {
          showToast(`Order ${order.id} placed successfully!`);
        }}
        onClearCart={handleClearCart}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        settings={settings}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        settings={settings}
        onProductsUpdated={(newProducts) => setProducts(newProducts)}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />

      {/* Floating Concierge Action Buttons with Visual Pulse */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Habari Olivia ❤️, I have an inquiry about HOME OF CHROMEWELL products.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1e3a24] border border-[#2d6e40] text-[#25D366] shadow-2xl hover:bg-[#254d2f] transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Chat with Olivia on WhatsApp"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
          </span>
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[11px] font-bold text-white tracking-wide">
              Chat with Olivia ❤️
            </span>
            <span className="text-[10px] text-[#25D366] font-mono">
              {settings.phoneDisplay}
            </span>
          </div>
        </a>

        {cart.length > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-13 h-13 rounded-full bg-[#c5a059] text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform relative cursor-pointer"
            aria-label="Open Shopping Bag"
            title="Open Shopping Bag"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-black text-[#e5c378] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#c5a059]">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </button>
        )}
      </div>

      {/* Boutique Footer */}
      <Footer
        settings={settings}
        onSelectCategory={setSelectedCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />
    </div>
  );
}
