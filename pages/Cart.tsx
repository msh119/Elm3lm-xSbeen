
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, Send, MapPin, Ticket, ChevronRight, Gift, Sparkles, CheckCircle2, Zap, Copy, Wallet, AlertCircle } from 'lucide-react';
import { ACTIVE_COUPONS, VODAFONE_CASH_NUMBER } from '../constants';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, selectedBranch, createOrder, user, coupons } = useApp();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    paymentMethod: 'cash' as 'cash' | 'vodafone',
    senderPhone: ''
  });

  const subtotal = cart.reduce((sum, item) => {
    const addonsTotal = item.selectedAddons.reduce((a, b) => a + b.price, 0);
    const itemTotalPrice = (item.price + addonsTotal) * item.quantity;
    return sum + itemTotalPrice;
  }, 0);

  // Prize Logic from Wheel
  let prizeDiscount = 0;
  const activePrize = user?.activePrize;
  if (activePrize) {
    if (activePrize.type === 'discount_percent') {
      prizeDiscount = (subtotal * activePrize.value / 100);
    } else if (activePrize.type === 'discount_fixed' || activePrize.type === 'free_delivery') {
      prizeDiscount = activePrize.value;
    }
  }

  // Coupon Logic
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
  const totalDiscount = prizeDiscount + couponDiscount;
  const deliveryFee = activePrize?.type === 'free_delivery' ? 0 : 20;
  const total = Math.max(0, subtotal - totalDiscount + deliveryFee);

  const handleApplyCoupon = () => {
    const allCoupons = [...ACTIVE_COUPONS, ...coupons];
    const foundCoupon = allCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    
    if (foundCoupon) {
      if (subtotal >= foundCoupon.minOrder) {
        setAppliedCoupon({code: foundCoupon.code, discount: foundCoupon.discount});
        setCouponError('');
        setCouponCode('');
      } else {
        setCouponError(`الحد الأدنى لهذا الكوبون ${foundCoupon.minOrder} ج.م`);
      }
    } else {
      setCouponError('كود الخصم غير صحيح أو منتهي');
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(VODAFONE_CASH_NUMBER);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    if(!formData.name || !formData.phone || !formData.address) {
      alert('من فضلك كمل بيانات التوصيل يا معلم!');
      return;
    }

    if(formData.paymentMethod === 'vodafone' && !formData.senderPhone) {
      alert('من فضلك دخل رقم الموبايل اللي حولت منه عشان نتأكد!');
      return;
    }

    createOrder({
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
      total,
      discountAmount: totalDiscount
    });

    const itemsText = cart.map(item => {
      const addonsText = item.selectedAddons.length 
        ? `\n  - إضافات: ${item.selectedAddons.map(a => `${a.name} (+${a.price}ج)`).join(', ')}`
        : '';
      return `- ${item.quantity}x ${item.name} (${item.price} ج.م)${addonsText}`;
    }).join('\n');

    const message = `
*طلب جديد - المعلم X شِبين* 🥧
------------------------
👤 *العميل:* ${formData.name}
📞 *الهاتف:* ${formData.phone}
📍 *الفرع:* ${selectedBranch.name}
🏠 *العنوان:* ${formData.address}
💳 *الدفع:* ${formData.paymentMethod === 'cash' ? 'عند الاستلام' : `فودافون كاش (من رقم: ${formData.senderPhone})`}
${activePrize ? `🎁 *جائزة العجلة:* ${activePrize.text} (-${prizeDiscount} ج.م)` : ''}
${appliedCoupon ? `🎟️ *كود الخصم:* ${appliedCoupon.code} (-${couponDiscount} ج.م)` : ''}
------------------------
📝 *الطلبات:*
${itemsText}
------------------------
💰 *الإجمالي:* ${total} ج.م
    `.trim();

    window.open(`https://wa.me/${selectedBranch.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 h-[70vh] animate-in slide-in-from-top duration-500">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-orange-200 animate-bounce">
          <Trash2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-800">سلتك فاضية يا معلم</h2>
        <p className="text-gray-400 text-sm mt-3 text-center max-w-xs leading-relaxed">
          ريحة الفطير بتنادي عليك.. املأ السلة ودلع نفسك بأحلى الأصناف!
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-top duration-500 px-4 relative min-h-screen">
      <div className="py-6 flex items-center justify-between border-b border-gray-100 mb-8 sticky top-0 bg-[#fffcf6]/90 backdrop-blur-md z-30">
        <h2 className="text-2xl font-black text-gray-900">سلة المشتريات</h2>
        <div className="flex items-center gap-2">
           <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-orange-100">{cart.length} أصناف</span>
        </div>
      </div>

      {checkoutStep === 1 ? (
        <div className="space-y-8">
          {activePrize && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-5 rounded-[2rem] text-white shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-500">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Gift size={24} /></div>
                  <div>
                    <h4 className="text-xs font-black">جائزة عجلة الحظ مفعلة!</h4>
                    <p className="text-[10px] text-green-50 font-bold">{activePrize.text}</p>
                  </div>
               </div>
               <div className="bg-white text-green-600 px-3 py-2 rounded-xl text-[10px] font-black">جاهزة للطلب</div>
            </div>
          )}

          <div className="space-y-4">
            {cart.map(item => {
              const itemAddonsPrice = item.selectedAddons.reduce((acc, a) => acc + a.price, 0);
              const isStandaloneAddon = item.id.startsWith('addon-');

              return (
                <div key={item.cartItemId} className="flex flex-col bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  {isStandaloneAddon && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">إضافة منفصلة</div>}
                  <div className="flex gap-4">
                    <div className="relative">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="flex-1">
                       <h4 className="font-black text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                       <p className="text-[10px] text-gray-400 font-bold mt-1">{item.price} ج.م للواحد</p>
                       
                       {item.selectedAddons.length > 0 && (
                         <div className="mt-2 space-y-1">
                           {item.selectedAddons.map((addon, idx) => (
                             <div key={idx} className="flex items-center gap-1.5 text-[9px] font-black text-orange-600 bg-orange-50 w-fit px-2 py-0.5 rounded-full">
                               <Zap size={8} /> {addon.name} (+{addon.price} ج)
                             </div>
                           ))}
                         </div>
                       )}

                       <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center bg-gray-100 rounded-xl p-0.5 gap-1">
                             <button onClick={() => updateCartQuantity(item.cartItemId, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600"><Minus size={12} /></button>
                             <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                             <button onClick={() => updateCartQuantity(item.cartItemId, 1)} className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-lg shadow-sm"><Plus size={12} /></button>
                          </div>
                          <div className="text-left">
                            <span className="font-black text-gray-900 text-sm">{(item.price + itemAddonsPrice) * item.quantity} ج.م</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-dashed border-orange-200">
             <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <Ticket size={20} />
                </div>
                <h3 className="font-black text-sm text-gray-900">أدخل كود الخصم</h3>
             </div>
             
             {appliedCoupon ? (
               <div className="flex items-center justify-between bg-green-50 p-4 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <div>
                      <p className="text-xs font-black text-green-800">تم تطبيق الكوبون: {appliedCoupon.code}</p>
                      <p className="text-[10px] text-green-600 font-bold">خصم {appliedCoupon.discount}%</p>
                    </div>
                  </div>
                  <button onClick={() => setAppliedCoupon(null)} className="text-red-500 text-[10px] font-black underline">إلغاء</button>
               </div>
             ) : (
               <div className="space-y-3">
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="كود الخصم (مثلاً: X10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-2 focus:ring-orange-200"
                    />
                    <button onClick={handleApplyCoupon} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-orange-600 transition-colors">تطبيق</button>
                 </div>
                 {couponError && <p className="text-red-500 text-[10px] font-black mr-2">{couponError}</p>}
               </div>
             )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-top duration-500 pb-10">
           <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
              <MapPin size={20} className="text-orange-600" /> بيانات التوصيل
           </h3>
           <div className="space-y-4">
              <input placeholder="الأسم بالكامل" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-200 outline-none" />
              <input placeholder="رقم الموبايل للتواصل" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-200 outline-none" />
              <textarea placeholder="العنوان بالتفصيل (الشارع - رقم العمارة - الدور)" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold shadow-sm h-32 resize-none focus:ring-2 focus:ring-orange-200 outline-none" />
           </div>

           <h3 className="font-black text-lg text-gray-900 flex items-center gap-2 mt-8">
              <Sparkles size={20} className="text-orange-600" /> طريقة الدفع
           </h3>
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === 'cash' ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'cash' ? 'bg-white/20' : 'bg-gray-50'}`}><Plus size={20} /></div>
                <span className="text-xs font-black">كاش عند الاستلام</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, paymentMethod: 'vodafone'})}
                className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === 'vodafone' ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'vodafone' ? 'bg-white/20' : 'bg-gray-50'}`}><Wallet size={20} /></div>
                <span className="text-xs font-black">فودافون كاش</span>
              </button>
           </div>

           {formData.paymentMethod === 'vodafone' && (
             <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 space-y-4 animate-in zoom-in duration-300">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle size={20} />
                  <span className="text-xs font-black">تعليمات التحويل:</span>
                </div>
                <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-red-200">
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold mb-1">رقم المحفظة (فودافون كاش):</p>
                     <p className="text-lg font-black text-gray-900 tracking-widest">{VODAFONE_CASH_NUMBER}</p>
                   </div>
                   <button 
                    onClick={handleCopyNumber}
                    className={`p-3 rounded-xl transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                   >
                     {copySuccess ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                   </button>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 mr-2 tracking-widest">الرقم اللي حولت منه (للتأكد)</label>
                   <input 
                    type="tel" 
                    placeholder="دخل الرقم هنا..." 
                    value={formData.senderPhone} 
                    onChange={e => setFormData({...formData, senderPhone: e.target.value})}
                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-2 focus:ring-red-200 outline-none"
                   />
                </div>
                <p className="text-[10px] text-red-500 font-bold text-center leading-relaxed">
                  * بعد الضغط على "تأكيد" سيتم فتح واتساب، يرجى إرسال "صورة التحويل" هناك.
                </p>
             </div>
           )}
        </div>
      )}

      <div className="h-[480px] w-full pointer-events-none" aria-hidden="true"></div>

      <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.15)] border border-white/50 z-40">
         <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs font-bold text-gray-400 px-1">
               <span>المجموع:</span>
               <span className="text-gray-900 font-black">{subtotal} ج.م</span>
            </div>
            
            {(prizeDiscount > 0 || couponDiscount > 0) && (
               <div className="flex flex-col gap-2">
                 {prizeDiscount > 0 && (
                   <div className="flex justify-between text-xs font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-xl">
                      <span className="flex items-center gap-1"><Gift size={10} /> خصم العجلة:</span>
                      <span>-{Math.round(prizeDiscount)} ج.م</span>
                   </div>
                 )}
                 {couponDiscount > 0 && (
                   <div className="flex justify-between text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
                      <span className="flex items-center gap-1"><Ticket size={10} /> خصم الكوبون:</span>
                      <span>-{Math.round(couponDiscount)} ج.م</span>
                   </div>
                 )}
               </div>
            )}

            <div className="flex justify-between text-xs font-bold text-gray-400 px-1">
               <span>خدمة التوصيل:</span>
               <span className={deliveryFee === 0 ? "text-green-600 font-black" : "text-gray-900 font-black"}>{deliveryFee === 0 ? "مجاني 🎁" : `${deliveryFee} ج.م`}</span>
            </div>
            <div className="h-px bg-gray-100 my-2"></div>
            <div className="flex justify-between items-center px-1">
               <span className="text-sm font-black text-gray-500 uppercase tracking-tighter">الإجمالي النهائي</span>
               <span className="text-3xl font-black text-orange-600">{Math.round(total)} <small className="text-sm">ج.م</small></span>
            </div>
         </div>
         
         <div className="flex gap-3">
            {checkoutStep === 2 && (
              <button onClick={() => setCheckoutStep(1)} className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-2xl text-gray-400 hover:bg-gray-200 transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
            )}
            <button 
              onClick={checkoutStep === 1 ? () => setCheckoutStep(2) : handleWhatsAppOrder} 
              className={`flex-1 ${checkoutStep === 1 ? 'bg-gray-900' : 'bg-green-600'} text-white py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all`}
            >
              {checkoutStep === 1 ? (
                <>إتمام الطلب <ChevronRight size={18} className="rotate-180" /></>
              ) : (
                <>تأكيد وطلب عبر واتساب <Send size={18} /></>
              )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default Cart;
