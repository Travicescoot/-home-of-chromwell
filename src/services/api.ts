import { CartItem, Order, OrderStatus, Product, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialData';

export function formatTZS(amount: number): string {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    maximumFractionDigits: 0,
  }).format(amount).replace('TZS', 'TZS ');
}

export function generateWhatsAppMessage(
  order: Partial<Order>,
  settings: StoreSettings
): string {
  const itemsText = (order.items || [])
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*\n   Qty: ${item.quantity} | Size: ${item.selectedSize || 'Standard'}${item.selectedColor ? ` | Color: ${item.selectedColor}` : ''}\n   Price: ${formatTZS(item.price * item.quantity)}`
    )
    .join('\n\n');

  const contactName = settings.contactPerson || 'Olivia ❤️';
  const text = `*NEW ORDER - HOME OF CHROMEWELL* 👑
_Attention: ${contactName} | ${settings.phoneDisplay}_
_Boutique Location: Dodoma near CBE College_

*Order Ref:* ${order.id || 'NEW'}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Delivery Zone:* ${order.deliveryZone}
*Address:* ${order.deliveryAddress}
${order.notes ? `*Notes:* ${order.notes}\n` : ''}
*Ordered Items:*
${itemsText}

----------------------------
*Subtotal:* ${formatTZS(order.subtotal || 0)}
*Delivery Fee:* ${formatTZS(order.deliveryFee || 0)}
*TOTAL AMOUNT:* ${formatTZS(order.total || 0)}
*Payment Method:* ${order.paymentMethod?.toUpperCase()}

Habari ${contactName}, nimeagiza bidhaa hizi kutoka HOME OF CHROMEWELL. Tafadhali thibitisha upatikanaji na maelekezo ya malipo/usafirishaji. Asante!`;

  return encodeURIComponent(text);
}

// API functions
const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching products, using initial fallback', err);
      const cached = localStorage.getItem('hoc_products_cache');
      return cached ? JSON.parse(cached) : INITIAL_PRODUCTS;
    }
  },

  async createProduct(product: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create product');
    }
    return await res.json();
  },

  async updateProduct(id: string, product: Partial<Product>, token: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update product');
    }
    return await res.json();
  },

  async deleteProduct(id: string, token: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product');
    }
    return true;
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      return await res.json();
    } catch (err) {
      console.warn('API error fetching settings, using initial fallback', err);
      return INITIAL_SETTINGS;
    }
  },

  async updateSettings(settings: Partial<StoreSettings>, token: string): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update settings');
    }
    return await res.json();
  },

  // Orders
  async getOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch orders');
    }
    return await res.json();
  },

  async trackOrder(query: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders/track?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error('Failed to search order');
    }
    return await res.json();
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    }
    return await res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus, token: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }
    return await res.json();
  },

  // Admin Auth
  async adminLogin(password: string, username = 'admin'): Promise<{ token: string; admin: any }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid credentials');
    }
    return data;
  },
};
