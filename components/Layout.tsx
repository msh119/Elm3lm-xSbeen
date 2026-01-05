
import React from 'react';
import { ShoppingCart, Menu as MenuIcon, User, Home, Award, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'menu' | 'cart' | 'profile' | 'admin';
  setActiveTab: (tab: 'home' | 'menu' | 'cart' | 'profile' | 'admin') => void;
  onAdminClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onAdminClick }) => {
  const { cart, user, settings } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'menu', icon: MenuIcon, label: 'المنيو' },
    { id: 'cart', icon: ShoppingCart, label: 'سلتك' },
    { id: 'profile', icon: User, label: 'حسابي' }
    // تم إخفاء زر الإدارة من هنا بناءً على طلب المستخدم
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-0 flex flex-col bg-[#fffcf6]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-orange-100/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div 
            style={{ background: `linear-gradient(to bottom right, ${settings.primaryColor}, #000)` }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-md border border-white/30"
          >
            {settings.logoText}
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 leading-none tracking-tighter">{settings.appName}</h1>
            <p className="text-[9px] text-orange-600 font-bold uppercase tracking-widest mt-0.5">الملك في منطقتك</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('cart')}
            className="relative p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-orange-600 transition-all active:scale-90"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black border border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto md:max-w-4xl px-0">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-gray-900/95 backdrop-blur-xl flex justify-between items-center h-16 px-1.5 md:hidden rounded-full shadow-2xl z-50 border border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full transition-all duration-300 relative ${isActive ? 'bg-orange-500 text-white flex-1' : 'text-gray-400 flex-1'}`}
            >
              <Icon size={18} strokeWidth={isActive ? 3 : 2} className="shrink-0" />
              {isActive && <span className="text-[10px] font-black whitespace-nowrap overflow-hidden">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
