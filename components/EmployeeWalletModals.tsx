'use client';
import { useState } from 'react';
import { useApp } from './AppContext';
import { formatNumber } from '@/lib/formatters';

const IC = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition';

export function useWalletModals() {
  const [showTransfer, setShowTransfer] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  return { showTransfer, setShowTransfer, showDeposit, setShowDeposit };
}

export function TransferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { employeeBalance, employeeWithdraw, showToast, paymentMethods } = useApp();
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    const n = parseInt(amount);
    if (!n || n <= 0) { showToast('أدخل مبلغاً صالحاً', 'error'); return; }
    if (n > employeeBalance) { showToast('الرصيد غير كافٍ', 'error'); return; }
    const acct = paymentMethods.find(p => String(p.id) === account);
    if (!acct) { showToast('اختر حساباً للتحويل', 'error'); return; }
    setSaving(true);
    setTimeout(() => {
      employeeWithdraw(n, `تحويل إلى ${acct.label} ${acct.subLabel}`);
      showToast('تم التحويل بنجاح');
      setAmount(''); setAccount(''); setSaving(false); onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={onClose}>
      <div className="glass-panel w-full max-w-[480px] rounded-3xl border border-white/10 animate-in zoom-in-95 overflow-hidden" dir="rtl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
          <div><h2 className="font-h2 text-white mb-1">تحويل لحساب بنكي</h2><p className="font-body-sm text-outline-variant">الرصيد المتاح: {formatNumber(employeeBalance)} ر.س</p></div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div><label className="block text-outline-variant font-label-sm mb-2">مبلغ التحويل (ر.س) *</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={IC} placeholder="5000" dir="ltr" /></div>
          <div><label className="block text-outline-variant font-label-sm mb-2">الحساب المحول إليه *</label>
            <select value={account} onChange={e => setAccount(e.target.value)} className={IC}>
              <option value="" className="bg-[#1e1e1e]">اختر حساباً...</option>
              {paymentMethods.map(pm => <option key={pm.id} value={String(pm.id)} className="bg-[#1e1e1e]">{pm.label} — {pm.subLabel}</option>)}
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-label-md hover:bg-white/10 transition">إلغاء</button>
            <button onClick={handleSubmit} disabled={saving} className="flex-1 py-3 rounded-xl bg-primary-fixed text-on-primary-fixed font-label-md hover:bg-primary-fixed-dim transition flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">send</span>}
              تحويل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DepositModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { employeeDeposit, showToast, paymentMethods } = useApp();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    const n = parseInt(amount);
    if (!n || n <= 0) { showToast('أدخل مبلغاً صالحاً', 'error'); return; }
    const pm = paymentMethods.find(p => String(p.id) === method);
    if (!pm) { showToast('اختر طريقة الدفع', 'error'); return; }
    setSaving(true);
    setTimeout(() => {
      employeeDeposit(n, `إيداع من ${pm.label}`);
      showToast('تم الإيداع بنجاح');
      setAmount(''); setMethod(''); setSaving(false); onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={onClose}>
      <div className="glass-panel w-full max-w-[480px] rounded-3xl border border-white/10 animate-in zoom-in-95 overflow-hidden" dir="rtl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
          <div><h2 className="font-h2 text-white mb-1">إيداع للمحفظة</h2><p className="font-body-sm text-outline-variant">أضف رصيداً من طريقة دفع محفوظة</p></div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition border border-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div><label className="block text-outline-variant font-label-sm mb-2">المبلغ (ر.س) *</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className={IC} placeholder="1000" dir="ltr" /></div>
          <div><label className="block text-outline-variant font-label-sm mb-2">طريقة الدفع *</label>
            <select value={method} onChange={e => setMethod(e.target.value)} className={IC}>
              <option value="" className="bg-[#1e1e1e]">اختر طريقة الدفع...</option>
              {paymentMethods.map(pm => <option key={pm.id} value={String(pm.id)} className="bg-[#1e1e1e]">{pm.label} — {pm.subLabel}</option>)}
            </select>
          </div>
          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-label-md hover:bg-white/10 transition">إلغاء</button>
            <button onClick={handleSubmit} disabled={saving} className="flex-1 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">add_circle</span>}
              إيداع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
