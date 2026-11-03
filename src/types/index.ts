export type ProductCategory = 
  | 'Clothes'
  | 'Shoes'
  | 'Official Wear'
  | 'Rings'
  | 'Chains'
  | 'Perfumes'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // in TZS
  originalPrice?: number; // for sale/discount display
  description: string;
  images: string[];
  sizes: string[];
  colors?: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  badge?: string; // e.g. "Exclusive", "Hot", "Limited"
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus = 'Pending' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
}

export interface Order {
  id: string; // e.g. "HOC-8291"
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryZone: string;
  deliveryFee: number;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: 'mpesa' | 'airtel' | 'tigopesa' | 'cash_on_delivery' | 'whatsapp';
  paymentReference?: string;
  status: OrderStatus;
  checkoutType: 'website' | 'whatsapp';
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactPerson?: string;
  location: string;
  landmark: string;
  city: string;
  whatsappNumber: string; // e.g. "255765892411"
  phoneDisplay: string; // e.g. "+255 765 892 411"
  mpesaTillNumber: string;
  mpesaTillName: string;
  airtelMoneyNumber: string;
  tigoPesaNumber: string;
  deliveryRates: {
    zone: string;
    fee: number;
    description: string;
  }[];
}
