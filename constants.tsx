
import { Product, Branch, Banner, Coupon } from './types';

export const BRANCHES: Branch[] = [
  {
    id: 'fayed',
    name: 'فرع فايد – الإسماعيلية',
    location: 'الشارع الجديد – بجوار جزارة شكوريا',
    whatsapp: '201012345678'
  },
  {
    id: 'shibin',
    name: 'فرع الإسماعيلية (شِبين)',
    location: 'شارع شِبين – بعد إشارة العشريني – بجوار منفذ أمان',
    whatsapp: '201087654321'
  }
];

export const INITIAL_MENU: Product[] = [
  {
    id: '1',
    name: 'فطير مشلتت سادة (جامبو)',
    description: 'فطير فلاحي بالسمن البلدي الأصلي، مورق وخفيف جداً، يقدم مع العسل والمش.',
    price: 150,
    oldPrice: 180,
    isOffer: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?auto=format&fit=crop&q=80&w=800',
    // Fixed: Category enum removed and replaced with string literal 'سادة'
    category: 'سادة',
    addons: [{ name: 'عسل نحل سدر', price: 20 }, { name: 'قشطة فلاحي', price: 30 }, { name: 'مش قديم', price: 15 }]
  },
  {
    id: '2',
    name: 'فطير بالسجق الشرقي',
    description: 'خلطة السجق السرية مع ميكس جبن شيدر وموتزاريلا وخضروات فريش.',
    price: 210,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    // Fixed: Category enum removed and replaced with string literal 'محشي لحوم'
    category: 'محشي لحوم',
    addons: [{ name: 'إضافة جبنة كيري', price: 25 }, { name: 'هالبينو حار', price: 10 }]
  },
  {
    id: '3',
    name: 'فطيرة ميكس تشيز',
    description: 'لعشاق الجبن: كيري، موتزاريلا، رومي، وشيدر مدخن.',
    price: 185,
    oldPrice: 200,
    isOffer: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&q=80&w=800',
    // Fixed: Category enum removed and replaced with string literal 'محشي جبن'
    category: 'محشي جبن'
  },
  {
    id: '4',
    name: 'فطيرة نوتيلا بالبندق',
    description: 'غارقة في شوكولاتة نوتيلا الأصلية مع قطع البندق المحمص والموز.',
    price: 165,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
    // Fixed: Category enum removed and replaced with string literal 'حلو'
    category: 'حلو',
    addons: [{ name: 'صوص لوتس', price: 25 }, { name: 'بول آيس كريم', price: 35 }]
  },
  {
    id: '5',
    name: 'فطيرة باستورما كيري',
    description: 'فطيرة حادقة محشوة بأجود أنواع البسطورما مع جبنة كيري فريش.',
    price: 195,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    // Fixed: Category enum removed and replaced with string literal 'محشي لحوم'
    category: 'محشي لحوم'
  }
];

export const BANNERS: Banner[] = [
  {
    id: 'b1',
    image: 'https://images.unsplash.com/photo-1621849400072-f554417f7051?auto=format&fit=crop&q=80&w=1200',
    title: 'الفطير الفلاحي على أصوله',
    subtitle: 'بالسمن البلدي الصافي 100%',
    type: 'hero'
  },
  {
    id: 'b2',
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=1200',
    title: 'خصم 15% على أول طلب أونلاين',
    subtitle: 'استخدم كود: MAALEM15',
    type: 'middle'
  }
];

export const ACTIVE_COUPONS: Coupon[] = [
  { code: 'X10', discount: 10, minOrder: 150 },
  { code: 'WELCOME', discount: 15, minOrder: 200 }
];

export const VODAFONE_CASH_NUMBER = '01099887766';
