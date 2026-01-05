
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, Branch, Prize, Banner, Coupon, AppSettings, Addon, Reel } from '../types';
import { INITIAL_MENU, BRANCHES, BANNERS, ACTIVE_COUPONS } from '../constants';

const DEFAULT_CATEGORIES = ['سادة', 'محشي لحوم', 'محشي جبن', 'حلو', 'مشروبات', 'إضافات'];

const INITIAL_WHEEL_PRIZES: Prize[] = [
  { id: '1', text: "خصم 10%", type: 'discount_percent', value: 10 },
  { id: '2', text: "إضافة مجانية", type: 'free_addon', value: 0 },
  { id: '3', text: "فطيرة هدية", type: 'free_item', value: 0 },
  { id: '4', text: "توصيل مجاني", type: 'free_delivery', value: 20 },
  { id: '5', text: "خصم 20 ج.م", type: 'discount_fixed', value: 20 },
  { id: '6', text: "أوڤر خاص!", type: 'discount_percent', value: 5 }
];

const INITIAL_ADDONS: Addon[] = [
  { id: 'a1', name: 'قشطة بلدي', price: 30, image: 'https://images.unsplash.com/photo-1589113852021-147293ef65a3?auto=format&fit=crop&q=80&w=200' },
  { id: 'a2', name: 'عسل نحل', price: 20, image: 'https://images.unsplash.com/photo-1585250481023-5e7415175210?auto=format&fit=crop&q=80&w=200' },
  { id: 'a3', name: 'موتزاريلا زيادة', price: 35, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&q=80&w=200' },
  { id: 'a4', name: 'مخلل مشكل', price: 10, image: 'https://images.unsplash.com/photo-1589135326943-39870845348f?auto=format&fit=crop&q=80&w=200' }
];

const INITIAL_REELS: Reel[] = [
  { id: 'r1', title: 'فطير المعلم السخن', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-pizza-dough-4471-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&q=80&w=400' },
  { id: 'r2', title: 'سر الصنعة', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-taking-a-pizza-out-of-the-oven-15244-large.mp4', thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' }
];

interface AppContextType {
  menu: Product[];
  branches: Branch[];
  banners: Banner[];
  reels: Reel[];
  coupons: Coupon[];
  categories: string[];
  wheelPrizes: Prize[];
  globalAddons: Addon[];
  settings: AppSettings;
  cart: CartItem[];
  orders: Order[];
  user: User | null;
  selectedBranch: Branch;
  // Actions
  addToCart: (product: Product, quantity: number, addons: { name: string; price: number; image?: string }[], note?: string) => void;
  addStandaloneAddon: (addon: Addon) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  login: (name: string, phone: string, asAdmin?: boolean) => void;
  logout: () => void;
  createOrder: (orderData: Partial<Order>) => Order;
  setSelectedBranch: (branch: Branch) => void;
  // Admin Actions
  updateMenu: (newMenu: Product[]) => void;
  updateBranches: (newBranches: Branch[]) => void;
  updateBanners: (newBanners: Banner[]) => void;
  updateReels: (newReels: Reel[]) => void;
  updateCoupons: (newCoupons: Coupon[]) => void;
  updateCategories: (newCategories: string[]) => void;
  updateWheelPrizes: (newPrizes: Prize[]) => void;
  updateGlobalAddons: (newAddons: Addon[]) => void;
  updateSettings: (newSettings: AppSettings) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  recordSpin: () => boolean;
  recordWin: (prize: Prize) => void;
  clearActivePrize: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<Product[]>(() => {
    const saved = localStorage.getItem('app_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('app_branches');
    return saved ? JSON.parse(saved) : BRANCHES;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('app_banners');
    return saved ? JSON.parse(saved) : BANNERS;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('app_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('app_coupons');
    return saved ? JSON.parse(saved) : ACTIVE_COUPONS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [wheelPrizes, setWheelPrizes] = useState<Prize[]>(() => {
    const saved = localStorage.getItem('app_wheel_prizes');
    return saved ? JSON.parse(saved) : INITIAL_WHEEL_PRIZES;
  });

  const [globalAddons, setGlobalAddons] = useState<Addon[]>(() => {
    const saved = localStorage.getItem('app_global_addons');
    return saved ? JSON.parse(saved) : INITIAL_ADDONS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : {
      appName: 'المعلم X',
      logoText: 'X',
      primaryColor: '#f97316',
      contactNumber: '01099887766',
      welcomeMessage: 'أهلاً بك في عالم المعلم'
    };
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedBranch, setSelectedBranchState] = useState<Branch>(branches[0] || BRANCHES[0]);

  useEffect(() => {
    localStorage.setItem('app_menu', JSON.stringify(menu));
    localStorage.setItem('app_branches', JSON.stringify(branches));
    localStorage.setItem('app_banners', JSON.stringify(banners));
    localStorage.setItem('app_reels', JSON.stringify(reels));
    localStorage.setItem('app_coupons', JSON.stringify(coupons));
    localStorage.setItem('app_categories', JSON.stringify(categories));
    localStorage.setItem('app_wheel_prizes', JSON.stringify(wheelPrizes));
    localStorage.setItem('app_global_addons', JSON.stringify(globalAddons));
    localStorage.setItem('app_settings', JSON.stringify(settings));
    localStorage.setItem('orders', JSON.stringify(orders));
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [menu, branches, banners, reels, coupons, categories, wheelPrizes, globalAddons, settings, orders, user]);

  const updateMenu = (newMenu: Product[]) => setMenu(newMenu);
  const updateBranches = (newBranches: Branch[]) => {
    setBranches(newBranches);
    if (newBranches.length > 0) setSelectedBranchState(newBranches[0]);
  };
  const updateBanners = (newBanners: Banner[]) => setBanners(newBanners);
  const updateReels = (newReels: Reel[]) => setReels(newReels);
  const updateCoupons = (newCoupons: Coupon[]) => setCoupons(newCoupons);
  const updateCategories = (newCategories: string[]) => setCategories(newCategories);
  const updateWheelPrizes = (newPrizes: Prize[]) => setWheelPrizes(newPrizes);
  const updateGlobalAddons = (newAddons: Addon[]) => setGlobalAddons(newAddons);
  const updateSettings = (newSettings: AppSettings) => setSettings(newSettings);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const addToCart = (product: Product, quantity: number, addons: { name: string; price: number; image?: string }[], note?: string) => {
    setCart(prev => {
      const addonKey = addons.map(a => a.name).sort().join('|');
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedAddons.map(a => a.name).sort().join('|') === addonKey
      );
      
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      
      const newCartItem: CartItem = { 
        ...product, 
        cartItemId: Math.random().toString(36).substr(2, 9),
        quantity, 
        selectedAddons: addons, 
        note 
      };
      return [...prev, newCartItem];
    });
  };

  const addStandaloneAddon = (addon: Addon) => {
    const addonAsProduct: Product = {
      id: `addon-${addon.id}`,
      name: addon.name,
      description: 'إضافة منفصلة مميزة',
      price: addon.price,
      image: addon.image || 'https://images.unsplash.com/photo-1589113852021-147293ef65a3?auto=format&fit=crop&q=80&w=200',
      category: 'إضافات',
      addons: []
    };
    addToCart(addonAsProduct, 1, []);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const login = (name: string, phone: string, asAdmin: boolean = false) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      role: asAdmin ? 'admin' : 'customer',
      coupons: [],
      ordersCount: 0,
      dailySpinsCount: 0,
      dailyPrizesCount: 0,
      lastActivityDate: new Date().toISOString().split('T')[0]
    };
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerName: orderData.customerName || user?.name || '',
      phone: orderData.phone || user?.phone || '',
      address: orderData.address,
      branch: selectedBranch,
      items: [...cart],
      total: orderData.total || 0,
      appliedPrize: user?.activePrize,
      paymentMethod: orderData.paymentMethod || 'cash',
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: user?.id
    };

    setOrders(prev => [newOrder, ...prev]);
    if (user) {
      setUser({ ...user, ordersCount: user.ordersCount + 1, activePrize: null });
    }
    clearCart();
    return newOrder;
  };

  const recordSpin = (): boolean => {
    if (!user) return false;
    if (user.dailySpinsCount >= 10) return false;
    setUser({ ...user, dailySpinsCount: user.dailySpinsCount + 1 });
    return true;
  };

  const recordWin = (prize: Prize) => {
    if (!user) return;
    setUser({ ...user, dailyPrizesCount: user.dailyPrizesCount + 1, activePrize: prize });
  };

  const clearActivePrize = () => { if (user) setUser({ ...user, activePrize: null }); };

  const setSelectedBranch = (branch: Branch) => setSelectedBranchState(branch);

  return (
    <AppContext.Provider value={{
      menu, branches, banners, reels, coupons, categories, wheelPrizes, globalAddons, settings, cart, orders, user, selectedBranch,
      addToCart, addStandaloneAddon, removeFromCart, updateCartQuantity, clearCart,
      login, logout, createOrder, setSelectedBranch,
      updateMenu, updateBranches, updateBanners, updateReels, updateCoupons, updateCategories, updateWheelPrizes, updateGlobalAddons, updateSettings, updateOrderStatus,
      recordSpin, recordWin, clearActivePrize
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
