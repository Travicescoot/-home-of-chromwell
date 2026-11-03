import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  ShoppingBag, 
  Settings as SettingsIcon, 
  Phone, 
  CreditCard, 
  Truck, 
  Eye, 
  RefreshCw,
  MessageCircle,
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { Order, OrderStatus, Product, ProductCategory, StoreSettings } from '../types';
import { api, formatTZS } from '../services/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  settings: StoreSettings;
  onProductsUpdated: (products: Product[]) => void;
  onSettingsUpdated: (settings: StoreSettings) => void;
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

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  settings,
  onProductsUpdated,
  onSettingsUpdated,
}) => {
  if (!isOpen) return null;

  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return sessionStorage.getItem('chromwell_admin_token');
  });
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab: 'orders' | 'products' | 'addProduct' | 'settings'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'addProduct' | 'settings'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product Form State (for adding or editing)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Clothes' as ProductCategory,
    price: 45000,
    originalPrice: 0,
    description: '',
    imageUrl: '',
    sizes: 'S, M, L, XL',
    colors: 'Black, Gold',
    stockCount: 10,
    badge: 'New Arrival',
    inStock: true,
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Fetch orders when authenticated
  useEffect(() => {
    if (authToken) {
      loadOrders(authToken);
    }
  }, [authToken]);

  const loadOrders = async (token: string) => {
    setOrdersLoading(true);
    try {
      const data = await api.getOrders(token);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await api.adminLogin(password);
      setAuthToken(res.token);
      sessionStorage.setItem('chromwell_admin_token', res.token);
      loadOrders(res.token);
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    sessionStorage.removeItem('chromwell_admin_token');
    setPassword('');
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!authToken) return;
    try {
      const updated = await api.updateOrderStatus(orderId, status, authToken);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Product Delete
  const handleDeleteProduct = async (productId: string) => {
    if (!authToken) return;
    if (!confirm('Are you sure you want to delete this product from Home of Chromwell?')) return;

    try {
      await api.deleteProduct(productId, authToken);
      const updatedList = products.filter((p) => p.id !== productId);
      onProductsUpdated(updatedList);
    } catch (err: any) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  // Product Toggle Stock
  const handleToggleStock = async (product: Product) => {
    if (!authToken) return;
    try {
      const updated = await api.updateProduct(
        product.id,
        { inStock: !product.inStock },
        authToken
      );
      const updatedList = products.map((p) => (p.id === product.id ? updated : p));
      onProductsUpdated(updatedList);
    } catch (err: any) {
      alert('Failed to update stock: ' + err.message);
    }
  };

  // Start Editing Product
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      description: product.description,
      imageUrl: product.images[0] || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      stockCount: product.stockCount,
      badge: product.badge || '',
      inStock: product.inStock,
    });
    setActiveTab('addProduct');
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setIsSavingProduct(true);
    setProductMessage(null);

    try {
      const parsedSizes = productForm.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedColors = productForm.colors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const productPayload: Partial<Product> = {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || undefined,
        description: productForm.description,
        images: [
          productForm.imageUrl ||
            'https://images.unsplash.com/photo-1548624313-039e22f2541a?auto=format&fit=crop&w=1000&q=80',
        ],
        sizes: parsedSizes.length > 0 ? parsedSizes : ['Standard'],
        colors: parsedColors,
        stockCount: Number(productForm.stockCount) || 10,
        badge: productForm.badge,
        inStock: productForm.inStock,
      };

      if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, productPayload, authToken);
        const updatedList = products.map((p) => (p.id === editingProduct.id ? updated : p));
        onProductsUpdated(updatedList);
        setProductMessage('Product updated successfully!');
      } else {
        const created = await api.createProduct(productPayload, authToken);
        onProductsUpdated([created, ...products]);
        setProductMessage('New product added to Home of Chromwell!');
      }

      // Reset form
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: 'Clothes',
        price: 45000,
        originalPrice: 0,
        description: '',
        imageUrl: '',
        sizes: 'S, M, L, XL',
        colors: 'Black, Gold',
        stockCount: 10,
        badge: 'New Arrival',
        inStock: true,
      });

      setTimeout(() => {
        setActiveTab('products');
        setProductMessage(null);
      }, 1200);
    } catch (err: any) {
      alert('Failed to save product: ' + err.message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Image preset helper
  const handleSelectPresetImage = (url: string) => {
    setProductForm((prev) => ({ ...prev, imageUrl: url }));
  };

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setIsSavingSettings(true);
    setSettingsMessage(null);

    try {
      const updated = await api.updateSettings(settingsForm, authToken);
      onSettingsUpdated(updated);
      setSettingsMessage('Settings saved successfully!');
      setTimeout(() => setSettingsMessage(null), 3000);
    } catch (err: any) {
      alert('Failed to update settings: ' + err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  const totalSalesTZS = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
      <div 
        className="relative w-full max-w-5xl bg-[#0e0e13] border border-[#2c2c3d] text-[#f4eedb] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#14141c] border-b border-[#22222f] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#251e12] border border-[#c5a059] flex items-center justify-center text-[#c5a059]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-white tracking-wide">
                HOME OF CHROMEWELL — Admin Portal
              </h2>
              <p className="text-[11px] text-[#9a9486]">
                Dodoma Flagship Store • CBE College Location Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authToken && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-[#1d1d28] border border-[#333346] hover:bg-red-950/40 hover:border-red-800 text-xs text-[#cfc8b8] hover:text-red-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#888] hover:text-white hover:bg-[#1a1a24] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: LOGIN VIEW */}
        {!authToken ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#1b1710] border border-[#52411e] flex items-center justify-center text-[#c5a059]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Admin Authentication
              </h3>
              <p className="text-xs text-[#9a9486]">
                Protected management system for Home of Chromwell.
              </p>
            </div>

            {loginError && (
              <div className="w-full bg-red-950/60 border border-red-800 text-red-200 text-xs p-3 text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#b8b09f] text-left mb-1">
                  Administrator Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full bg-[#151520] border border-[#2d2d3e] focus:border-[#c5a059] px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="bg-[#14141c] p-2.5 border border-[#262636] text-[11px] text-[#9e9788] text-left">
                Default Access Password: <strong className="text-[#e5c378] font-mono">chromwell2025</strong>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-black font-bold text-xs uppercase tracking-[0.16em] hover:brightness-110 cursor-pointer shadow-lg shadow-[#c5a059]/10"
              >
                {isLoggingIn ? 'Verifying...' : 'Unlock Admin Portal'}
              </button>
            </form>
          </div>
        ) : (
          /* VIEW 2: AUTHENTICATED DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* KPI Stat Ribbons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#0a0a0e] border-b border-[#1d1d28] shrink-0 text-xs">
              <div className="bg-[#14141c] p-3 border border-[#22222e]">
                <p className="text-[#8e887a] text-[10px] uppercase font-semibold">Total Revenue</p>
                <p className="font-mono text-base font-bold text-[#e5c378] mt-0.5">
                  {formatTZS(totalSalesTZS)}
                </p>
              </div>

              <div className="bg-[#14141c] p-3 border border-[#22222e]">
                <p className="text-[#8e887a] text-[10px] uppercase font-semibold">Total Orders</p>
                <p className="font-mono text-base font-bold text-white mt-0.5">
                  {orders.length} Orders
                </p>
              </div>

              <div className="bg-[#14141c] p-3 border border-[#22222e]">
                <p className="text-[#8e887a] text-[10px] uppercase font-semibold">Pending Delivery</p>
                <p className={`font-mono text-base font-bold mt-0.5 ${pendingCount > 0 ? 'text-[#e5a059]' : 'text-[#649e6d]'}`}>
                  {pendingCount} Pending
                </p>
              </div>

              <div className="bg-[#14141c] p-3 border border-[#22222e]">
                <p className="text-[#8e887a] text-[10px] uppercase font-semibold">Live Catalog</p>
                <p className="font-mono text-base font-bold text-white mt-0.5">
                  {products.length} Products
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#20202c] bg-[#111117] shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-[#c5a059] text-[#e5c378] bg-[#1c1a16]'
                    : 'border-transparent text-[#999] hover:text-white'
                }`}
              >
                Orders ({orders.length})
              </button>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab('products');
                }}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-[#c5a059] text-[#e5c378] bg-[#1c1a16]'
                    : 'border-transparent text-[#999] hover:text-white'
                }`}
              >
                Manage Products ({products.length})
              </button>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category: 'Clothes',
                    price: 45000,
                    originalPrice: 0,
                    description: '',
                    imageUrl: '',
                    sizes: 'S, M, L, XL',
                    colors: 'Black, Gold',
                    stockCount: 10,
                    badge: 'New Arrival',
                    inStock: true,
                  });
                  setActiveTab('addProduct');
                }}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'addProduct'
                    ? 'border-[#c5a059] text-[#e5c378] bg-[#1c1a16]'
                    : 'border-transparent text-[#999] hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'border-[#c5a059] text-[#e5c378] bg-[#1c1a16]'
                    : 'border-transparent text-[#999] hover:text-white'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>Store & M-Pesa Settings</span>
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#888]">Filter Status:</span>
                      {['all', 'pending', 'dispatched', 'delivered', 'cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderStatusFilter(st)}
                          className={`px-2.5 py-1 text-xs uppercase cursor-pointer ${
                            orderStatusFilter === st
                              ? 'bg-[#c5a059] text-black font-bold'
                              : 'bg-[#181822] text-[#aaa] hover:text-white border border-[#2b2b3a]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => authToken && loadOrders(authToken)}
                      disabled={ordersLoading}
                      className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh Orders</span>
                    </button>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-xs text-[#888] bg-[#121218] border border-[#22222e]">
                      No orders found in this status.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="bg-[#13131b] border border-[#222230] p-4 sm:p-5 space-y-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1f1f2c] pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-[#e5c378]">
                                  {ord.id}
                                </span>
                                <span className="text-xs font-semibold text-white">
                                  {ord.customerName}
                                </span>
                                <span className="text-[10px] text-[#8e887a] bg-[#1c1c28] px-1.5 py-0.5 border border-[#2a2a3b]">
                                  {ord.checkoutType === 'whatsapp' ? 'WhatsApp Order' : 'Website Order'}
                                </span>
                              </div>
                              <p className="text-xs text-[#a09a8e] mt-0.5">
                                Phone: <a href={`tel:${ord.customerPhone}`} className="text-[#ded8cb] hover:underline">{ord.customerPhone}</a> • 
                                Placed: {new Date(ord.createdAt).toLocaleString()}
                              </p>
                              <p className="text-xs text-[#cfc8b8] mt-1">
                                📍 <strong className="text-white">{ord.deliveryZone}</strong> — {ord.deliveryAddress}
                              </p>
                              {ord.notes && (
                                <p className="text-xs text-[#e5a059] italic mt-0.5">
                                  Note: "{ord.notes}"
                                </p>
                              )}
                            </div>

                            {/* Status and Action dropdown */}
                            <div className="flex flex-col sm:items-end gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#888]">Status:</span>
                                <select
                                  value={ord.status}
                                  onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                                  className={`text-xs px-2.5 py-1 font-bold uppercase cursor-pointer border ${
                                    ord.status === 'Pending'
                                      ? 'bg-amber-950/60 border-amber-600 text-amber-200'
                                      : ord.status === 'Dispatched'
                                      ? 'bg-blue-950/60 border-blue-600 text-blue-200'
                                      : ord.status === 'Delivered'
                                      ? 'bg-green-950/60 border-green-600 text-green-200'
                                      : 'bg-red-950/60 border-red-600 text-red-200'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Dispatched">Dispatched</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>

                              <a
                                href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Habari ${ord.customerName}, this is Home of Chromwell regarding your order ${ord.id}.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-[#122416] border border-[#21472a] text-[#25D366] hover:bg-[#1a3521] text-xs font-semibold flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Chat with Customer</span>
                              </a>
                            </div>
                          </div>

                          {/* Order Items Table */}
                          <div className="space-y-1.5 text-xs">
                            <p className="text-[10px] text-[#8e887a] uppercase font-semibold">Items in order:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-[#181822] p-2 border border-[#262636]">
                                  {it.image && (
                                    <img src={it.image} alt={it.name} className="w-9 h-12 object-cover" />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-white truncate">{it.name}</p>
                                    <p className="text-[11px] text-[#999]">
                                      Qty: <strong className="text-white">{it.quantity}</strong> | Size: {it.selectedSize || 'Std'}
                                    </p>
                                  </div>
                                  <span className="font-mono text-[#e5c378] text-xs">
                                    {formatTZS(it.price * it.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Financials & Payment summary */}
                          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-[#1e1e2b] text-[#999]">
                            <div>
                              Payment: <strong className="text-white uppercase">{ord.paymentMethod}</strong>
                              {ord.paymentReference && <span> (Ref: {ord.paymentReference})</span>}
                            </div>
                            <div className="flex items-center gap-4">
                              <span>Delivery Fee: <strong className="text-white font-mono">{formatTZS(ord.deliveryFee)}</strong></span>
                              <span className="text-sm font-bold text-white font-mono">
                                Total: <span className="text-[#e5c378]">{formatTZS(ord.total)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PRODUCTS LIST */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-[#999]">
                      Total {products.length} products in store catalog.
                    </p>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setActiveTab('addProduct');
                      }}
                      className="px-3.5 py-1.5 bg-[#c5a059] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#13131b] border border-[#222230] p-3 flex gap-3 relative group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-18 h-24 object-cover object-top shrink-0 bg-[#1c1c26]"
                        />

                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                          <div>
                            <span className="text-[10px] text-[#c5a059] uppercase tracking-wider font-semibold">
                              {prod.category}
                            </span>
                            <h4 className="font-serif-luxury text-sm font-semibold text-white truncate">
                              {prod.name}
                            </h4>
                            <p className="text-xs font-mono font-bold text-[#e5c378]">
                              {formatTZS(prod.price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#1d1d28]">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 cursor-pointer ${
                                prod.inStock
                                  ? 'bg-[#18311d] text-[#69d982]'
                                  : 'bg-[#311818] text-[#d96969]'
                              }`}
                            >
                              {prod.inStock ? `In Stock (${prod.stockCount})` : 'Out of Stock'}
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleStartEdit(prod)}
                                className="p-1.5 text-[#aaa] hover:text-white hover:bg-[#20202d]"
                                title="Edit product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 text-[#aaa] hover:text-red-400 hover:bg-[#20202d]"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ADD / EDIT PRODUCT */}
              {activeTab === 'addProduct' && (
                <form onSubmit={handleSaveProduct} className="max-w-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#222230] pb-3">
                    <h3 className="font-serif-luxury text-xl font-bold text-white">
                      {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Fashion Product'}
                    </h3>
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setActiveTab('products');
                        }}
                        className="text-xs text-[#888] hover:text-white"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                  {productMessage && (
                    <div className="p-3 bg-green-950/60 border border-green-800 text-green-200 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{productMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="e.g. Royal Tweed Blazer Suit"
                        className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                        Category *
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                        className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                        Price in TZS *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                        Original / Cross-out Price in TZS (Optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        placeholder="e.g. 60000"
                        className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                        Sizes (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={productForm.sizes}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                        placeholder="e.g. S, M, L, XL or 37, 38, 39 or 7, 8"
                        className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                        Stock Quantity & Badge
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          value={productForm.stockCount}
                          onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                          placeholder="Stock count"
                          className="w-1/2 bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
                        />
                        <input
                          type="text"
                          value={productForm.badge}
                          onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                          placeholder="e.g. Bestseller, New"
                          className="w-1/2 bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Describe the fabric, cut, occasion, and elegance..."
                      className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                    />
                  </div>

                  {/* Image input & upload */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase text-[#b8b09f]">
                      Product Image (URL or Upload from device)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                      />
                      <label className="px-3 py-2 bg-[#21212d] border border-[#333346] text-xs text-[#cfc8b8] hover:text-white cursor-pointer flex items-center gap-1.5">
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Quick luxury image presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#888]">
                      <span>Quick Luxury Presets:</span>
                      <button
                        type="button"
                        onClick={() => handleSelectPresetImage('https://images.unsplash.com/photo-1548624313-039e22f2541a?auto=format&fit=crop&w=1000&q=80')}
                        className="px-2 py-0.5 bg-[#1a1a24] text-[#ccc] hover:text-[#c5a059]"
                      >
                        Blazer Suit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPresetImage('https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80')}
                        className="px-2 py-0.5 bg-[#1a1a24] text-[#ccc] hover:text-[#c5a059]"
                      >
                        Satin Gown
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPresetImage('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80')}
                        className="px-2 py-0.5 bg-[#1a1a24] text-[#ccc] hover:text-[#c5a059]"
                      >
                        Stilettos
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPresetImage('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80')}
                        className="px-2 py-0.5 bg-[#1a1a24] text-[#ccc] hover:text-[#c5a059]"
                      >
                        18K Ring
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPresetImage('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80')}
                        className="px-2 py-0.5 bg-[#1a1a24] text-[#ccc] hover:text-[#c5a059]"
                      >
                        Velvet Oud Perfume
                      </button>
                    </div>

                    {productForm.imageUrl && (
                      <div className="pt-2">
                        <p className="text-[10px] text-[#888] mb-1">Image Preview:</p>
                        <img
                          src={productForm.imageUrl}
                          alt="Preview"
                          className="w-20 h-28 object-cover border border-[#333]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#222230] flex gap-3">
                    <button
                      type="submit"
                      disabled={isSavingProduct}
                      className="px-6 py-3 bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: STORE & PAYMENT SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-4">
                  <div className="border-b border-[#222230] pb-2">
                    <h3 className="font-serif-luxury text-xl font-bold text-white">
                      Dodoma Boutique & Payment Settings
                    </h3>
                    <p className="text-xs text-[#999]">
                      Update WhatsApp line, store location details, and M-Pesa Till number.
                    </p>
                  </div>

                  {settingsMessage && (
                    <div className="p-3 bg-green-950/60 border border-green-800 text-green-200 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{settingsMessage}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                          Contact Person Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.contactPerson || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactPerson: e.target.value })}
                          placeholder="e.g. Olivia ❤️"
                          className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-semibold text-[#f3deb3]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                          WhatsApp Number (Without + or spaces) *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          placeholder="e.g. 255754973156"
                          className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                          Phone Display (Customer Care) *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.phoneDisplay}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phoneDisplay: e.target.value })}
                          placeholder="e.g. +255 754 973 156"
                          className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                          Lipa M-Pesa Till Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.mpesaTillNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, mpesaTillNumber: e.target.value })}
                          placeholder="e.g. 5829104"
                          className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none font-mono font-bold text-[#e5c378]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                          Lipa Till Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.mpesaTillName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, mpesaTillName: e.target.value })}
                          placeholder="e.g. HOME OF CHROMEWELL LTD"
                          className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                          Airtel Money Number
                        </label>
                        <input
                          type="text"
                          value={settingsForm.airtelMoneyNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, airtelMoneyNumber: e.target.value })}
                          placeholder="+255 684..."
                          className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#b8b09f] mb-1">
                        Physical Boutique Location & Landmark *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.landmark}
                        onChange={(e) => setSettingsForm({ ...settingsForm, landmark: e.target.value })}
                        placeholder="Near CBE College (College of Business Education)"
                        className="w-full bg-[#151520] border border-[#2d2d3e] p-2.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#222230]">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="px-6 py-3 bg-[#c5a059] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingSettings ? 'Saving...' : 'Update Store Settings'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
