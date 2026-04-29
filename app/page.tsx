'use client';
import AppShell from '@/components/AppShell';
import { useModal } from '@/components/ModalContext';
import { useApp } from '@/components/AppContext';

export default function HomePage() {
  return (
    <AppShell>
      <HomeContent />
    </AppShell>
  );
}

function HomeContent() {
  const { openModal } = useModal();
  const { showToast, employees } = useApp();
  const empCalc = employees.map((e, i) => {
    const ded = Math.round(e.salary * 0.09);
    const housing = Math.round(e.salary * 0.25);
    const transport = Math.round(e.salary * 0.05);
    const bonus = i % 3 === 0 ? 2000 : 0;
    const otHours = 10 + (i * 7) % 30;
    return { net: e.salary - ded, ded, allow: housing + transport + bonus, ot: otHours * 75 };
  });
  const totalNet = empCalc.reduce((s, e) => s + e.net, 0);
  const totalDed = empCalc.reduce((s, e) => s + e.ded, 0);
  const totalAllow = empCalc.reduce((s, e) => s + e.allow, 0);
  const totalOT = empCalc.reduce((s, e) => s + e.ot, 0);
  const activeCount = employees.filter(e => !e.isFrozen).length;
  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-secondary-container/5 blur-3xl rounded-full z-[-1]"></div>
        <div onClick={() => openModal('savings')} className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">إجمالي المدخرات</span><span className="material-symbols-outlined text-secondary-container opacity-70 group-hover:opacity-100 transition-opacity">account_balance_wallet</span></div>
          <div><div className="font-h3 text-white">45,200 <span className="font-body-sm text-outline-variant">ر.س</span></div><div className="font-label-sm text-secondary-container mt-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> +2.4%</div></div>
        </div>
        <div onClick={() => openModal('exchange')} className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">أسعار الصرف (SAR/USD)</span><span className="material-symbols-outlined text-tertiary-fixed-dim opacity-70 group-hover:opacity-100 transition-opacity">currency_exchange</span></div>
          <div><div className="font-h3 text-white">3.75<span className="font-body-sm text-outline-variant">8</span></div><div className="font-label-sm text-outline-variant mt-xs flex items-center gap-1">مستقر</div></div>
        </div>
        <div onClick={() => openModal('tasks')} className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">المهام المعلقة</span><span className="material-symbols-outlined text-error-container opacity-70 group-hover:opacity-100 transition-opacity">pending_actions</span></div>
          <div><div className="font-h3 text-white">12 <span className="font-body-sm text-outline-variant">مهمة</span></div><div className="font-label-sm text-error-container mt-xs flex items-center gap-1">3 عاجلة</div></div>
        </div>
      </div>
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-container/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-xl relative z-10">
          <div><h1 className="font-h2 text-white mb-xs glow-text">نظرة عامة على الرواتب</h1><p className="font-body-sm text-outline-variant">دورة الدفع الحالية: أكتوبر 2023</p></div>
          <button onClick={() => showToast('تم تصدير التقرير بنجاح')} className="glass-panel px-md py-sm rounded-lg font-label-md text-white hover:bg-white/10 transition flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">download</span>تصدير التقرير</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg relative z-10">
          <div onClick={() => openModal('net_salary')} className="glass-panel rounded-xl p-md flex flex-col gap-3 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container border border-secondary-container/30"><span className="material-symbols-outlined text-[20px]">payments</span></div><span className="material-symbols-outlined text-outline-variant text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span></div>
            <div><h3 className="font-label-sm text-outline-variant mb-1">صافي الرواتب</h3><div className="font-h3 text-white flex gap-1 items-baseline">{totalNet.toLocaleString()} <span className="font-label-sm text-outline-variant">ر.س</span></div></div>
          </div>
          <div onClick={() => openModal('bonuses')} className="glass-panel rounded-xl p-md flex flex-col gap-3 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim border border-primary-fixed-dim/30"><span className="material-symbols-outlined text-[20px]">redeem</span></div><span className="material-symbols-outlined text-outline-variant text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span></div>
            <div><h3 className="font-label-sm text-outline-variant mb-1">البدلات والمكافآت</h3><div className="font-h3 text-white flex gap-1 items-baseline">{totalAllow.toLocaleString()} <span className="font-label-sm text-outline-variant">ر.س</span></div></div>
          </div>
          <div onClick={() => openModal('deductions')} className="glass-panel rounded-xl p-md flex flex-col gap-3 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center text-error-container border border-error-container/30"><span className="material-symbols-outlined text-[20px]">receipt_long</span></div><span className="material-symbols-outlined text-outline-variant text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span></div>
            <div><h3 className="font-label-sm text-outline-variant mb-1">الاستقطاعات</h3><div className="font-h3 text-white flex gap-1 items-baseline">{totalDed.toLocaleString()} <span className="font-label-sm text-outline-variant">ر.س</span></div></div>
          </div>
          <div onClick={() => openModal('overtime')} className="glass-panel rounded-xl p-md flex flex-col gap-3 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-center"><div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary-fixed-dim border border-tertiary-fixed-dim/30"><span className="material-symbols-outlined text-[20px]">more_time</span></div><span className="material-symbols-outlined text-outline-variant text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span></div>
            <div><h3 className="font-label-sm text-outline-variant mb-1">العمل الإضافي</h3><div className="font-h3 text-white flex gap-1 items-baseline">{totalOT.toLocaleString()} <span className="font-label-sm text-outline-variant">ر.س</span></div></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-lg grow relative z-10">
          <div onClick={() => openModal('total_salaries')} className="col-span-2 glass-panel rounded-xl p-md flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-colors group">
            <div className="flex justify-between items-center mb-md"><h2 className="font-body-md text-white">إجمالي الرواتب</h2><div className="flex gap-2"><span className="px-2 py-1 rounded bg-white/10 font-label-sm text-white cursor-pointer">أسبوع</span><span className="px-2 py-1 rounded bg-secondary-container/20 text-secondary-container font-label-sm cursor-pointer border border-secondary-container/30">شهر</span></div></div>
            <div className="grow flex items-end gap-2 pb-8 relative">
              <div className="absolute right-0 top-0 bottom-10 w-10 flex flex-col justify-between text-outline-variant font-data-tabular text-[10px]"><span>2M</span><span>1M</span><span>0</span></div>
              <div className="w-full flex items-end gap-3 pl-12 h-full">
                <div className="flex-1 bg-white/10 rounded-t-sm h-[25%] hover:bg-white/20 transition-all cursor-pointer relative group/bar"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white font-label-sm px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition pointer-events-none whitespace-nowrap">1.0M</div></div>
                <div className="flex-1 bg-white/10 rounded-t-sm h-[30%] hover:bg-white/20 transition-all cursor-pointer relative group/bar"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white font-label-sm px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition pointer-events-none whitespace-nowrap">1.2M</div></div>
                <div className="flex-1 bg-white/10 rounded-t-sm h-[45%] hover:bg-white/20 transition-all cursor-pointer relative group/bar"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white font-label-sm px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition pointer-events-none whitespace-nowrap">1.4M</div></div>
                <div className="flex-1 bg-white/10 rounded-t-sm h-[60%] hover:bg-white/20 transition-all cursor-pointer relative group/bar"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white font-label-sm px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition pointer-events-none whitespace-nowrap">1.6M</div></div>
                <div className="flex-1 bg-secondary-container/60 rounded-t-sm h-[85%] hover:bg-secondary-container/80 transition-all cursor-pointer relative group/bar shadow-[0_0_15px_rgba(108,248,187,0.3)]"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-secondary-container font-label-sm px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition pointer-events-none border border-secondary-container/30 whitespace-nowrap">1.9M</div></div>
                <div className="flex-1 bg-white/10 rounded-t-sm h-[50%] hover:bg-white/20 transition-all cursor-pointer relative group/bar"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white font-label-sm px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition pointer-events-none whitespace-nowrap">1.5M</div></div>
              </div>
              <div className="absolute bottom-0 right-12 w-[calc(100%-3rem)] flex justify-between text-outline-variant font-data-tabular text-[9px]"><span>مايو</span><span>يونيو</span><span>يوليو</span><span>أغسطس</span><span className="text-secondary-container font-bold">سبتمبر</span><span>أكتوبر</span></div>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-md">
            <div onClick={() => openModal('active_employees')} className="glass-panel rounded-xl p-md grow flex flex-col justify-center items-center text-center cursor-pointer hover:bg-white/5 transition-colors group">
              <div className="w-24 h-24 rounded-full border-4 border-secondary-container/30 border-t-secondary-container flex items-center justify-center mb-sm relative"><span className="font-h2 text-white glow-text">{activeCount}</span><div className="absolute inset-0 rounded-full border border-secondary-container/50 animate-ping opacity-20"></div></div>
              <h3 className="font-body-md text-white">موظف نشط</h3><p className="font-label-sm text-outline-variant mt-xs">+5 هذا الشهر</p>
            </div>
            <div onClick={() => openModal('departments')} className="glass-panel rounded-xl p-md cursor-pointer hover:bg-white/5 transition-colors group">
              <h3 className="font-label-md text-outline-variant mb-sm flex justify-between items-center">توزيع الأقسام<span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span></h3>
              <div className="space-y-3">
                <div><div className="flex justify-between font-label-sm text-white mb-1"><span>التطوير</span><span>45%</span></div><div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-secondary-container w-[45%] rounded-full shadow-[0_0_10px_rgba(108,248,187,0.5)]"></div></div></div>
                <div><div className="flex justify-between font-label-sm text-white mb-1"><span>المبيعات</span><span>30%</span></div><div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-primary-fixed-dim w-[30%] rounded-full"></div></div></div>
                <div><div className="flex justify-between font-label-sm text-white mb-1"><span>الإدارة</span><span>25%</span></div><div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-outline-variant w-[25%] rounded-full"></div></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
