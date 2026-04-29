'use client';

import { useState } from 'react';
import { useModal } from './ModalContext';
import { useApp } from './AppContext';

// ─── Modal Metadata ─────────────────────────────────────────────────────────────
type ModalMeta = { title: string; icon: string; color: string; description: string };
const META: Record<string, ModalMeta> = {
  savings: { title: 'تفاصيل إجمالي المدخرات', icon: 'account_balance_wallet', color: 'text-secondary-container bg-secondary-container/20 border-secondary-container/30', description: 'نظرة شاملة على المدخرات.' },
  exchange: { title: 'أسعار الصرف', icon: 'currency_exchange', color: 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30', description: 'أسعار صرف العملات مقابل الريال السعودي.' },
  tasks: { title: 'المهام المعلقة', icon: 'pending_actions', color: 'text-error-container bg-error-container/20 border-error-container/30', description: 'المهام التي تتطلب إجراءً فورياً.' },
  net_salary: { title: 'صافي الرواتب', icon: 'payments', color: 'text-secondary-container bg-secondary-container/20 border-secondary-container/30', description: 'صافي الرواتب بعد الاستقطاعات لكل موظف.' },
  bonuses: { title: 'البدلات والمكافآت', icon: 'redeem', color: 'text-primary-fixed-dim bg-primary-fixed-dim/20 border-primary-fixed-dim/30', description: 'تفصيل البدلات والمكافآت لكل موظف.' },
  deductions: { title: 'الاستقطاعات', icon: 'receipt_long', color: 'text-error-container bg-error-container/20 border-error-container/30', description: 'تفاصيل الاستقطاعات حسب النوع والموظف.' },
  overtime: { title: 'العمل الإضافي', icon: 'more_time', color: 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30', description: 'ساعات ومبالغ العمل الإضافي لكل موظف.' },
  total_salaries: { title: 'صرف الرواتب الشهري', icon: 'bar_chart', color: 'text-primary-fixed bg-primary-fixed/20 border-primary-fixed/30', description: 'إجمالي صرف الرواتب خلال آخر 6 أشهر.' },
  active_employees: { title: 'الموظفين النشطين', icon: 'groups', color: 'text-secondary-container bg-secondary-container/20 border-secondary-container/30', description: 'توزيع الموظفين حسب القسم والحالة.' },
  departments: { title: 'توزيع الأقسام', icon: 'pie_chart', color: 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30', description: 'توزيع ميزانية الرواتب على الأقسام.' },
};

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const EXCHANGE_RATES = [
  { country: 'الولايات المتحدة', currency: 'الدولار الأمريكي', code: 'USD', rate: 3.758 },
  { country: 'الأردن', currency: 'الدينار الأردني', code: 'JOD', rate: 5.304 },
  { country: 'مصر', currency: 'الجنيه المصري', code: 'EGP', rate: 0.077 },
  { country: 'الإمارات', currency: 'الدرهم الإماراتي', code: 'AED', rate: 1.023 },
  { country: 'أوروبا', currency: 'اليورو', code: 'EUR', rate: 4.021 },
  { country: 'بريطانيا', currency: 'الجنيه الإسترليني', code: 'GBP', rate: 4.692 },
];
const MONTHLY_PAYROLL = [
  { month: 'مايو', total: 1680000, count: 138, status: 'مكتمل' },
  { month: 'يونيو', total: 1720000, count: 139, status: 'مكتمل' },
  { month: 'يوليو', total: 1750000, count: 140, status: 'مكتمل' },
  { month: 'أغسطس', total: 1810000, count: 141, status: 'مكتمل' },
  { month: 'سبتمبر', total: 1940200, count: 142, status: 'مكتمل' },
  { month: 'أكتوبر', total: 1980000, count: 142, status: 'قيد التنفيذ' },
];
const DEDUCTION_CATS = ['تأمينات (GOSI)', 'ضريبة دخل', 'تأمين طبي', 'خصم سلف'] as const;
const BAR_COLORS = ['bg-secondary-container/60', 'bg-primary-fixed-dim/60', 'bg-tertiary-fixed-dim/60', 'bg-error-container/60'];
const DONUT_COLORS = ['text-secondary-container', 'text-primary-fixed-dim', 'text-tertiary-fixed-dim', 'text-error-container'];

// ─── SVG Charts ─────────────────────────────────────────────────────────────────
const INLINE_BAR_COLORS = ['#6cf8bb', '#b8c5f6', '#d0bcff', '#ffb4ab', '#6cf8bb', '#b8c5f6'];

function BarChart({ items }: { items: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(...items.map(i => i.value), 1);
  const barH = 140; // max bar height in px
  return (
    <div className="flex items-end gap-2 w-full px-2" style={{ height: barH + 40 }}>
      {items.map((item, i) => {
        const h = Math.max(Math.round((item.value / max) * barH), 4);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer min-w-0">
            <span className="text-[10px] text-outline-variant opacity-0 group-hover:opacity-100 transition font-data-tabular whitespace-nowrap">
              {item.value.toLocaleString()}
            </span>
            <div className="w-full rounded-t-sm hover:opacity-90 transition-all" style={{ height: h, backgroundColor: INLINE_BAR_COLORS[i % INLINE_BAR_COLORS.length], opacity: 0.75 }} />
            <span className="text-[9px] text-outline-variant text-center leading-tight mt-1 truncate w-full">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ items }: { items: { label: string; value: number; color?: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const r = 50, cx = 60, cy = 60, sw = 14;
  const circ = 2 * Math.PI * r;
  const strokeColors = ['#6cf8bb', '#b8c5f6', '#d0bcff', '#ffb4ab'];
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
        {items.map((item, i) => {
          const pct = item.value / total;
          const dashLen = pct * circ;
          const dashOff = -offset * circ;
          offset += pct;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={strokeColors[i % strokeColors.length]} strokeWidth={sw}
            strokeDasharray={`${dashLen} ${circ - dashLen}`} strokeDashoffset={dashOff}
            strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s' }} />;
        })}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="fill-white text-[14px] font-bold">{total.toLocaleString()}</text>
      </svg>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: strokeColors[i % strokeColors.length] }} />
            <span className="text-outline-variant">{item.label}</span>
            <span className="text-white font-data-tabular mr-auto">{Math.round(item.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AddPaymentMethod ───────────────────────────────────────────────────────────
function AddPaymentMethodModal() {
  const { closeModal } = useModal();
  const { addPaymentMethod, showToast } = useApp();
  const [step, setStep] = useState<'choose' | 'bank' | 'wallet'>('choose');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [holderName, setHolderName] = useState('');
  const [walletType, setWalletType] = useState('STC Pay');
  const [phone, setPhone] = useState('');

  const handleBankSubmit = () => {
    if (!bankName || !iban) { showToast('يرجى ملء جميع الحقول', 'error'); return; }
    addPaymentMethod({ type: 'bank', label: bankName, subLabel: `**** ${iban.slice(-4)}`, icon: 'account_balance', iconColor: 'bg-secondary-container/20 text-secondary-container' });
    showToast('تمت إضافة طريقة الدفع بنجاح');
    closeModal();
  };

  const handleWalletSubmit = () => {
    if (!phone) { showToast('يرجى إدخال رقم الجوال', 'error'); return; }
    addPaymentMethod({ type: 'wallet', label: walletType, subLabel: `**** ${phone.slice(-4)}`, icon: 'phone_iphone', iconColor: 'bg-primary-fixed-dim/20 text-primary-fixed-dim' });
    showToast('تمت إضافة طريقة الدفع بنجاح');
    closeModal();
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={closeModal}>
      <div className="glass-panel w-full max-w-[500px] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative animate-in zoom-in-95 duration-200 overflow-hidden" dir="rtl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div>
            <h2 className="font-h2 text-white mb-1">{step === 'choose' ? 'إضافة طريقة دفع' : step === 'bank' ? 'حساب بنكي جديد' : 'محفظة رقمية جديدة'}</h2>
            <p className="font-body-sm text-outline-variant">{step === 'choose' ? 'اختر نوع طريقة الدفع.' : 'أدخل بيانات الحساب.'}</p>
          </div>
          <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition-colors border border-white/10"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {step === 'choose' && (<>
            <button onClick={() => setStep('bank')} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors text-right group">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center"><span className="material-symbols-outlined">account_balance</span></div>
              <div className="flex-1"><div className="font-label-md text-white mb-1">حساب بنكي (IBAN)</div><div className="font-body-sm text-outline-variant text-xs">تحويل بنكي مباشر (1-2 أيام عمل)</div></div>
              <span className="material-symbols-outlined text-outline-variant rtl:-scale-x-100">arrow_forward_ios</span>
            </button>
            <button onClick={() => setStep('wallet')} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors text-right group">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/20 text-primary-fixed flex items-center justify-center"><span className="material-symbols-outlined">phone_iphone</span></div>
              <div className="flex-1"><div className="font-label-md text-white mb-1">محفظة رقمية (STC Pay)</div><div className="font-body-sm text-outline-variant text-xs">تحويل فوري برقم الجوال</div></div>
              <span className="material-symbols-outlined text-outline-variant rtl:-scale-x-100">arrow_forward_ios</span>
            </button>
          </>)}
          {step === 'bank' && (<>
            <div><label className="block text-outline-variant font-label-sm mb-2">اسم البنك</label><input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="مثال: بنك الراجحي" className={inputClass} /></div>
            <div><label className="block text-outline-variant font-label-sm mb-2">رقم IBAN</label><input value={iban} onChange={e => setIban(e.target.value)} placeholder="SA..." dir="ltr" className={inputClass} /></div>
            <div><label className="block text-outline-variant font-label-sm mb-2">اسم صاحب الحساب</label><input value={holderName} onChange={e => setHolderName(e.target.value)} placeholder="الاسم الكامل" className={inputClass} /></div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep('choose')} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-label-md hover:bg-white/10 transition border border-white/10">رجوع</button>
              <button onClick={handleBankSubmit} className="flex-1 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition">إضافة الحساب</button>
            </div>
          </>)}
          {step === 'wallet' && (<>
            <div><label className="block text-outline-variant font-label-sm mb-2">نوع المحفظة</label>
              <select value={walletType} onChange={e => setWalletType(e.target.value)} className={inputClass}>
                <option value="STC Pay" className="bg-[#1e1e1e]">STC Pay</option>
                <option value="Apple Pay" className="bg-[#1e1e1e]">Apple Pay</option>
                <option value="Mada Pay" className="bg-[#1e1e1e]">Mada Pay</option>
                <option value="Urpay" className="bg-[#1e1e1e]">Urpay</option>
              </select>
            </div>
            <div><label className="block text-outline-variant font-label-sm mb-2">رقم الجوال</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+966 5x xxx xxxx" dir="ltr" className={inputClass} /></div>
            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep('choose')} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-label-md hover:bg-white/10 transition border border-white/10">رجوع</button>
              <button onClick={handleWalletSubmit} className="flex-1 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition">إضافة المحفظة</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ─── Per-modal chart + table ────────────────────────────────────────────────────
function DataModal({ modalKey }: { modalKey: string }) {
  const { closeModal } = useModal();
  const { employees, showToast } = useApp();
  const meta = META[modalKey];
  if (!meta) return null;
  const { title, icon, color } = meta;

  // Derived data per employee (same formula as page.tsx)
  const empData = employees.map((e, i) => {
    const ded = Math.round(e.salary * 0.09);
    const housing = Math.round(e.salary * 0.25);
    const transport = Math.round(e.salary * 0.05);
    const bonus = i % 3 === 0 ? 2000 : 0;
    const otHours = 10 + (i * 7) % 30;
    const otAmount = otHours * 75;
    return { ...e, deduction: ded, net: e.salary - ded, housing, transport, bonus, allowTotal: housing + transport + bonus, otHours, otAmount };
  });

  const deptMap: Record<string, number> = {};
  employees.forEach(e => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });

  // Computed totals
  const totalNet = empData.reduce((s, e) => s + e.net, 0);
  const totalDed = empData.reduce((s, e) => s + e.deduction, 0);
  const totalAllow = empData.reduce((s, e) => s + e.allowTotal, 0);
  const totalOT = empData.reduce((s, e) => s + e.otAmount, 0);
  const activeCount = employees.filter(e => !e.isFrozen).length;

  // Dynamic description with total
  const description = (() => {
    if (modalKey === 'net_salary') return `إجمالي صافي الرواتب: ${totalNet.toLocaleString()} ريال سعودي`;
    if (modalKey === 'deductions') return `إجمالي الاستقطاعات: ${totalDed.toLocaleString()} ريال سعودي`;
    if (modalKey === 'bonuses') return `إجمالي البدلات والمكافآت: ${totalAllow.toLocaleString()} ريال سعودي`;
    if (modalKey === 'overtime') return `إجمالي العمل الإضافي: ${totalOT.toLocaleString()} ريال سعودي`;
    if (modalKey === 'active_employees') return `عدد الموظفين النشطين: ${activeCount} موظف من أصل ${employees.length}`;
    if (modalKey === 'total_salaries') return `إجمالي صرف الرواتب لهذا الشهر: ${totalNet.toLocaleString()} ريال سعودي`;
    if (modalKey === 'departments') return `إجمالي ميزانية الرواتب: ${employees.reduce((s, e) => s + e.salary, 0).toLocaleString()} ريال سعودي`;
    return meta.description;
  })();

  // Update total_salaries latest month to use real data
  const payrollData = MONTHLY_PAYROLL.map((m, i) => i === MONTHLY_PAYROLL.length - 1 ? { ...m, total: totalNet, count: employees.length } : m);

  // Chart
  const chart = (() => {
    if (modalKey === 'net_salary') return <BarChart items={empData.map(e => ({ label: e.name.split(' ')[0], value: e.net }))} />;
    if (modalKey === 'deductions') return <DonutChart items={DEDUCTION_CATS.map((c, i) => ({ label: c, value: [48, 22, 18, 12][i] }))} />;
    if (modalKey === 'bonuses') return <BarChart items={empData.map(e => ({ label: e.name.split(' ')[0], value: e.allowTotal }))} />;
    if (modalKey === 'overtime') return <BarChart items={empData.map(e => ({ label: e.name.split(' ')[0], value: e.otAmount }))} />;
    if (modalKey === 'active_employees') return <BarChart items={Object.entries(deptMap).map(([d, c]) => ({ label: d, value: c }))} />;
    if (modalKey === 'total_salaries') return <BarChart items={payrollData.map(m => ({ label: m.month, value: m.total }))} />;
    if (modalKey === 'departments') return <DonutChart items={Object.entries(deptMap).map(([d, c]) => ({ label: d, value: c }))} />;
    return null;
  })();

  // Table
  const table = (() => {
    if (modalKey === 'net_salary') return { heads: ['الموظف', 'الراتب الأساسي', 'الاستقطاعات', 'صافي الراتب'], rows: empData.map(e => [e.name, sal(e.salary), sal(e.deduction), sal(e.net)]) };
    if (modalKey === 'deductions') return { heads: ['الموظف', 'نوع الاستقطاع', 'المبلغ'], rows: empData.map(e => [e.name, 'تأمينات (GOSI)', sal(e.deduction)]) };
    if (modalKey === 'bonuses') return { heads: ['الموظف', 'بدل السكن', 'بدل النقل', 'المكافآت', 'الإجمالي'], rows: empData.map(e => [e.name, sal(e.housing), sal(e.transport), sal(e.bonus), sal(e.allowTotal)]) };
    if (modalKey === 'overtime') return { heads: ['الموظف', 'ساعات العمل الإضافي', 'المبلغ'], rows: empData.map(e => [e.name, `${e.otHours} ساعة`, sal(e.otAmount)]) };
    if (modalKey === 'active_employees') return { heads: ['الموظف', 'القسم', 'المسمى الوظيفي', 'الحالة'], rows: employees.map(e => [e.name, e.department, e.position, e.status]) };
    if (modalKey === 'total_salaries') return { heads: ['الشهر', 'إجمالي الرواتب', 'عدد الموظفين', 'الحالة'], rows: payrollData.map(m => [m.month, sal(m.total), `${m.count}`, m.status]) };
    if (modalKey === 'exchange') return { heads: ['الدولة', 'العملة', 'الرمز', 'سعر الصرف (SAR)'], rows: EXCHANGE_RATES.map(r => [r.country, r.currency, r.code, r.rate.toFixed(3)]) };
    if (modalKey === 'departments') return { heads: ['القسم', 'عدد الموظفين', 'إجمالي الرواتب', 'النسبة'], rows: Object.entries(deptMap).map(([d, c]) => { const t = employees.filter(e => e.department === d).reduce((s, e) => s + e.salary, 0); return [d, `${c}`, sal(t), `${Math.round(c / employees.length * 100)}%`]; }) };
    if (modalKey === 'savings') return { heads: ['البند', 'المبلغ'], rows: [['مدخرات الموظفين', '35,200 ر.س'], ['المديونيات المحصلة', '10,000 ر.س'], ['النمو', '+2.4%']] };
    if (modalKey === 'tasks') return { heads: ['المهمة', 'العدد', 'الأولوية'], rows: [['مراجعة بيانات البصمة', '3', 'عاجلة'], ['إضافة حسابات بنكية', '4', 'متوسطة'], ['اعتماد سلف', '5', 'متوسطة']] };
    return null;
  })();

  function sal(n: number) { return n.toLocaleString() + ' ر.س'; }

  // CSV Export
  function exportCSV() {
    if (!table) return;
    const bom = '\uFEFF';
    const header = table.heads.join(',');
    const body = table.rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const csv = bom + header + '\n' + body;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير التقرير بنجاح');
  }

  const hasChart = chart !== null;
  const rowCount = table?.rows.length ?? 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xl p-6" onClick={closeModal}>
      <div className="glass-panel w-full max-w-[1200px] max-h-[90vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden" dir="rtl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${color}`}><span className="material-symbols-outlined text-[28px]">{icon}</span></div>
            <div><h2 className="font-h2 text-white mb-1">{title}</h2><p className="font-body-sm text-secondary-container">{description}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="px-4 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">download</span>تصدير التقرير</button>
            <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-error/20 hover:text-error text-outline-variant transition border border-white/10"><span className="material-symbols-outlined">close</span></button>
          </div>
        </div>
        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {hasChart && (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 shrink-0">
              <div className="w-full h-[180px]">{chart}</div>
            </div>
          )}
          {table && (
            <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col flex-grow overflow-hidden w-full">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-label-md text-white">التفاصيل</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-data-tabular text-xs">{rowCount} سجل</span>
              </div>
              {rowCount < 1 ? (
                <div className="p-8 text-center text-outline-variant">لا توجد بيانات كافية</div>
              ) : (
                <div className="overflow-y-auto max-h-[320px] scrollbar-hide">
                  <table className="w-full table-fixed">
                    <thead className="sticky top-0 bg-white/[0.03]"><tr className="border-b border-white/10">{table.heads.map((h, i) => <th key={i} className="p-3 text-right font-label-sm text-outline-variant text-[12px]">{h}</th>)}</tr></thead>
                    <tbody>{table.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        {row.map((cell, ci) => <td key={ci} className={`p-3 text-[13px] ${ci === 0 ? 'text-white font-label-sm' : 'text-outline-variant font-data-tabular'}`}>{cell}</td>)}
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────────
export default function ModalSystem() {
  const { activeModal } = useModal();
  if (!activeModal) return null;
  if (activeModal === 'add_payment_method') return <AddPaymentMethodModal />;
  if (META[activeModal]) return <DataModal modalKey={activeModal} />;
  return null;
}
