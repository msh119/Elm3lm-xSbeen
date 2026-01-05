
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PartyPopper, AlertCircle, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { Prize } from '../types';

const WheelOfFortune: React.FC = () => {
  const { user, recordSpin, recordWin, wheelPrizes } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState(0);

  const canSpin = user && user.dailySpinsCount < 10 && user.dailyPrizesCount < 2 && !user.activePrize;

  const handleSpin = () => {
    if (isSpinning || !canSpin || wheelPrizes.length === 0) return;
    
    if (recordSpin()) {
      setIsSpinning(true);
      const randomExtra = Math.random() * 360;
      const newRotation = rotation + 1800 + randomExtra; 
      setRotation(newRotation);
      
      setTimeout(() => {
        setIsSpinning(false);
        const normalizedRotation = (360 - (newRotation % 360)) % 360;
        const sliceSize = 360 / wheelPrizes.length;
        const prizeIndex = Math.floor(normalizedRotation / sliceSize);
        const wonPrize = wheelPrizes[prizeIndex];
        
        setPrize(wonPrize);
        recordWin(wonPrize);
      }, 4000);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center py-6 px-4">
      {/* Daily Limits Header */}
      <div className="w-full max-w-xs grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white p-3 rounded-2xl border border-orange-100 text-center shadow-sm">
           <p className="text-[9px] text-gray-400 font-black uppercase mb-1">اللفات اليومية</p>
           <h4 className="text-sm font-black text-orange-600">{user.dailySpinsCount} / 10</h4>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-orange-100 text-center shadow-sm">
           <p className="text-[9px] text-gray-400 font-black uppercase mb-1">الجوائز المتبقية</p>
           <h4 className="text-sm font-black text-orange-600">{Math.max(0, 2 - user.dailyPrizesCount)} جائزة</h4>
        </div>
      </div>

      {user.activePrize ? (
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-[2.5rem] text-center text-white shadow-2xl animate-in zoom-in w-full max-w-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy size={80} /></div>
          <Sparkles className="mx-auto mb-4 animate-pulse" size={40} />
          <h3 className="text-xl font-black mb-2">مبروك يا معلم!</h3>
          <p className="text-green-50 text-xs mb-6 font-medium">معاك جائزة نشطة مستنية طلبك:</p>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl py-4 px-6 mb-8 border border-white/30">
             <span className="text-2xl font-black">{user.activePrize.text}</span>
          </div>
          <p className="text-[10px] text-green-100 font-bold bg-black/10 py-2 rounded-full">الجائزة هتطبق تلقائياً في السلة مع أوردرك</p>
        </div>
      ) : (
        <>
          <div className="relative w-72 h-72 mb-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10 bg-orange-600 rounded-b-2xl shadow-xl flex items-center justify-center border-2 border-white">
               <div className="w-1 h-4 bg-white/30 rounded-full"></div>
            </div>
            
            <div 
              className="w-full h-full rounded-full border-[12px] border-orange-100 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {wheelPrizes.map((p, i) => (
                <div 
                  key={i}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ transform: `rotate(${i * (360 / wheelPrizes.length)}deg)`, clipPath: `polygon(50% 50%, 50% 0, ${50 + 100 * Math.tan(Math.PI / wheelPrizes.length)}% 0, 100% 0, 100% 100%)`, opacity: 1 }}
                >
                  <div 
                    className={`w-full h-full ${i % 2 === 0 ? 'bg-orange-400' : 'bg-orange-500'} border-l border-white/10`}
                    style={{ 
                      clipPath: `polygon(50% 50%, 50% 0, ${50 + 150 * Math.tan((2 * Math.PI / wheelPrizes.length) / 2)}% 0)`
                    }}
                  >
                  </div>
                </div>
              ))}
              
              {/* Text overlays to stay legible */}
              {wheelPrizes.map((p, i) => (
                <div 
                  key={`text-${i}`}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  style={{ transform: `rotate(${i * (360 / wheelPrizes.length) + (360/wheelPrizes.length/2)}deg)` }}
                >
                  <span className="text-[9px] font-black text-white whitespace-nowrap translate-x-16 -rotate-90">{p.text}</span>
                </div>
              ))}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center font-black text-orange-600 text-2xl border-4 border-orange-50 z-10">X</div>
              </div>
            </div>
          </div>

          {!canSpin && user.dailySpinsCount >= 10 ? (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-6 py-3 rounded-2xl border border-red-100 mb-4 animate-bounce">
              <AlertCircle size={18} />
              <span className="text-xs font-black">خلصت لفاتك النهاردة يا معلم!</span>
            </div>
          ) : !canSpin && user.dailyPrizesCount >= 2 ? (
            <div className="flex items-center gap-2 text-orange-500 bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 mb-4">
              <Trophy size={18} />
              <span className="text-xs font-black">حققت ليميت الجوائز اليومية (2)</span>
            </div>
          ) : (
            <button 
              onClick={handleSpin}
              disabled={isSpinning || !canSpin || wheelPrizes.length === 0}
              className={`group relative overflow-hidden bg-gray-900 text-white font-black px-16 py-5 rounded-[2rem] shadow-2xl transition-all ${isSpinning ? 'opacity-50' : 'hover:bg-orange-600 active:scale-95'}`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSpinning ? 'جاري اللف...' : 'جرب حظك دلوقتي! 🎯'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </button>
          )}
          
          <p className="mt-6 text-[10px] text-gray-400 font-bold max-w-xs text-center leading-relaxed">
            * ليك ١٠ لفات في اليوم وبحد أقصى جايزتين.. الجائزة صالحة مع أي أوردر تعمله دلوقت!
          </p>
        </>
      )}
    </div>
  );
};

export default WheelOfFortune;
