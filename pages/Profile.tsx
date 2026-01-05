
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut, Package, Gift, Phone, Clock, ChevronLeft } from 'lucide-react';
import WheelOfFortune from '../components/WheelOfFortune';

interface ProfileProps {
  initialTab?: 'orders' | 'wheel';
}

const Profile: React.FC<ProfileProps> = ({ initialTab = 'orders' }) => {
  const { user, login, logout, orders } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'wheel'>(initialTab);
  const [loginData, setLoginData] = useState({ name: '', phone: '' });

  // Update tab if initialTab changes from parent
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.name && loginData.phone) {
      login(loginData.name, loginData.phone);
    }
  };

  if (!user) {
    return (
      <div className="p-4 animate-in slide-in-from-top duration-500 py-20">
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-gray-100 text-center max-w-sm mx-auto overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -mr-12 -mt-12"></div>
          
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-orange-500 rotate-3">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">يا أهلاً بك!</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed px-4">سجل عشان تتابع طلباتك وتكسب جوايز حصرية في <span className="text-orange-600 font-bold underline">عجلة الحظ</span>!</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="الأسم بالكامل"
              value={loginData.name}
              onChange={(e) => setLoginData({...loginData, name: e.target.value})}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-200 transition-all"
              required
            />
            <input 
              type="tel" 
              placeholder="رقم الموبايل"
              value={loginData.phone}
              onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
              className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-orange-200 transition-all"
              required
            />
            <button className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-orange-600 transition-all active:scale-95">انضم للمعلم الآن</button>
          </form>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(o => o.phone === user.phone);

  return (
    <div className="animate-in slide-in-from-top duration-500">
      {/* Header Profile */}
      <div className="bg-gradient-to-b from-orange-100 to-transparent p-6 rounded-b-[40px] mb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-md border-2 border-white">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                <Phone size={12} className="text-orange-500" /> {user.phone}
              </div>
            </div>
          </div>
          <button onClick={logout} className="p-3 bg-white text-red-500 rounded-2xl shadow-sm border border-red-50 hover:bg-red-50 transition-colors"><LogOut size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white">
            <p className="text-[10px] text-gray-400 font-black mb-1 uppercase tracking-widest">طلباتك</p>
            <h4 className="text-xl font-black text-slate-900">{user.ordersCount} طلب</h4>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white">
            <p className="text-[10px] text-gray-400 font-black mb-1 uppercase tracking-widest">المستوى</p>
            <h4 className="text-xl font-black text-orange-600 flex items-center gap-1">عميل برنس</h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex p-1.5 bg-gray-200/50 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black transition-all ${activeTab === 'orders' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400'}`}
          >
            <Package size={18} /> سجل الطلبات
          </button>
          <button 
            onClick={() => setActiveTab('wheel')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black transition-all ${activeTab === 'wheel' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400'}`}
          >
            <Gift size={18} /> عجلة الحظ
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="space-y-4 pb-10">
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <div key={order.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-slate-900 text-xs">{order.id}</h4>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-bold">
                        <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <span className={`text-[9px] px-3 py-1.5 rounded-full font-black ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {order.status === 'pending' ? 'جاري المراجعة' : order.status === 'delivered' ? 'تم التوصيل' : 'في الفرن'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                    <p className="text-[11px] text-slate-500 font-bold">{order.items.length} أصناف • <span className="text-slate-900">{order.total} ج.م</span></p>
                    <button className="text-orange-600 font-black text-[10px] flex items-center gap-1">التفاصيل <ChevronLeft size={12} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-8 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Package size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="font-black text-gray-400 text-sm">لسه معملتش أي أوردرات من حسابك، اطلب دلوقتي وجمع نقط!</p>
              </div>
            )}
          </div>
        ) : (
          <WheelOfFortune />
        )}
      </div>
    </div>
  );
};

export default Profile;
