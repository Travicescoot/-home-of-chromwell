import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onSelectCategory,
  onOpenAdmin,
  onOpenTracker,
}) => {
  return (
    <footer className="w-full bg-[#08080a] text-[#b3ada1] border-t border-[#1e1e28] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="font-serif-luxury text-2xl font-bold tracking-[0.16em] text-white uppercase">
                CHROMEWELL
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#b3ad9f]">
              <strong className="text-white">HOME OF CHROMEWELL</strong> is Dodoma’s premier luxury boutique for discerning women. 
              Specializing in high-end official corporate suits, dresses, 
              designer footwear, 18K gold tarnish-free jewelry, and signature Arabian & French perfumes.
            </p>
            <div className="pt-2 text-xs text-[#ded8cb] space-y-1.5">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Dodoma, Tanzania — Near CBE College Gate</span>
              </p>
              <p className="flex items-center gap-1.5 text-[#f3deb3]">
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Contact: <strong className="text-white">Olivia ❤️</strong> ({settings.phoneDisplay})</span>
              </p>
            </div>
          </div>

          {/* Column 2: Fashion Collections */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Official Wear',
                'Clothes',
                'Shoes',
                'Rings',
                'Chains',
                'Perfumes',
                'Accessories',
              ].map((category) => (
                <li key={category}>
                  <button
                    onClick={() => {
                      onSelectCategory(category);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-[#c5a059] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronRight className="w-3 h-3 text-[#555]" />
                    <span>{category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care & Tracking */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white uppercase tracking-wider">
              Boutique Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-[#c5a059] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-[#555]" />
                  <span>Track Your Order Status</span>
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Habari Home of Chromwell, I have an inquiry about size fitting and pickup near CBE College.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3 text-[#555]" />
                  <span>Size & Fitting Advice (WhatsApp)</span>
                </a>
              </li>
              <li>
                <span className="text-[#888] flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#555]" />
                  <span>Same-Day Dodoma CBD Delivery</span>
                </span>
              </li>
              <li>
                <span className="text-[#888] flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#555]" />
                  <span>Free CBE College Gate Pickup</span>
                </span>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#c5a059] transition-colors flex items-center gap-1 text-[#888] cursor-pointer pt-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Admin Store Management</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods & WhatsApp Direct */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white uppercase tracking-wider">
              Payments & Orders
            </h4>
            <p className="text-xs text-[#9a9486]">
              We accept official Tanzania mobile money payments & cash on delivery in Dodoma.
            </p>

            <div className="bg-[#121218] p-3 border border-[#22222e] space-y-1.5 text-xs">
              <p className="text-white font-semibold">Lipa Kwa M-Pesa</p>
              <p className="text-[11px] text-[#9a9486]">
                Till No: <span className="font-mono text-[#e5c378] font-bold">{settings.mpesaTillNumber}</span>
              </p>
              <p className="text-[10px] text-[#736e63]">Name: {settings.mpesaTillName}</p>
            </div>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Habari Olivia ❤️, I am reaching out to HOME OF CHROMEWELL Dodoma.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#142e1b] border border-[#255f34] text-[#25D366] text-xs font-bold uppercase tracking-wider hover:bg-[#1b3d23] transition-colors w-full justify-center shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Olivia ❤️: {settings.phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-[#1a1a24] flex flex-col sm:flex-row items-center justify-between text-xs text-[#736e63] gap-4">
          <p>
            © {new Date().getFullYear()} HOME OF CHROMEWELL. Dodoma, Tanzania. All Rights Reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Dodoma flagship near CBE College • Contact: Olivia ❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
