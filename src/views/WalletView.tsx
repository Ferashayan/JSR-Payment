import { useState } from 'react';

export default function WalletView() {
  const transactions = [
    { type: 'إيداع', amount: '+ 2,000,000 ر.س', date: '28 أكتوبر 2023, 10:00 ص', details: 'تغذية المحفظة لمسير رواتب شهر أكتوبر', status: 'مكتمل' },
    { type: 'سحب', amount: '- 1,940,200 ر.س', date: '29 أكتوبر 2023, 08:30 ص', details: 'صرف الرواتب - مسير أكتوبر (142 موظف)', status: 'قيد التنفيذ' },
    { type: 'سحب', amount: '- 5,000 ر.س', date: '15 أكتوبر 2023, 11:20 ص', details: 'سحب رصيد متبقي إلى حساب الشركة الأساسي', status: 'مكتمل' },
    { type: 'إيداع', amount: '+ 150,000 ر.س', date: '01 أكتوبر 2023, 09:15 ص', details: 'تغذية إضافية - مكافآت ومصاريف طارئة', status: 'مكتمل' }
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-primary-fixed/5 blur-3xl rounded-full z-[-1]"></div>
        
        {/* Available Balance */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group shadow-[0_0_20px_rgba(218,226,253,0.05)] border-primary-fixed/20">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">الرصيد المتاح</span>
            <span className="material-symbols-outlined text-primary-fixed opacity-70 group-hover:opacity-100 transition-opacity">account_balance_wallet</span>
          </div>
          <div>
            <div className="font-h2 text-white glow-text">209,800</div>
            <div className="font-body-sm text-outline-variant mt-1">ريال سعودي (SAR)</div>
          </div>
        </div>

        {/* Virtual IBAN */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-white">
            <span className="font-label-sm text-outline-variant">رقم الحساب الافتراضي</span>
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white font-data-tabular tracking-widest text-center text-sm shadow-inner">
            SA 12 8000 0000 0001 2345 6789
          </div>
          <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-sm flex items-center justify-center gap-2 transition mt-1">
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            نسخ IBAN
          </button>
        </div>
      </div>

      {/* Center Stage */}
      <div className="flex-grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

         <div className="flex justify-between items-center mb-xl relative z-10">
            <div>
              <h1 className="font-h2 text-white mb-xs glow-text">محفظة الشركة</h1>
              <p className="font-body-sm text-outline-variant">سجل المعاملات والعمليات المالية</p>
            </div>
            <button className="glass-panel px-md py-sm rounded-lg font-label-md text-white hover:bg-white/10 transition flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              تصدير كشف الحساب
            </button>
         </div>

         {/* Transactions List */}
         <div className="flex-grow flex flex-col gap-4 relative z-10 overflow-y-auto pr-2 scrollbar-hide">
            {transactions.map((tx, i) => (
               <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/[0.06] transition-colors group">
                 <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${tx.type === 'إيداع' ? 'bg-secondary-container/10 border-secondary-container/30 text-secondary-container' : 'bg-white/5 border-white/10 text-white'}`}>
                       <span className="material-symbols-outlined">
                         {tx.type === 'إيداع' ? 'south_west' : 'north_east'}
                       </span>
                    </div>
                    <div>
                      <h3 className="font-label-md text-white mb-1.5">{tx.details}</h3>
                      <div className="font-data-tabular text-outline-variant text-[11px] flex gap-3">
                         <span>{tx.date}</span>
                         <span>•</span>
                         <span>{tx.type}</span>
                      </div>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`font-data-tabular font-bold text-lg ${tx.type === 'إيداع' ? 'text-secondary-container' : 'text-white'}`}>
                      {tx.amount}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${tx.status === 'مكتمل' ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/30' : 'bg-orange-400/20 text-orange-400 border-orange-400/30'} border`}>
                      {tx.status}
                    </span>
                 </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
