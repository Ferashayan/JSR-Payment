'use client';
import { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { useModal } from '@/components/ModalContext';

export default function EmployeeWalletPage() {
  const { openModal } = useModal();
  const { employeeBalance, employeeTransactions, employeeWithdraw, showToast, paymentMethods } = useApp();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDetails, setTransferDetails] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleTransfer = () => {
    const amount = parseInt(transferAmount);
    if (!amount || amount <= 0) { showToast('أدخل مبلغاً صالحاً', 'error'); return; }
    if (amount > employeeBalance) { showToast('الرصيد غير كافٍ', 'error'); return; }
    setIsSaving(true);
    setTimeout(() => {
      employeeWithdraw(amount, transferDetails || 'تحويل بنكي');
      showToast(`تم تحويل ${amount.toLocaleString()} ر.س بنجاح`);
      setShowTransferModal(false); setTransferAmount(''); setTransferDetails(''); setIsSaving(false);
    }, 800);
  };

  const totalIn = employeeTransactions.filter(t => t.numericAmount > 0).reduce((s, t) => s + t.numericAmount, 0);
  const totalOut = Math.abs(employeeTransactions.filter(t => t.numericAmount < 0).reduce((s, t) => s + t.numericAmount, 0));

  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-primary-fixed/5 blur-3xl rounded-full z-[-1]"></div>
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group shadow-[0_0_20px_rgba(218,226,253,0.05)]">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">رصيدي المتاح</span><span className="material-symbols-outlined text-primary-fixed opacity-70 group-hover:opacity-100 transition-opacity">account_balance_wallet</span></div>
          <div><div className="font-h2 text-white glow-text">{employeeBalance.toLocaleString()}</div><div className="font-body-sm text-outline-variant mt-1">ريال سعودي (SAR)</div></div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowTransferModal(true)} className="flex-1 py-2 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-sm hover:bg-primary-fixed-dim transition flex items-center justify-center gap-1"><span className="material-symbols-outlined text-[16px]">arrow_upward</span> تحويل</button>
            <button onClick={() => showToast('تم طلب الإيداع بنجاح', 'info')} className="flex-1 py-2 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition flex items-center justify-center gap-1"><span className="material-symbols-outlined text-[16px]">add</span> إيداع</button>
          </div>
        </div>
        <div className="glass-panel rounded-xl p-md flex flex-col gap-3 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-white"><span className="font-label-sm text-outline-variant">حساب المحفظة (IBAN)</span><span className="material-symbols-outlined text-[18px]">account_balance</span></div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white font-data-tabular tracking-widest text-center text-sm shadow-inner">SA 89 8000 0000 0001 0023 4455</div>
          <button onClick={() => { navigator.clipboard.writeText('SA8980000000000100234455'); showToast('تم نسخ رقم IBAN'); }} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-sm flex items-center justify-center gap-2 transition mt-1"><span className="material-symbols-outlined text-[18px]">content_copy</span>نسخ البيانات</button>
        </div>
        <div className="glass-panel rounded-xl p-md flex flex-col gap-3 relative z-10">
          <div className="flex justify-between items-center mb-1 text-white"><span className="font-label-sm text-outline-variant">طرق الدفع المحفوظة</span><button onClick={() => openModal('add_payment_method')} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-[16px]">add</span></button></div>
          <div className="space-y-2">
            {paymentMethods.map(pm => (
              <div key={pm.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded ${pm.iconColor} flex items-center justify-center`}><span className="material-symbols-outlined text-[16px]">{pm.icon}</span></div><div><div className="font-label-sm text-white text-xs">{pm.label}</div><div className="text-[10px] text-outline-variant font-data-tabular">{pm.subLabel}</div></div></div></div>
            ))}
          </div>
        </div>
      </div>
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-xl relative z-10">
          <div><h1 className="font-h2 text-white mb-xs glow-text">محفظتي الشخصية</h1><p className="font-body-sm text-outline-variant">سجل العمليات والتحويلات الخاصة بحسابك</p></div>
          <button onClick={() => showToast('تم تصدير كشف الحساب بنجاح')} className="glass-panel px-md py-sm rounded-lg font-label-md text-white hover:bg-white/10 transition flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">download</span>تصدير كشف الحساب</button>
        </div>
        <div className="grid grid-cols-3 gap-md mb-lg relative z-10">
          <div className="glass-panel rounded-xl p-md flex flex-col gap-2"><div className="flex justify-between items-center"><span className="font-label-sm text-outline-variant">إجمالي الوارد</span><div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container border border-secondary-container/30"><span className="material-symbols-outlined text-[16px]">south_west</span></div></div><div className="font-h3 text-secondary-container">{totalIn.toLocaleString()} <span className="font-label-sm text-outline-variant">ر.س</span></div></div>
          <div className="glass-panel rounded-xl p-md flex flex-col gap-2"><div className="flex justify-between items-center"><span className="font-label-sm text-outline-variant">إجمالي الصادر</span><div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10"><span className="material-symbols-outlined text-[16px]">north_east</span></div></div><div className="font-h3 text-white">{totalOut.toLocaleString()} <span className="font-label-sm text-outline-variant">ر.س</span></div></div>
          <div className="glass-panel rounded-xl p-md flex flex-col gap-2"><div className="flex justify-between items-center"><span className="font-label-sm text-outline-variant">عدد العمليات</span><div className="w-8 h-8 rounded-full bg-primary-fixed/20 flex items-center justify-center text-primary-fixed border border-primary-fixed/30"><span className="material-symbols-outlined text-[16px]">receipt_long</span></div></div><div className="font-h3 text-white">{employeeTransactions.length} <span className="font-label-sm text-outline-variant">عمليات</span></div></div>
        </div>
        <div className="grow flex flex-col gap-4 relative z-10 overflow-y-auto pr-2 scrollbar-hide">
          {employeeTransactions.map((tx) => (
            <div key={tx.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:bg-white/[0.06] transition-colors group">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${tx.type === 'إيداع' ? 'bg-secondary-container/10 border-secondary-container/30 text-secondary-container' : 'bg-white/5 border-white/10 text-white'}`}><span className="material-symbols-outlined">{tx.type === 'إيداع' ? 'south_west' : 'north_east'}</span></div>
                <div><h3 className="font-label-md text-white mb-1.5">{tx.details}</h3><div className="font-data-tabular text-outline-variant text-[11px] flex gap-3"><span>{tx.date}</span><span>•</span><span>{tx.type}</span></div></div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`font-data-tabular font-bold text-lg ${tx.type === 'إيداع' ? 'text-secondary-container' : 'text-white'}`}>{tx.amount}</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-secondary-container/20 text-secondary-container border-secondary-container/30 border">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showTransferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setShowTransferModal(false)}>
          <div className="glass-panel w-full max-w-[450px] rounded-3xl border border-white/10 animate-in zoom-in-95 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 bg-white/[0.02]"><h2 className="font-h2 text-white">تحويل بنكي</h2><p className="font-body-sm text-outline-variant mt-1">الرصيد المتاح: {employeeBalance.toLocaleString()} ر.س</p></div>
            <div className="p-6 flex flex-col gap-5">
              <div><label className="block text-outline-variant font-label-sm mb-2">مبلغ التحويل (ر.س) *</label><input type="number" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none focus:border-secondary-container transition" placeholder="5000" dir="ltr" /></div>
              <div><label className="block text-outline-variant font-label-sm mb-2">الوصف</label><input value={transferDetails} onChange={e => setTransferDetails(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" placeholder="سداد بطاقة / تحويل محلي" dir="rtl" /></div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowTransferModal(false)} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-label-md hover:bg-white/10 transition">إلغاء</button>
                <button onClick={handleTransfer} disabled={isSaving} className="flex-1 py-3 rounded-xl bg-primary-fixed text-on-primary-fixed font-label-md hover:bg-primary-fixed-dim transition flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSaving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">send</span>}
                  تحويل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
