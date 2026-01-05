
import React, { useState, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { Flame, Trophy, PlusCircle, ArrowRight, Tag, MapPin, CheckCircle2, PlayCircle, Store } from 'lucide-react';
import ReelsViewer from '../components/ReelsViewer';

interface HomeProps {
  onSeeAllMenu: (filter?: string) => void;
  onGoToWheel: () => void;
  onAdminAccess: () => void;
}

const Home: React.FC<HomeProps> = ({ onSeeAllMenu, onGoToWheel, onAdminAccess }) => {
  const { selectedBranch, setSelectedBranch, menu, branches, banners, reels, settings, categories } = useApp();
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);
  
  // Logic for 5 clicks to admin
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);

  const handleBranchClick = (branch: any) => {
    const now = Date.now();
    setSelectedBranch(branch);

    if (now - lastClickTime.current < 500) {
      const newCount = clickCount + 1;
      if (newCount >= 4) { // 0 to 4 is 5 clicks
        onAdminAccess();
        setClickCount(0);
      } else {
        setClickCount(newCount);
      }
    } else {
      setClickCount(0);
    }
    lastClickTime.current = now;
  };

  const offers = menu.filter(p => p.isOffer);

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      
      {/* 0. Reels / Stories Section */}
      {reels.length > 0 && (
        <div className="pt-6 px-4">
           <div className="flex items-center gap-2 mb-4 px-1">
              <PlayCircle size={16} className="text-orange-600" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المعلم ريلز 🔥</h3>
           </div>
           <div className="flex gap-4 overflow-x-auto scroll-hide pb-2">
              {reels.map((reel, index) => (
                <button 
                  key={reel.id} 
                  onClick={() => setSelectedReelIndex(index)}
                  className="flex-shrink-0 flex flex-col items-center gap-2 group"
                >
                  <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-orange-600 to-yellow-400 group-active:scale-95 transition-all">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-gray-200">
                      <img src={reel.thumbnail} className="w-full h-full object-cover" alt={reel.title} />
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-gray-500 truncate w-20 text-center">{reel.title}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* 1. Top Section - Welcome & Branch Selector */}
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.2] tracking-tight">
              {settings.welcomeMessage.split(' ').slice(0, 2).join(' ')}<br/> 
              {settings.welcomeMessage.split(' ').slice(2).join(' ')} <span className="text-orange-600 font-brand italic">{settings.appName.split(' ')[1] || 'المعلم'}</span>
          </h2>
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-orange-100 flex items-center justify-center text-orange-600 animate-bounce">
            <PlusCircle size={28} />
          </div>
        </div>

        {/* Branch Selection Section - IMPROVED */}
        <div className="mb-8 bg-white/50 p-6 rounded-[2.5rem] border border-orange-50">
           <div className="flex items-center gap-2 mb-5 px-1">
              <Store size={18} className="text-orange-600" />
              <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest">أقرب فرع ليك لخدمتك</h3>
           </div>
           <div className="grid grid-cols-1 gap-3">
              {branches.map((branch) => {
                const isSelected = selectedBranch.id === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchClick(branch)}
                    className={`relative p-5 rounded-3xl border-2 transition-all text-right flex items-center gap-4 ${
                      isSelected 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-100 scale-[1.01]' 
                      : 'bg-white border-gray-100 text-gray-900 hover:border-orange-200 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-orange-50 text-orange-600'}`}>
                       <MapPin size={24} />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-gray-900'}`}>{branch.name}</span>
                          {isSelected && <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase">نشط الآن</span>}
                       </div>
                       <span className={`text-[10px] font-bold block mt-1 ${isSelected ? 'text-orange-100' : 'text-gray-400'}`}>{branch.location}</span>
                    </div>
                    {isSelected && <CheckCircle2 size={24} className="text-white" />}
                  </button>
                );
              })}
           </div>
        </div>
        
        {/* Main Hero Banner */}
        {banners.length > 0 && (
          <div className="relative group w-full overflow-hidden rounded-[2.5rem] h-56 shadow-2xl shadow-orange-100 border-4 border-white">
            <img 
              src={banners[0].image} 
              alt={banners[0].title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
              <div className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-3">إعلان مميز</div>
              <h3 className="text-white font-black text-2xl mb-1">{banners[0].title}</h3>
              <p className="text-white/70 text-xs font-medium">{banners[0].subtitle}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Quick Categories Bar */}
      <div className="px-4 mb-10 mt-4">
        <div className="flex gap-3 overflow-x-auto scroll-hide pb-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => onSeeAllMenu(cat)}
              className="flex-shrink-0 bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all active:scale-95 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-xs font-black text-gray-700 whitespace-nowrap">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. TODAY'S OFFERS SECTION */}
      <div className="mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-50 to-transparent -z-10"></div>
        <div className="px-6 flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 animate-pulse">
                <Flame size={22} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 leading-none">عروض اليوم 🔥</h3>
                <p className="text-[10px] text-gray-400 font-bold mt-1">متفوتش فرصة التوفير يا معلم!</p>
              </div>
           </div>
           <button onClick={() => onSeeAllMenu('العروض')} className="bg-white/50 backdrop-blur-sm border border-gray-100 text-orange-600 font-black text-[10px] px-4 py-2 rounded-xl">عرض الكل</button>
        </div>
        
        <div className="flex gap-5 overflow-x-auto scroll-hide px-6 pb-6">
          {offers.map(p => (
            <div key={p.id} className="flex-shrink-0 w-64 transform hover:-translate-y-1 transition-transform duration-300">
               <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* 4. FEATURED BANNERS SECTION */}
      <div className="px-4 mb-12">
        <div className="flex items-center gap-3 mb-6 px-2">
           <Tag className="text-orange-500 rotate-90" size={20} />
           <h3 className="font-black text-xl text-gray-900 tracking-tight">إعلانات المعلم</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
           {banners.slice(1).map((banner) => (
             <div key={banner.id} className="relative h-44 rounded-[2rem] overflow-hidden shadow-lg border-2 border-white group">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex flex-col justify-center p-8">
                   <h4 className="text-white font-black text-lg mb-1">{banner.title}</h4>
                   <p className="text-white/80 text-xs font-medium max-w-[200px] leading-relaxed mb-4">{banner.subtitle}</p>
                   <button className="bg-white text-gray-900 font-black text-[10px] px-5 py-2.5 rounded-xl w-fit flex items-center gap-2">
                     تفاصيل العرض <ArrowRight size={14} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* 5. Wheel Banner */}
      <div className="px-4 mb-12">
        <div onClick={onGoToWheel} className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 cursor-pointer group">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
             <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 animate-float shadow-inner">
                <Trophy size={48} className="text-orange-400" />
             </div>
             <div className="flex-1">
                <h3 className="text-white font-black text-2xl mb-2">عجلة حظ المعلم 🎯</h3>
                <p className="text-indigo-100/70 text-xs font-medium leading-relaxed max-w-xs mx-auto md:mx-0">لف العجلة واكسب خصومات أو وجبات مجانية.. حظك مستنيك!</p>
             </div>
             <button className="bg-white text-indigo-900 font-black px-8 py-4 rounded-2xl shadow-xl transition-all transform group-hover:scale-105">إلعب الآن</button>
          </div>
        </div>
      </div>

      {/* Full Screen Reels Viewer */}
      {selectedReelIndex !== null && (
        <ReelsViewer 
          reels={reels} 
          initialIndex={selectedReelIndex} 
          onClose={() => setSelectedReelIndex(null)} 
        />
      )}
    </div>
  );
};

export default Home;
