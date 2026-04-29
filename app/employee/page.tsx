'use client';
import { useState } from 'react';
import { useModal } from '@/components/ModalContext';
import { useApp } from '@/components/AppContext';

export default function EmployeeDashboardPage() {
  const { openModal } = useModal();
  const { employeeBalance, showToast, requests, addRequest } = useApp();
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [advAmount, setAdvAmount] = useState('');
  const [advReason, setAdvReason] = useState('');
  const [advPayDate, setAdvPayDate] = useState('');
  const [leaveType, setLeaveType] = useState('سنوية');
  const [leaveStart, setLeaveStart] = useState('');
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveNotes, setLeaveNotes] = useState('');

  const handleAdvanceSubmit = () => {
    const amt = parseInt(advAmount);
    if (!amt || amt <= 0) { showToast('أدخل مبلغاً صالحاً', 'error'); return; }
    addRequest({ type: 'سلفة', details: advReason || 'سلفة نقدية', amount: amt });
    showToast('تم تقديم طلب سلفتك بنجاح، في انتظار الموافقة', 'info');
    setShowAdvanceModal(false); setAdvAmount(''); setAdvReason(''); setAdvPayDate('');
  };

  const handleLeaveSubmit = () => {
    if (!leaveStart || !leaveEnd) { showToast('حدد تاريخ البداية والنهاية', 'error'); return; }
    addRequest({ type: 'إجازة', details: `إجازة ${leaveType}`, leaveType, startDate: leaveStart, endDate: leaveEnd, notes: leaveNotes });
    showToast('تم تقديم طلب إجازتك بنجاح، في انتظار الموافقة', 'info');
    setShowLeaveModal(false); setLeaveStart(''); setLeaveEnd(''); setLeaveNotes('');
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition';
  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      {/* Sidebar: Personal Overview */}
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-primary-fixed/5 blur-3xl rounded-full z-[-1]"></div>
        
        {/* Profile Snapshot */}
        <div className="glass-panel rounded-xl p-md flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full border-2 border-primary-fixed/30 bg-primary-fixed/10 flex items-center justify-center text-primary-fixed text-2xl font-bold mb-3 shadow-[0_0_15px_rgba(218,226,253,0.1)]">
                أ.س
            </div>
            <h2 className="font-h3 text-white mb-1">أحمد سالم</h2>
            <p className="font-body-sm text-outline-variant">مطور واجهات أمامية</p>
            <div className="mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-secondary-container flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
                متاح ومسجل الدخول
            </div>
        </div>

        {/* Available Balance */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center hover:bg-white/5 transition-colors cursor-pointer group shadow-[0_0_20px_rgba(218,226,253,0.05)] border-primary-fixed/20">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">رصيد المحفظة الحالي</span>
            <span className="material-symbols-outlined text-primary-fixed opacity-70 group-hover:opacity-100 transition-opacity">account_balance_wallet</span>
          </div>
          <div>
            <div className="font-h2 text-white glow-text">{employeeBalance.toLocaleString()}</div>
            <div className="font-body-sm text-outline-variant mt-1">ريال سعودي (SAR)</div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-sm hover:bg-primary-fixed-dim transition flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span> تحويل
            </button>
            <button className="flex-1 py-2 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[16px]">add</span> إيداع
            </button>
          </div>
        </div>

        {/* Virtual IBAN */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-white">
            <span className="font-label-sm text-outline-variant">حساب المحفظة (IBAN)</span>
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white font-data-tabular tracking-widest text-center text-sm shadow-inner">
            SA 89 8000 0000 0001 0023 4455
          </div>
          <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-sm flex items-center justify-center gap-2 transition mt-1">
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            نسخ البيانات
          </button>
        </div>

        {/* Payment Methods */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-center mb-1 text-white">
            <span className="font-label-sm text-outline-variant">طرق الدفع المحفوظة</span>
            <button onClick={() => openModal('add_payment_method')} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
          
          <div className="space-y-2">
             <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-secondary-container/20 text-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">account_balance</span>
                   </div>
                   <div>
                      <div className="font-label-sm text-white text-xs">بنك الراجحي</div>
                      <div className="text-[10px] text-outline-variant font-data-tabular">**** 4567</div>
                   </div>
                </div>
                <button className="text-error-container opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
             </div>
             
             <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-primary-fixed-dim/20 text-primary-fixed-dim flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
                   </div>
                   <div>
                      <div className="font-label-sm text-white text-xs">STC Pay</div>
                      <div className="text-[10px] text-outline-variant font-data-tabular">**** 0900</div>
                   </div>
                </div>
                <button className="text-error-container opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Center Stage: Main Dashboard Card */}
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-container/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-xl relative z-10">
          <div>
            <h1 className="font-h2 text-white mb-xs glow-text">أهلاً بك، أحمد ✋</h1>
            <p className="font-body-sm text-outline-variant">هنا تجد تفاصيل راتبك، ومحفظتك، والطلبات الشخصية</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setShowAdvanceModal(true)} className="glass-panel px-md py-sm rounded-lg font-label-md text-white hover:bg-white/10 transition flex items-center gap-2 border border-white/10">
               <span className="material-symbols-outlined text-[18px]">receipt_long</span> طلب سلفة
             </button>
             <button onClick={() => setShowLeaveModal(true)} className="glass-panel px-md py-sm rounded-lg font-label-md text-white hover:bg-white/10 transition flex items-center gap-2 border border-white/10">
               <span className="material-symbols-outlined text-[18px]">event_busy</span> طلب إجازة
             </button>
          </div>
        </div>

        {/* Current Salary Overview (Hero style) */}
        <div className="bg-white/2 border border-white/10 rounded-2xl p-6 mb-8 relative z-10 flex items-center justify-between">
           <div>
              <h3 className="font-label-md text-outline-variant mb-2">الراتب القادم (أكتوبر 2023)</h3>
              <div className="font-h1 text-white glow-text mb-4">24,500 <span className="font-h3 text-outline-variant">ر.س</span></div>
              <div className="flex gap-4">
                 <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary-container text-[18px]">calendar_month</span>
                    <div>
                       <div className="text-[10px] text-outline-variant">موعد الصرف المتوقع</div>
                       <div className="text-sm text-white font-data-tabular">28 أكتوبر 2023</div>
                    </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline-variant text-[18px]">hourglass_empty</span>
                    <div>
                       <div className="text-[10px] text-outline-variant">الأيام المتبقية</div>
                       <div className="text-sm text-white font-data-tabular">4 أيام</div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Mini breakdown chart */}
           <div className="w-64">
              <div className="flex justify-between items-end mb-2">
                 <span className="font-body-sm text-white">تفصيل الراتب</span>
                 <button onClick={() => showToast('تم تحميل قسيمة الراتب بنجاح')} className="text-xs text-primary-fixed hover:underline">عرض القسيمة</button>
              </div>
              <div className="space-y-3">
                 <div>
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-outline-variant">الراتب الأساسي</span>
                       <span className="text-white font-data-tabular">20,000 ر.س</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary-fixed-dim w-[80%] rounded-full"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-outline-variant">بدلات</span>
                       <span className="text-white font-data-tabular">5,500 ر.س</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-secondary-container w-[20%] rounded-full shadow-[0_0_10px_rgba(108,248,187,0.5)]"></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-outline-variant">استقطاع (تأمينات)</span>
                       <span className="text-error-container font-data-tabular">-1,000 ر.س</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-error-container w-[5%] rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-lg grow relative z-10">
           {/* Recent Transactions */}
           <div className="glass-panel rounded-xl p-md flex flex-col hover:bg-white/5 transition-colors group">
              <div className="flex justify-between items-center mb-md">
                 <h2 className="font-label-md text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">history</span>
                    آخر العمليات
                 </h2>
                 <button className="text-xs text-outline-variant hover:text-white transition-colors">عرض الكل</button>
              </div>
              <div className="space-y-3">
                 <div className="bg-white/3 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-secondary-container/10 border border-secondary-container/20 text-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">south_west</span>
                       </div>
                       <div>
                          <div className="font-body-sm text-white">إيداع راتب شهر سبتمبر</div>
                          <div className="text-[10px] text-outline-variant font-data-tabular">28 سبتمبر 2023</div>
                       </div>
                    </div>
                    <div className="font-data-tabular font-bold text-secondary-container">+24,500 <span className="text-[10px]">ر.س</span></div>
                 </div>
                 <div className="bg-white/3 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">north_east</span>
                       </div>
                       <div>
                          <div className="font-body-sm text-white">تحويل بنكي - سداد بطاقة</div>
                          <div className="text-[10px] text-outline-variant font-data-tabular">02 أكتوبر 2023</div>
                       </div>
                    </div>
                    <div className="font-data-tabular font-bold text-white">-4,000 <span className="text-[10px]">ر.س</span></div>
                 </div>
                 <div className="bg-white/3 border border-white/5 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">north_east</span>
                       </div>
                       <div>
                          <div className="font-body-sm text-white">تحويل محلي - محمد عبدالعزيز</div>
                          <div className="text-[10px] text-outline-variant font-data-tabular">15 أكتوبر 2023</div>
                       </div>
                    </div>
                    <div className="font-data-tabular font-bold text-white">-1,500 <span className="text-[10px]">ر.س</span></div>
                 </div>
              </div>
           </div>

           {/* Leave/Requests Status */}
           <div className="glass-panel rounded-xl p-md flex flex-col hover:bg-white/5 transition-colors group">
              <div className="flex justify-between items-center mb-md">
                 <h2 className="font-label-md text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-tertiary-fixed-dim">assignment</span>
                    الطلبات
                 </h2>
                 <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-data-tabular">{requests.length}</span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[260px] scrollbar-hide">
                 {requests.map(req => (
                    <div key={req.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 relative overflow-hidden">
                       <div className={`absolute right-0 top-0 bottom-0 w-1 ${
                         req.status === 'قيد المراجعة' ? 'bg-orange-400/50' : req.status === 'مقبول' ? 'bg-secondary-container/50' : 'bg-error-container/50'
                       }`}></div>
                       <div className="flex justify-between items-start mb-1">
                          <div>
                             <div className="font-label-sm text-white">{req.type === 'سلفة' ? `طلب سلفة - ${req.amount?.toLocaleString()} ر.س` : `طلب إجازة ${req.leaveType || ''}`}</div>
                             <div className="text-xs text-outline-variant">{req.details}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${
                            req.status === 'قيد المراجعة' ? 'bg-orange-400/20 text-orange-400 border-orange-400/30' :
                            req.status === 'مقبول' ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/30' :
                            'bg-error/20 text-error-container border-error/30'
                          }`}>{req.status}</span>
                       </div>
                       <div className="mt-2 flex items-center gap-2 text-[10px] text-outline-variant">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {req.date}
                       </div>
                    </div>
                 ))}
                 <div onClick={() => setShowAdvanceModal(true)} className="rounded-xl border border-dashed border-white/20 p-5 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-2">
                       <span className="material-symbols-outlined">add</span>
                    </div>
                    <span className="font-body-sm text-white">تقديم طلب جديد</span>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Advance Modal */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setShowAdvanceModal(false)}>
          <div className="glass-panel w-full max-w-[480px] rounded-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <div><h2 className="font-h2 text-white mb-1">طلب سلفة جديد</h2><p className="font-body-sm text-outline-variant">أدخل بيانات السلفة المطلوبة</p></div>
              <button onClick={() => setShowAdvanceModal(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div><label className="block text-outline-variant font-label-sm mb-2">المبلغ المطلوب (ر.س)</label><input type="number" value={advAmount} onChange={e => setAdvAmount(e.target.value)} placeholder="5000" className={inputClass} /></div>
              <div><label className="block text-outline-variant font-label-sm mb-2">سبب الطلب</label><input value={advReason} onChange={e => setAdvReason(e.target.value)} placeholder="مصاريف طارئة" className={inputClass} /></div>
              <div><label className="block text-outline-variant font-label-sm mb-2">تاريخ السداد المقترح</label><input type="date" value={advPayDate} onChange={e => setAdvPayDate(e.target.value)} className={inputClass} /></div>
              <button onClick={handleAdvanceSubmit} className="w-full py-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition mt-2">تقديم الطلب</button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setShowLeaveModal(false)}>
          <div className="glass-panel w-full max-w-[480px] rounded-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200" dir="rtl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <div><h2 className="font-h2 text-white mb-1">طلب إجازة جديد</h2><p className="font-body-sm text-outline-variant">حدد نوع الإجازة والفترة</p></div>
              <button onClick={() => setShowLeaveModal(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div><label className="block text-outline-variant font-label-sm mb-2">نوع الإجازة</label>
                <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className={inputClass}>
                  <option value="سنوية" className="bg-[#1e1e1e]">سنوية</option>
                  <option value="مرضية" className="bg-[#1e1e1e]">مرضية</option>
                  <option value="طارئة" className="bg-[#1e1e1e]">طارئة</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-outline-variant font-label-sm mb-2">تاريخ البداية</label><input type="date" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} className={inputClass} /></div>
                <div><label className="block text-outline-variant font-label-sm mb-2">تاريخ النهاية</label><input type="date" value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} className={inputClass} /></div>
              </div>
              <div><label className="block text-outline-variant font-label-sm mb-2">ملاحظات</label><textarea value={leaveNotes} onChange={e => setLeaveNotes(e.target.value)} placeholder="ملاحظات إضافية (اختياري)" rows={2} className={inputClass} /></div>
              <button onClick={handleLeaveSubmit} className="w-full py-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition mt-2">تقديم الطلب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
