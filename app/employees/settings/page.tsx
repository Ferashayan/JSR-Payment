'use client';
import { useState } from 'react';
import { useApp } from '@/components/AppContext';

export default function SettingsPage() {
  const { showToast } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); showToast('تم حفظ الإعدادات بنجاح'); }, 800);
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-10 h-5 rounded-full relative transition-colors ${on ? 'bg-secondary-container/40' : 'bg-white/20'}`}>
      <div className={`w-4 h-4 rounded-full absolute top-0.5 transition-all ${on ? 'left-0.5 bg-secondary-container' : 'right-0.5 bg-white/60'}`}></div>
    </button>
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">حالة الأمان (2FA)</span><span className="material-symbols-outlined text-secondary-container">shield_locked</span></div>
          <div><div className="font-h3 text-white">{twoFA ? 'مُفعل' : 'معطل'}</div><div className={`font-label-sm mt-xs flex items-center gap-1 ${twoFA ? 'text-secondary-container' : 'text-error-container'}`}>{twoFA ? 'مستوى أمان عالي' : 'يُنصح بالتفعيل'}</div></div>
          <button onClick={() => { setTwoFA(!twoFA); showToast(twoFA ? 'تم تعطيل المصادقة الثنائية' : 'تم تفعيل المصادقة الثنائية', twoFA ? 'warning' : 'success'); }} className="w-full mt-4 py-2 rounded-lg border border-white/20 text-white font-label-sm hover:bg-white/10 transition">{twoFA ? 'تعطيل' : 'تفعيل'} 2FA</button>
        </div>
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 shadow-[0_0_20px_rgba(108,248,187,0.05)] border-secondary-container/20">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">حالة توثيق الحساب</span><span className="material-symbols-outlined text-secondary-container">verified_user</span></div>
          <div><div className="font-h3 text-white">مُوثق</div><div className="font-label-sm text-outline-variant mt-xs">تم تأكيد السجل التجاري</div></div>
        </div>
      </div>
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-xl relative z-10">
          <div><h1 className="font-h2 text-white mb-xs glow-text">الإعدادات</h1><p className="font-body-sm text-outline-variant">ضبط بيانات الشركة وإعدادات الربط التقني</p></div>
          <button onClick={handleSave} disabled={isSaving} className="glass-panel px-md py-sm rounded-lg font-label-md text-white bg-white/10 hover:bg-white/20 transition flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
            {isSaving ? 'جارِ الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
        <div className="grow flex flex-col gap-8 relative z-10 overflow-y-auto pr-2 scrollbar-hide">
          {/* Company Info */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">business</span>بيانات الشركة</h2>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="block text-outline-variant font-label-sm mb-2">اسم الشركة</label><input type="text" defaultValue="شركة التقنية الحديثة ش.م.م" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" /></div>
              <div><label className="block text-outline-variant font-label-sm mb-2">الرقم الضريبي</label><input type="text" defaultValue="310000000000003" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none focus:border-secondary-container transition" /></div>
              <div className="col-span-2"><label className="block text-outline-variant font-label-sm mb-2">عنوان المقر الرئيسي</label><input type="text" defaultValue="طريق الملك فهد، العليا، الرياض" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" /></div>
            </div>
          </div>
          {/* Notifications */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">notifications</span>إعدادات الإشعارات</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><div><span className="text-white font-body-sm">إشعارات البريد الإلكتروني</span><p className="text-xs text-outline-variant mt-1">استلام تحديثات الرواتب والعمليات عبر البريد</p></div><Toggle on={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} /></div>
              <div className="flex justify-between items-center"><div><span className="text-white font-body-sm">إشعارات SMS</span><p className="text-xs text-outline-variant mt-1">رسائل نصية للعمليات المالية المهمة</p></div><Toggle on={smsNotif} onToggle={() => setSmsNotif(!smsNotif)} /></div>
            </div>
          </div>
          {/* CR Upload */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">description</span>السجل التجاري</h2>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[32px] text-white/50">picture_as_pdf</span></div>
              <div className="grow"><h3 className="text-white font-body-sm mb-1">Commercial_Register_2023.pdf</h3><p className="text-outline-variant text-xs">تم التحديث في 1 يناير 2023</p></div>
              <button onClick={() => showToast('تم رفع الملف بنجاح', 'info')} className="px-4 py-2 rounded-lg border border-white/20 text-white font-label-sm hover:bg-white/10 transition">تحديث الملف</button>
            </div>
          </div>
          {/* API Keys */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">key</span>مفاتيح الربط (API Keys)</h2>
            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="grow"><label className="block text-outline-variant font-label-sm mb-2">مفتاح الإنتاج</label><input type="password" defaultValue="sk_live_1234567890abcdef" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none" /></div>
                <button onClick={() => { navigator.clipboard.writeText('sk_live_1234567890abcdef'); showToast('تم نسخ مفتاح الإنتاج'); }} className="h-[46px] px-4 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">content_copy</span></button>
              </div>
              <div className="flex items-end gap-4">
                <div className="grow"><label className="block text-outline-variant font-label-sm mb-2">مفتاح التطوير</label><input type="text" defaultValue="sk_test_0987654321fedcba" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none" /></div>
                <button onClick={() => { navigator.clipboard.writeText('sk_test_0987654321fedcba'); showToast('تم نسخ مفتاح التطوير'); }} className="h-[46px] px-4 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">content_copy</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
