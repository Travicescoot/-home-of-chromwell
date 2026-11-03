import React from 'react';
import { 
  Shirt, 
  Sparkles, 
  Briefcase, 
  Disc, 
  Link, 
  Droplets, 
  ShoppingBag,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  totalProductsCount: number;
}

interface CategoryMeta {
  key: ProductCategory;
  label: string;
  icon: React.ReactNode;
}

const CATEGORY_ITEMS: CategoryMeta[] = [
  { key: 'Clothes', label: 'Clothes & Dresses', icon: <Shirt className="w-4 h-4" /> },
  { key: 'Official Wear', label: 'Official Wear', icon: <Briefcase className="w-4 h-4" /> },
  { key: 'Shoes', label: 'Luxury Shoes', icon: <Sparkles className="w-4 h-4" /> },
  { key: 'Rings', label: 'Rings (18K Plated)', icon: <Disc className="w-4 h-4" /> },
  { key: 'Chains', label: 'Gold Chains', icon: <Link className="w-4 h-4" /> },
  { key: 'Perfumes', label: 'Perfumes & Oud', icon: <Droplets className="w-4 h-4" /> },
  { key: 'Accessories', label: 'Accessories', icon: <ShoppingBag className="w-4 h-4" /> },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  inStockOnly,
  onToggleInStock,
  totalProductsCount,
}) => {
  return (
    <div className="w-full bg-[#0d0d12] border-b border-[#22222c] py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Horizontal Category Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#c5a059] text-black font-bold shadow-md shadow-[#c5a059]/10'
                : 'bg-[#15151c] text-[#b6b0a2] hover:bg-[#1d1d26] hover:text-white border border-[#262633]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Products</span>
          </button>

          {CATEGORY_ITEMS.map((item) => {
            const isActive = selectedCategory === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectCategory(item.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#c5a059] text-black font-bold shadow-md shadow-[#c5a059]/10'
                    : 'bg-[#15151c] text-[#b6b0a2] hover:bg-[#1d1d26] hover:text-white border border-[#262633]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-bar: Active Count, Filters & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#9d9789]">
          <div className="flex items-center gap-4">
            <span className="font-medium text-[#ded8cb]">
              Showing <span className="text-[#c5a059] font-mono font-bold">{totalProductsCount}</span> curated pieces
            </span>

            <label className="flex items-center gap-2 cursor-pointer select-none text-[#cfc8b8] hover:text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onToggleInStock(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#c5a059] rounded-none cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="text-[11px] uppercase tracking-wider">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-[#15151e] text-[#f4eedb] border border-[#2e2e3b] text-xs px-3 py-1.5 focus:border-[#c5a059] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
