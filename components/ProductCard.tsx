
import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, Percent, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, globalAddons } = useApp();
  const [showOptions, setShowOptions] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number; image?: string }[]>([]);
  const [isFlying, setIsFlying] = useState(false);
  const [flyPos, setFlyPos] = useState({ x: 0, y: 0 });

  const toggleAddon = (addon: { name: string; price: number; image?: string }) => {
    setSelectedAddons(prev => 
      prev.find(a => a.name === addon.name) 
        ? prev.filter(a => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyPos({ x: rect.left, y: rect.top });
    setIsFlying(true);
    
    addToCart(product, quantity, selectedAddons);
    
    setTimeout(() => {
      setIsFlying(false);
      if(showOptions) setShowOptions(false);
      setQuantity(1);
      setSelectedAddons([]);
    }, 800);
  };

  const discountPercentage = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : null;

  // Combine product-specific addons with global addons
  const allAvailableAddons = [
    ...(product.addons || []),
    ...(globalAddons.map(a => ({ name: a.name, price: a.price, image: a.image })))
  ];

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-orange-50 group hover:shadow-orange-100 transition-all duration-300 relative">
      {isFlying && (
        <div 
          className="fly-item w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 bg-white shadow-xl"
          style={{ left: flyPos.x, top: flyPos.y }}
        >
          <img src={product.image} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {discountPercentage && discountPercentage > 0 && (
           <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-xl font-black text-[10px] flex items-center gap-1 shadow-lg z-10 animate-bounce">
              <Percent size={10} strokeWidth={3} /> خصم {discountPercentage}%
           </div>
        )}
        <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-xl font-black text-xs shadow-lg">
          {product.price} ج.م
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-black text-gray-900 text-base leading-tight truncate mb-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-4">
           {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[10px] text-gray-400 font-bold line-through">{product.oldPrice} ج.م</span>
           )}
           <span className="text-[10px] text-orange-600 font-black">أفضل سعر</span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setShowOptions(true)} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-black py-3 rounded-2xl transition-all text-xs">تعديل الإضافات</button>
          <button onClick={handleAddToCart} className="w-12 h-12 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-orange-100">
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {showOptions && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4">
          <div className="bg-[#fffcf6] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
             <div className="p-8">
                <div className="flex justify-between mb-6">
                   <div>
                     <h2 className="text-xl font-black">{product.name}</h2>
                     <p className="text-xs text-gray-400 font-bold mt-1">{product.description}</p>
                   </div>
                   <button onClick={() => setShowOptions(false)} className="bg-gray-100 p-2 rounded-full h-fit"><Plus size={20} className="rotate-45" /></button>
                </div>

                {allAvailableAddons.length > 0 && (
                  <div className="mb-6 max-h-[40vh] overflow-y-auto scroll-hide pr-1">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase mb-3 tracking-widest flex items-center gap-1 sticky top-0 bg-[#fffcf6] py-1"><Zap size={12} className="text-orange-500" /> إضافات وصوصات مميزة بالصور</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {allAvailableAddons.map((addon, idx) => {
                        const isSelected = selectedAddons.find(a => a.name === addon.name);
                        return (
                          <button
                            key={`${addon.name}-${idx}`}
                            onClick={() => toggleAddon(addon)}
                            className={`p-3 rounded-2xl text-right flex items-center gap-4 border-2 transition-all ${
                              isSelected
                              ? 'bg-orange-50 border-orange-500'
                              : 'bg-white border-gray-100 hover:border-orange-100'
                            }`}
                          >
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm relative">
                               <img src={addon.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt={addon.name} />
                               {isSelected && (
                                 <div className="absolute inset-0 bg-orange-500/40 flex items-center justify-center">
                                    <CheckCircle2 size={24} className="text-white fill-orange-600" />
                                 </div>
                               )}
                            </div>
                            <div className="flex-1">
                               <h5 className={`text-xs font-black ${isSelected ? 'text-orange-600' : 'text-gray-900'}`}>{addon.name}</h5>
                               <p className="text-[10px] font-bold text-gray-400 mt-0.5">+{addon.price} ج.م</p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-100 bg-white text-transparent'}`}>
                               <Plus size={14} strokeWidth={4} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 border-t border-orange-100 pt-6 mt-4">
                   <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600"><Minus size={18} /></button>
                      <span className="w-10 text-center font-black">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600"><Plus size={18} /></button>
                   </div>
                   <button onClick={handleAddToCart} className="flex-1 bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                     تأكيد الإضافة <ShoppingBag size={18} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
