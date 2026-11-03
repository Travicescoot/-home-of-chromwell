import React from 'react';
import { Sparkles, ArrowRight, Shield, Truck, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroBannerProps {
  settings: StoreSettings;
  onExploreCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ settings, onExploreCategory }) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0c] border-b border-[#22222a]">
      {/* Background Graphic elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
          alt="Home of Chromwell High Fashion Collection"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl space-y-6">
          {/* Dodoma CBE Boutique Badge & Contact Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#251b0f]/90 border border-[#5d471e] text-xs text-[#f3deb3] shadow-md">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Dodoma Flagship • Near CBE College Gate
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#172b1d] border border-[#265e38] text-xs text-[#25D366] font-semibold shadow-md">
              <span>Contact: Olivia ❤️</span>
              <span className="font-mono text-white text-[11px]">{settings.phoneDisplay}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-white tracking-tight leading-[1.1]">
              Luxury Women’s Fashion <br />
              <span className="bg-gradient-to-r from-[#d4af37] via-[#fff1d0] to-[#c5a059] bg-clip-text text-transparent italic">
                Crafted for Distinction
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#cfc8b8] leading-relaxed max-w-xl">
              Welcome to <span className="text-[#f3deb3] font-bold tracking-wide">HOME OF CHROMEWELL</span>. 
              Dodoma’s elite boutique for tailored official suits, glamorous evening gowns, 
              designer footwear, 18K gold tarnish-free jewelry, and signature fragrances.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onExploreCategory('Official Wear')}
              className="px-6 py-3.5 bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#e5c378] text-black font-bold text-xs tracking-[0.16em] uppercase hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#c5a059]/25 cursor-pointer"
            >
              <span>Explore Official Wear</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onExploreCategory('Clothes')}
              className="px-6 py-3.5 bg-[#14141d]/90 text-[#f4eedb] border border-[#3b3b4f] hover:border-[#d4af37] hover:text-[#f3deb3] font-medium text-xs tracking-[0.16em] uppercase transition-all cursor-pointer shadow-md"
            >
              Shop Dresses & Gowns
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Habari Olivia ❤️, nimefika kwenye website ya HOME OF CHROMEWELL karibu na CBE College Dodoma.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[#132c1b] text-[#25D366] border border-[#235833] hover:bg-[#1a3d24] text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#25D366]/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Olivia ❤️ ({settings.phoneDisplay})</span>
            </a>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#262633]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Free CBE Pickup</p>
                <p className="text-[10px] text-[#9a9484]">Collect at boutique gate</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Dodoma 2-Hr Delivery</p>
                <p className="text-[10px] text-[#9a9484]">Fast dispatch to doorstep</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">M-Pesa Verified</p>
                <p className="text-[10px] text-[#9a9484]">Till No. {settings.mpesaTillNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">100% Quality Guaranteed</p>
                <p className="text-[10px] text-[#9a9484]">Premium fabrics & tarnish-free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
