
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Branch, Banner, Order, Coupon, Prize, Addon, Reel } from '../types';
import { 
  BarChart3, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  LayoutGrid, 
  Settings, 
  MapPin, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  User, 
  XCircle,
  AlertCircle,
  ShieldCheck,
  Tag,
  Image as ImageIcon,
  Palette,
  Upload,
  Layers,
  ArrowRight,
  Percent,
  Award,
  PlusCircle,
  PackagePlus,
  Zap,
  PlayCircle,
  Link as LinkIcon,
  Ticket,
  Flame,
  Star
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type AdminTab = 'stats' | 'orders' | 'menu' | 'addons' | 'reels' | 'wheel' | 'coupons' | 'banners' | 'identity';

const Admin: React.FC = () => {
  const { 
    orders, menu, branches, banners, reels, coupons, categories, wheelPrizes, globalAddons, settings, user, login,
    updateMenu, updateBranches, updateBanners, updateReels, updateCoupons, updateCategories, updateWheelPrizes, updateGlobalAddons, updateSettings, updateOrderStatus
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<'product' | 'banner' | 'coupon' | 'branch' | 'category' | 'prize' | 'addon' | 'reel' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Login State
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'حوراحمد') {
      login('مدير النظام', '0000', true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة يا معلم!');
      setPassword('');
    }
  };

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-orange-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-orange-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200 animate-bounce">
              <Plus size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">لوحة تحكم المعلم</h1>
            <p className="text-gray-400 text-xs font-bold mb-8">يجب إدخال كلمة المرور للوصول للصلاحيات</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className={`w-full bg-gray-50 border-2 ${error ? 'border-red-500' : 'border-transparent'} focus:border-orange-500 rounded-2xl px-6 py-5 text-center text-lg font-black transition-all outline-none`}
                autoFocus
              />
              {error && <p className="text-red-500 text-[10px] font-black">{error}</p>}
              <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2">
                دخول للنظام <ShieldCheck size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- Helpers ---
  const formatPrice = (price: number) => new Intl.NumberFormat('ar-EG').format(price);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string = 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditItem({ ...editItem, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { 
        alert('الفيديو كبير جداً، حاول ترفعه على رابط خارجي.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditItem({ ...editItem, videoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Save Actions ---
  const handleSaveProduct = () => {
    const newList = menu.some(i => i.id === editItem.id) 
      ? menu.map(i => i.id === editItem.id ? editItem : i)
      : [...menu, editItem];
    updateMenu(newList);
    setEditItem(null);
  };

  const handleSaveBanner = () => {
    const newList = banners.some(i => i.id === editItem.id)
      ? banners.map(i => i.id === editItem.id ? editItem : i)
      : [...banners, editItem];
    updateBanners(newList);
    setEditItem(null);
  };

  const handleSaveGlobalAddon = () => {
    const newList = globalAddons.some(i => i.id === editItem.id)
      ? globalAddons.map(i => i.id === editItem.id ? editItem : i)
      : [...globalAddons, editItem];
    updateGlobalAddons(newList);
    setEditItem(null);
  };

  const handleSaveReel = () => {
    const newList = reels.some(i => i.id === editItem.id)
      ? reels.map(i => i.id === editItem.id ? editItem : i)
      : [...reels, editItem];
    updateReels(newList);
    setEditItem(null);
  };

  const handleSaveCoupon = () => {
    const newList = coupons.some(i => i.code === editItem.code)
      ? coupons.map(i => i.code === editItem.code ? editItem : i)
      : [...coupons, editItem];
    updateCoupons(newList);
    setEditItem(null);
  };

  const handleSavePrize = () => {
    const newList = wheelPrizes.some(i => i.id === editItem.id)
      ? wheelPrizes.map(i => i.id === editItem.id ? editItem : i)
      : [...wheelPrizes, editItem];
    updateWheelPrizes(newList);
    setEditItem(null);
  };

  // Addon management functions (inside product editor)
  const addAddonToProduct = () => {
    const currentAddons = editItem.addons || [];
    setEditItem({ ...editItem, addons: [...currentAddons, { name: '', price: 0, image: '' }] });
  };

  const removeAddonFromProduct = (index: number) => {
    const currentAddons = [...(editItem.addons || [])];
    currentAddons.splice(index, 1);
    setEditItem({ ...editItem, addons: currentAddons });
  };

  const updateProductAddon = (index: number, field: string, value: any) => {
    const currentAddons = [...(editItem.addons || [])];
    currentAddons[index] = { ...currentAddons[index], [field]: value };
    setEditItem({ ...editItem, addons: currentAddons });
  };

  // --- Render Sections ---
  const renderStats = () => {
    const totalSales = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
    
    return (
      <div className="space-y-8 animate-in slide-in-from-top duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي المبيعات', value: `${formatPrice(totalSales)} ج.م`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'الطلبات النشطة', value: activeOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'الأصناف', value: menu.length, icon: LayoutGrid, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'الفروع', value: branches.length, icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' }
          ].map((s) => (
            <div key={s.label} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}><s.icon size={24} /></div>
              <p className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-wider">{s.label}</p>
              <h4 className="text-2xl font-black text-slate-900">{s.value}</h4>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100">
           <h3 className="font-black text-slate-900 text-lg mb-8 flex items-center gap-2">
             <TrendingUp size={22} className="text-orange-600" /> تحليل المبيعات (أسبوعي)
           </h3>
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[{n:'السبت',s:4000},{n:'الأحد',s:3000},{n:'الإثنين',s:5000},{n:'الثلاثاء',s:2780},{n:'الأربعاء',s:1890},{n:'الخميس',s:2390},{n:'الجمعة',s:3490}]}>
                    <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="s" stroke="#f97316" strokeWidth={4} fill="url(#colorSales)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    );
  };

  const renderCouponsEditor = () => (
    <div className="space-y-6 animate-in slide-in-from-top duration-500">
       <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Ticket size={24} /></div>
             <h3 className="font-black text-slate-900">أكواد الخصم</h3>
          </div>
          <button 
            onClick={() => { 
              setEditType('coupon'); 
              setEditItem({ code: '', discount: 10, minOrder: 150 }); 
            }} 
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 text-xs"
          >
            <Plus size={18} /> إضافة كود جديد
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(coupon => (
             <div key={coupon.code} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col shadow-sm relative group overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h4 className="font-black text-slate-900 text-lg">{coupon.code}</h4>
                      <p className="text-xs text-indigo-600 font-black mt-1">خصم {coupon.discount}%</p>
                   </div>
                   <div className="flex gap-1">
                      <button onClick={() => { setEditType('coupon'); setEditItem(coupon); }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => updateCoupons(coupons.filter(c => c.code !== coupon.code))} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                   </div>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-50">
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">الحد الأدنى للطلب: {coupon.minOrder} ج.م</p>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderWheelEditor = () => (
    <div className="space-y-6 animate-in slide-in-from-top duration-500">
       <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><Award size={24} /></div>
             <h3 className="font-black text-slate-900">جوائز عجلة الحظ</h3>
          </div>
          <button 
            onClick={() => { 
              setEditType('prize'); 
              setEditItem({ id: Math.random().toString(), text: '', type: 'discount_percent', value: 0 }); 
            }} 
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 text-xs"
          >
            <Plus size={18} /> إضافة جائزة
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wheelPrizes.map(prize => (
             <div key={prize.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col shadow-sm relative group overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h4 className="font-black text-slate-900 text-sm">{prize.text}</h4>
                      <p className="text-[10px] text-amber-600 font-black mt-1">
                        {prize.type === 'discount_percent' ? `خصم ${prize.value}%` : 
                         prize.type === 'discount_fixed' ? `خصم ${prize.value} ج.م` : 
                         prize.type === 'free_delivery' ? 'توصيل مجاني' : 'صنف مجاني'}
                      </p>
                   </div>
                   <div className="flex gap-1">
                      <button onClick={() => { setEditType('prize'); setEditItem(prize); }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => updateWheelPrizes(wheelPrizes.filter(p => p.id !== prize.id))} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderBannersEditor = () => (
    <div className="space-y-6 animate-in slide-in-from-top duration-500">
       <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><ImageIcon size={24} /></div>
             <h3 className="font-black text-slate-900">إدارة الإعلانات والبنرات</h3>
          </div>
          <button 
            onClick={() => { 
              setEditType('banner'); 
              setEditItem({ id: Math.random().toString(), title: '', subtitle: '', image: '', type: 'hero' }); 
            }} 
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 text-xs"
          >
            <Plus size={18} /> إضافة بنر جديد
          </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(banner => (
             <div key={banner.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm relative group">
                <div className="h-40 relative">
                   <img src={banner.image} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                      <h4 className="text-white font-black text-sm">{banner.title}</h4>
                      <p className="text-white/70 text-[10px]">{banner.subtitle}</p>
                   </div>
                   <div className="absolute top-3 right-3 flex gap-2">
                      <button onClick={() => { setEditType('banner'); setEditItem(banner); }} className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-all"><Edit3 size={14} /></button>
                      <button onClick={() => updateBanners(banners.filter(b => b.id !== banner.id))} className="p-2 bg-red-500/80 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition-all"><Trash2 size={14} /></button>
                   </div>
                   <div className="absolute top-3 left-3 bg-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                      {banner.type}
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-32">
      {/* Admin Nav */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 overflow-x-auto scroll-hide">
         <div className="max-w-6xl mx-auto px-6 flex items-center gap-2 md:gap-4 h-24 min-w-max">
            {[
              { id: 'stats', label: 'الرئيسية', icon: BarChart3 },
              { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
              { id: 'menu', label: 'المنيو والأسعار', icon: LayoutGrid },
              { id: 'banners', label: 'الإعلانات', icon: ImageIcon },
              { id: 'coupons', label: 'أكواد الخصم', icon: Ticket },
              { id: 'wheel', label: 'عجلة الحظ', icon: Award },
              { id: 'addons', label: 'الإضافات', icon: Zap },
              { id: 'reels', label: 'الريلز', icon: PlayCircle },
              { id: 'identity', label: 'الهوية', icon: Settings },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} className={`flex items-center gap-2 text-xs font-black px-5 py-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
         </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'orders' && (orders.length > 0 ? (
          <div className="space-y-6">
            <h3 className="text-xl font-black">إدارة الطلبات ({orders.length})</h3>
            <div className="grid grid-cols-1 gap-4">
              {orders.map(o => (
                <div key={o.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center">
                   <div>
                      <p className="text-xs font-black text-slate-900">{o.customerName} - {o.id}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{o.branch.name} • {new Date(o.createdAt).toLocaleString('ar-EG')}</p>
                   </div>
                   <select 
                     value={o.status} 
                     onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                     className="bg-slate-50 border-none rounded-xl text-[10px] font-black p-2"
                   >
                     <option value="pending">معلق</option>
                     <option value="preparing">تحضير</option>
                     <option value="delivered">توصيل</option>
                     <option value="cancelled">إلغاء</option>
                   </select>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="p-12 text-center text-gray-400 font-bold">لا يوجد طلبات</div>)}
        
        {activeTab === 'menu' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                   <LayoutGrid className="text-orange-600" size={24} />
                   <h3 className="font-black">إدارة المنيو والأسعار ({menu.length})</h3>
                </div>
                <button onClick={() => { setEditType('product'); setEditItem({ id: Math.random().toString(), name: '', price: 0, oldPrice: 0, category: categories[0], image: '', description: '', isOffer: false, isNew: false, addons: [] }); }} className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 text-xs">
                  <Plus size={18} /> إضافة صنف
                </button>
             </div>

             {/* Offers quick filter toggle */}
             <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-4">
                <Star className="text-orange-600 fill-orange-600" size={18} />
                <p className="text-xs font-black text-orange-900">الأصناف المميزة كعرض حالياً: {menu.filter(p => p.isOffer).length}</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map(p => (
                   <div key={p.id} className="bg-white p-4 rounded-[2.5rem] border border-slate-100 flex flex-col group relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="relative">
                        <img src={p.image} className="h-40 w-full object-cover rounded-[2rem] mb-4" />
                        {p.isOffer && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                             <Flame size={10} /> عرض 🔥
                          </div>
                        )}
                        <div className="absolute bottom-6 right-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl font-black text-orange-600 text-xs shadow-sm">
                          {p.price} ج.م
                        </div>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm mb-1 px-2">{p.name}</h4>
                      <div className="flex gap-2 mt-auto p-2">
                         <button onClick={() => { setEditType('product'); setEditItem(p); }} className="flex-1 bg-slate-50 py-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"><Edit3 size={14} /> تعديل</button>
                         <button onClick={() => updateMenu(menu.filter(i => i.id !== p.id))} className="w-12 bg-red-50 text-red-500 py-3 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"><Trash2 size={14} /></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
        
        {activeTab === 'banners' && renderBannersEditor()}
        {activeTab === 'coupons' && renderCouponsEditor()}
        {activeTab === 'wheel' && renderWheelEditor()}
        {activeTab === 'addons' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Zap size={24} /></div>
                   <h3 className="font-black text-slate-900">إدارة الإضافات العامة</h3>
                </div>
                <button 
                  onClick={() => { 
                    setEditType('addon'); 
                    setEditItem({ id: Math.random().toString(36).substr(2, 9), name: '', price: 0, image: '' }); 
                  }} 
                  className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 text-xs"
                >
                  <Plus size={18} /> إضافة خيار عام
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {globalAddons.map(addon => (
                   <div key={addon.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex flex-col shadow-sm relative group overflow-hidden">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border">
                            <img src={addon.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <h4 className="font-black text-slate-900 text-sm">{addon.name}</h4>
                            <p className="text-[10px] text-blue-600 font-black mt-0.5">+{addon.price} ج.م</p>
                         </div>
                         <div className="flex gap-1">
                            <button onClick={() => { setEditType('addon'); setEditItem(addon); }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit3 size={14} /></button>
                            <button onClick={() => updateGlobalAddons(globalAddons.filter(a => a.id !== addon.id))} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center"><PlayCircle size={24} /></div>
                   <h3 className="font-black text-slate-900">إدارة المعلم ريلز</h3>
                </div>
                <button 
                  onClick={() => { 
                    setEditType('reel'); 
                    setEditItem({ id: Math.random().toString(36).substr(2, 9), title: '', videoUrl: '', thumbnail: '' }); 
                  }} 
                  className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-600 transition-all flex items-center gap-2 text-xs"
                >
                  <Plus size={18} /> إضافة فيديو جديد
                </button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {reels.map(reel => (
                   <div key={reel.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all relative group">
                      <div className="aspect-[9/16] relative bg-slate-900">
                         <img src={reel.thumbnail} className="w-full h-full object-cover opacity-60" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircle size={32} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <div className="absolute top-3 left-3 flex gap-2">
                            <button onClick={() => { setEditType('reel'); setEditItem(reel); }} className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/40 transition-all"><Edit3 size={14} /></button>
                            <button onClick={() => updateReels(reels.filter(r => r.id !== reel.id))} className="p-2 bg-red-500/80 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition-all"><Trash2 size={14} /></button>
                         </div>
                      </div>
                      <div className="p-4">
                         <h4 className="font-black text-slate-900 text-[10px] truncate">{reel.title}</h4>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'identity' && (
           <div className="max-w-2xl mx-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                updateSettings({
                  appName: fd.get('appName') as string,
                  logoText: fd.get('logoText') as string,
                  primaryColor: fd.get('primaryColor') as string,
                  contactNumber: fd.get('contactNumber') as string,
                  welcomeMessage: fd.get('welcomeMessage') as string,
                });
                alert('تم تحديث هوية المنصة بنجاح!');
              }} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Palette size={200} /></div>
                 <div className="flex items-center gap-5 pb-8 border-b relative z-10">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner"><Settings size={32} /></div>
                    <div><h3 className="font-black text-2xl text-slate-900">إدارة العلامة التجارية</h3></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-3 mr-2 tracking-widest">اسم المطعم</label><input name="appName" defaultValue={settings.appName} className="w-full bg-slate-50 p-5 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-orange-200" /></div>
                    <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-3 mr-2 tracking-widest">حرف الشعار</label><input name="logoText" defaultValue={settings.logoText} maxLength={1} className="w-full bg-slate-50 p-5 rounded-2xl text-sm font-black border-none outline-none text-center" /></div>
                 </div>
                 <button type="submit" className="w-full bg-gray-900 text-white py-6 rounded-[2.5rem] font-black text-base flex items-center justify-center gap-3 shadow-2xl hover:bg-orange-600 transition-all relative z-10"><Save size={24} /> حفظ الإعدادات</button>
              </form>
           </div>
        )}
      </div>

      {/* Shared Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] relative">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h3 className="text-xl font-black text-gray-900">تعديل {
                  editType === 'product' ? 'صنف' : 
                  editType === 'addon' ? 'إضافة' : 
                  editType === 'prize' ? 'جائزة العجلة' : 
                  editType === 'coupon' ? 'كود خصم' : 
                  editType === 'banner' ? 'إعلان/بنر' :
                  editType === 'reel' ? 'فيديو ريلز' : 'عنصر'}</h3>
                <button onClick={() => { setEditItem(null); setEditType(null); }} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><XCircle size={24} /></button>
              </div>
              
              <div className="space-y-6">
                 {editType === 'product' && (
                   <>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">اسم الصنف</label><input value={editItem.name} onChange={e => setEditItem({...editItem, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none" /></div>
                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">القسم</label><select value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none">
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select></div>
                     </div>

                     <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 space-y-6">
                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                           <DollarSign size={18} />
                           <h4 className="text-xs font-black uppercase">إدارة الأسعار والعروض</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[9px] font-black text-gray-500 mb-2">السعر الحالي (ج.م)</label>
                              <input type="number" value={editItem.price} onChange={e => setEditItem({...editItem, price: Number(e.target.value)})} className="w-full bg-white p-4 rounded-2xl font-black border-none focus:ring-2 focus:ring-orange-200" />
                           </div>
                           <div>
                              <label className="block text-[9px] font-black text-gray-500 mb-2">السعر القديم (اختياري)</label>
                              <input type="number" value={editItem.oldPrice || 0} onChange={e => setEditItem({...editItem, oldPrice: Number(e.target.value)})} className="w-full bg-white p-4 rounded-2xl font-black border-none text-gray-400 focus:ring-2 focus:ring-orange-200" />
                           </div>
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-2xl shadow-sm">
                           <input type="checkbox" checked={editItem.isOffer} onChange={e => setEditItem({...editItem, isOffer: e.target.checked})} className="w-5 h-5 accent-orange-600" />
                           <div className="flex items-center gap-2">
                              <Star size={16} className="text-orange-500 fill-orange-500" />
                              <span className="text-xs font-black">تمييز كعرض/صنف مميز 🔥</span>
                           </div>
                        </label>
                     </div>

                     <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Zap size={14} /> إضافات خاصة بهذا الصنف</h4>
                           <button onClick={addAddonToProduct} className="text-[9px] font-black bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus size={10} /> إضافة خيار</button>
                        </div>
                        <div className="space-y-3">
                           {editItem.addons?.map((addon: any, idx: number) => (
                             <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                               <div className="flex gap-2 items-center">
                                  <input value={addon.name} onChange={e => updateProductAddon(idx, 'name', e.target.value)} placeholder="الاسم" className="flex-1 bg-slate-50 border-none rounded-lg p-2 text-[10px] font-bold" />
                                  <input type="number" value={addon.price} onChange={e => updateProductAddon(idx, 'price', Number(e.target.value))} className="w-16 bg-slate-50 border-none rounded-lg p-2 text-[10px] font-bold" />
                                  <button onClick={() => removeAddonFromProduct(idx)} className="text-red-500"><Trash2 size={12} /></button>
                               </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">صورة الصنف</label>
                        <div className="flex gap-2">
                          <input value={editItem.image} onChange={e => setEditItem({...editItem, image: e.target.value})} placeholder="رابط الصورة..." className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold" />
                          <button onClick={() => fileInputRef.current?.click()} className="bg-orange-100 text-orange-600 p-4 rounded-2xl"><ImageIcon size={20} /></button>
                          <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e)} accept="image/*" className="hidden" />
                        </div>
                     </div>
                     <button onClick={handleSaveProduct} className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-orange-600 transition-all">حفظ التغييرات</button>
                   </>
                 )}

                 {editType === 'banner' && (
                   <>
                     <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">عنوان الإعلان</label><input value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none" /></div>
                     <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">وصف قصير</label><input value={editItem.subtitle} onChange={e => setEditItem({...editItem, subtitle: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none" /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">مكان الظهور</label>
                          <select value={editItem.type} onChange={e => setEditItem({...editItem, type: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none">
                            <option value="hero">البنر الرئيسي (أعلى الصفحة)</option>
                            <option value="middle">بنر منتصف الصفحة</option>
                            <option value="small">بنر صغير</option>
                          </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">صورة الإعلان</label>
                           <div className="flex gap-2">
                             <input value={editItem.image} onChange={e => setEditItem({...editItem, image: e.target.value})} placeholder="رابط الصورة..." className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border-none" />
                             <button onClick={() => fileInputRef.current?.click()} className="bg-orange-100 text-orange-600 p-4 rounded-2xl"><Upload size={20} /></button>
                             <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e)} accept="image/*" className="hidden" />
                           </div>
                        </div>
                     </div>
                     <button onClick={handleSaveBanner} className="w-full bg-orange-600 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-orange-700 transition-all">حفظ وتفعيل الإعلان</button>
                   </>
                 )}

                 {editType === 'coupon' && (
                   <>
                     <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">كود الخصم (بالإنجليزي)</label><input value={editItem.code} onChange={e => setEditItem({...editItem, code: e.target.value.toUpperCase()})} placeholder="X10" className="w-full bg-slate-50 p-4 rounded-2xl font-black text-center text-xl tracking-widest border-none" /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">نسبة الخصم %</label><input type="number" value={editItem.discount} onChange={e => setEditItem({...editItem, discount: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-black border-none" /></div>
                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">الحد الأدنى للطلب</label><input type="number" value={editItem.minOrder} onChange={e => setEditItem({...editItem, minOrder: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-black border-none" /></div>
                     </div>
                     <button onClick={handleSaveCoupon} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 transition-all">تفعيل كود الخصم</button>
                   </>
                 )}

                 {editType === 'prize' && (
                   <>
                     <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">نص الجائزة (يظهر للعميل)</label><input value={editItem.text} onChange={e => setEditItem({...editItem, text: e.target.value})} placeholder="خصم 15%" className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none" /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">نوع الجائزة</label>
                          <select value={editItem.type} onChange={e => setEditItem({...editItem, type: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none">
                            <option value="discount_percent">نسبة مئوية %</option>
                            <option value="discount_fixed">مبلغ ثابت</option>
                            <option value="free_delivery">توصيل مجاني</option>
                            <option value="free_item">صنف مجاني</option>
                          </select>
                        </div>
                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">القيمة (إن وجدت)</label><input type="number" value={editItem.value} onChange={e => setEditItem({...editItem, value: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-black border-none" /></div>
                     </div>
                     <button onClick={handleSavePrize} className="w-full bg-amber-600 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-amber-700 transition-all">حفظ وتحديث الجائزة</button>
                   </>
                 )}

                 {editType === 'addon' && (
                   <>
                     <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">اسم الإضافة</label><input value={editItem.name} onChange={e => setEditItem({...editItem, name: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none" /></div>
                     <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">السعر (ج.م)</label><input type="number" value={editItem.price} onChange={e => setEditItem({...editItem, price: Number(e.target.value)})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none" /></div>
                     <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">صورة الإضافة</label>
                       <div className="flex gap-2">
                         <input value={editItem.image} onChange={e => setEditItem({...editItem, image: e.target.value})} placeholder="رابط الصورة..." className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border-none" />
                         <button onClick={() => fileInputRef.current?.click()} className="bg-blue-100 text-blue-600 p-4 rounded-2xl"><Upload size={20} /></button>
                         <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e)} accept="image/*" className="hidden" />
                       </div>
                     </div>
                     <button onClick={handleSaveGlobalAddon} className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-blue-700 transition-all">حفظ الإضافة</button>
                   </>
                 )}

                 {editType === 'reel' && (
                   <>
                     <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">عنوان الفيديو</label><input value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none" /></div>
                     <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">رابط الفيديو</label>
                       <div className="flex gap-2">
                          <input value={editItem.videoUrl} onChange={e => setEditItem({...editItem, videoUrl: e.target.value})} placeholder="رابط فيديو خارجي (mp4)..." className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border-none" />
                          <button onClick={() => videoInputRef.current?.click()} className="bg-purple-100 text-purple-600 p-4 rounded-2xl flex items-center gap-2"><Upload size={20} /></button>
                          <input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/*" className="hidden" />
                       </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2">صورة الغلاف (Thumbnail)</label>
                        <div className="flex gap-2">
                          <input value={editItem.thumbnail} onChange={e => setEditItem({...editItem, thumbnail: e.target.value})} placeholder="رابط صورة الغلاف..." className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border-none" />
                          <button onClick={() => fileInputRef.current?.click()} className="bg-orange-100 text-orange-600 p-4 rounded-2xl"><ImageIcon size={20} /></button>
                          <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'thumbnail')} accept="image/*" className="hidden" />
                        </div>
                     </div>
                     <button onClick={handleSaveReel} className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-black shadow-xl hover:bg-purple-700 transition-all">حفظ فيديو الريلز</button>
                   </>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
