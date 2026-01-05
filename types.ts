
export interface Addon {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  addons?: { name: string; price: number; image?: string }[];
  isOffer?: boolean;
  isNew?: boolean;
}

export interface Reel {
  id: string;
  videoUrl: string;
  title: string;
  thumbnail: string;
  description?: string;
}

export interface AppSettings {
  appName: string;
  logoText: string;
  primaryColor: string;
  contactNumber: string;
  welcomeMessage: string;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  selectedAddons: { name: string; price: number; image?: string }[];
  note?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  whatsapp: string;
}

export interface Prize {
  id: string;
  text: string;
  type: 'discount_percent' | 'discount_fixed' | 'free_addon' | 'free_item' | 'free_delivery';
  value: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'customer';
  coupons: string[];
  ordersCount: number;
  dailySpinsCount: number;
  dailyPrizesCount: number;
  lastActivityDate?: string;
  activePrize?: Prize | null;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  branch: Branch;
  items: CartItem[];
  total: number;
  discountAmount?: number;
  appliedPrize?: Prize | null;
  paymentMethod: 'cash' | 'vodafone';
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: string;
  userId?: string;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  type: 'hero' | 'middle' | 'small';
  link?: string;
}

export interface Coupon {
  code: string;
  discount: number;
  minOrder: number;
}
