
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Search, Flame, Sparkles, Filter, Plus, Zap } from 'lucide-react';

interface MenuProps {
  initialFilter?: string;
}

const Menu: React.FC<MenuProps> = ({ initialFilter = 'الكل' }) => {
  const { menu, categories, globalAddons, addStandaloneAddon } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  // Update filter if initialFilter changes (from Home page navigation)
  useEffect(() => {
    setSelectedFilter(initialFilter);
  }, [initialFilter]);

  const filteredMenu = menu.filter(p => {
    const matchesSearch = p.name.includes(searchQuery) || p.description.includes(searchQuery);
    
    if (selectedFilter === 'الكل') return matchesSearch;
    if (selectedFilter === 'العروض') return p.isOffer && matchesSearch;
    if (selectedFilter === 'الجديد') return p.isNew && matchesSearch;
    if (selectedFilter === 'إضافات') return false; // Handled separately
    
    return p.category === selectedFilter && matchesSearch;
  });

  const mainFilters = [
    { id: 'الكل', label: 'الكل', icon: Filter },
    { id: 'العروض', label: 'العروض 🔥', icon: Flame },
    { id: 'الجديد', label: 'وصل حديثاً ✨', icon: Sparkles },
    { id: 'إضافات', label: 'إضافات منفصلة 🧂', icon: Zap }
  ];

  return (
    <div className="animate-in slide-in-from-top duration-500 pb-20">
      <div className="p-4 bg-[#fffcf6]/90 backdrop-blur-md sticky top-0 z-30 border-b border-orange-100/50">
        <h2 className="text-xl font-black text-gray-900 mb-4">قائمة الطعام</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="عايز تاكل إيه النهاردة؟"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-orange-50 rounded-2xl py-4 pr-12 pl-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-200 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Dynamic Filters Bar */}
        <div className="space-y-4">
           {/* Quick Filters */}
           <div className="flex gap-2 overflow-x-auto scroll-hide pb-1">
              {mainFilters.map((f) => (
                <button 
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border-2 ${
                    selectedFilter === f.id 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
           </div>

           {/* Category Selection */}
           <div className="flex gap-2 overflow-x-auto scroll-hide pb-2">
              {categories.filter(c => c !== 'إضافات').map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${
                    selectedFilter === cat 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
                    : 'bg-orange-50/50 text-orange-600 border-orange-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="p-4">
        {selectedFilter === 'إضافات' ? (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom duration-500">
            {globalAddons.map(addon => (
              <div key={addon.id} className="bg-white p-5 rounded-[2rem] border border-orange-50 shadow-sm flex flex-col justify-between items-center text-center group hover:shadow-orange-100 transition-all">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={32} />
                </div>
                <h4 className="font-black text-sm text-gray-900 mb-1">{addon.name}</h4>
                <p className="text-orange-600 font-black text-xs mb-4">{addon.price} ج.م</p>
                <button 
                  onClick={() => addStandaloneAddon(addon)}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  إضافة للسلة <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredMenu.length > 0 ? (
              filteredMenu.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                  <Search size={40} />
                </div>
                <h3 className="text-lg font-black text-gray-800">ملقناش طلبك يا معلم</h3>
                <p className="text-gray-400 text-sm mt-2">جرب تبحث بكلمة تانية أو غير الفلتر</p>
                <button 
                  onClick={() => {setSelectedFilter('الكل'); setSearchQuery('');}}
                  className="mt-6 text-orange-600 font-black text-sm underline"
                >
                  عرض المنيو بالكامل
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
