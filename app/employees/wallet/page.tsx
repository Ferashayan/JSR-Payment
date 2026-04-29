'use client';
import { useState } from 'react';
import { useApp } from '@/components/AppContext';

export default function WalletPage() {
  const { companyBalance, companyTransactions, companyDeposit, companyWithdraw, showToast } = useApp();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDetails, setDepositDetails] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (!amount || amount <= 0) { showToast('أدخل مبلغاً صالحاً', 'error'); return; }
    setIsSaving(true);
    setTimeout(() => {
      companyDeposit(amount, depositDetails || 'تغذية المحفظة');
      showToast(`تم إيداع ${amount.toLocaleString()} ر.س بنجاح`);
      setShowDepositModal(false); setDepositAmount(''); setDepositDetails(''); setIsSaving(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-primary-fixed/5 blur-3xl rounded-full z-[-1]"></div>
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group shadow-[0_0_20px_rgba(218,226,253,0.05)] border-primary-fixed/20">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">الرصيد المتاح</span><span className="material-symbols-outlined text-primary-fixed opacity-70 group-hover:opacity-100 transition-opacity">account_balance_wallet</span></div>
          <div><div className="font-h2 text-white glow-text">{companyBalance.toLocaleString()}</div><div className="font-body-sm text-outline-variant mt-1">ريال سعودي (SAR)</div></div>
          <button onClick={() => setShowDepositModal(true)} className="w-full mt-4 py-2 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm hover:bg-secondary-fixed transition flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px]">add</span> تغذية المحفظة
          </button>
        </div>
        <div className="glass-panel rounded-xl p-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-white"><span className="font-label-sm text-outline-variant">رقم الحساب الافتراضي</span><span className="material-symbols-outlined text-[18px]">account_balance</span></div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white font-data-tabular tracking-widest text-center text-sm shadow-inner">SA 12 8000 0000 0001 2345 6789</div>
          <button onClick={() => { navigator.clipboard.writeText('SA1280000000000123456789'); showToast('تم نسخ رقم IBAN'); }} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-sm flex items-center justify-center gap-2 transition mt-1"><span className="material-symbols-outlined text-[18px]">content_copy</span>نسخ IBAN</button>
        </div>
      </div>
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-xl relative z-10">
          <div><h1 className="font-h2 text-white mb-xs glow-text">محفظة الشركة</h1><p className="font-body-sm text-outline-variant">سجل المعاملات والعمليات المالية</p></div>
          <button onClick={() => showToast('تم تصدير كشف الحساب بنجاح')} className="glass-panel px-md py-sm rounded-lg font-label-md text-white hover:bg-white/10 transition flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">download</span>تصدير كشف الحساب</button>
        </div>
        <div className="grow flex flex-col gap-4 relative z-10 overflow-y-auto pr-2 scrollbar-hide">
          {companyTransactions.map((tx) => (
            <div key={tx.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/[0.06] transition-colors group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${tx.type === 'إيداع' ? 'bg-secondary-container/10 border-secondary-container/30 text-secondary-container' : 'bg-white/5 border-white/10 text-white'}`}><span className="material-symbols-outlined">{tx.type === 'إيداع' ? 'south_west' : 'north_east'}</span></div>
                <div><h3 className="font-label-md text-white mb-1.5">{tx.details}</h3><div className="font-data-tabular text-outline-variant text-[11px] flex gap-3"><span>{tx.date}</span><span>•</span><span>{tx.type}</span></div></div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`font-data-tabular font-bold text-lg ${tx.type === 'إيداع' ? 'text-secondary-container' : 'text-white'}`}>{tx.amount}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${tx.status === 'مكتمل' ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/30' : 'bg-orange-400/20 text-orange-400 border-orange-400/30'} border`}>{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setShowDepositModal(false)}>
          <div className="glass-panel w-full max-w-[450px] rounded-3xl border border-white/10 animate-in zoom-in-95 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 bg-white/[0.02]"><h2 className="font-h2 text-white">تغذية محفظة الشركة</h2><p className="font-body-sm text-outline-variant mt-1">الرصيد الحالي: {companyBalance.toLocaleString()} ر.س</p></div>
            <div className="p-6 flex flex-col gap-5">
              <div><label className="block text-outline-variant font-label-sm mb-2">مبلغ الإيداع (ر.س) *</label><input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none focus:border-secondary-container transition" placeholder="500000" dir="ltr" /></div>
              <div><label className="block text-outline-variant font-label-sm mb-2">الوصف</label><input value={depositDetails} onChange={e => setDepositDetails(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" placeholder="تغذية المحفظة الشهرية" dir="rtl" /></div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowDepositModal(false)} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-label-md hover:bg-white/10 transition">إلغاء</button>
                <button onClick={handleDeposit} disabled={isSaving} className="flex-1 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSaving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">add</span>}
                  إيداع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
