'use client';

export default function SettingsPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        {/* 2FA Status */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">حالة الأمان (2FA)</span>
            <span className="material-symbols-outlined text-secondary-container">shield_locked</span>
          </div>
          <div>
            <div className="font-h3 text-white">مُفعل</div>
            <div className="font-label-sm text-secondary-container mt-xs flex items-center gap-1">
              مستوى أمان عالي
            </div>
          </div>
          <button className="w-full mt-4 py-2 rounded-lg border border-white/20 text-white font-label-sm hover:bg-white/10 transition">
             إدارة المفاتيح
          </button>
        </div>

        {/* Verification Status */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 shadow-[0_0_20px_rgba(108,248,187,0.05)] border-secondary-container/20">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">حالة توثيق الحساب</span>
            <span className="material-symbols-outlined text-secondary-container">verified_user</span>
          </div>
           <div>
            <div className="font-h3 text-white">مُوثق</div>
            <div className="font-label-sm text-outline-variant mt-xs">تم تأكيد السجل التجاري</div>
          </div>
        </div>
      </div>

      {/* Center Stage */}
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
         {/* Ambient glow */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

         <div className="flex justify-between items-center mb-xl relative z-10">
            <div>
              <h1 className="font-h2 text-white mb-xs glow-text">الإعدادات</h1>
              <p className="font-body-sm text-outline-variant">ضبط بيانات الشركة وإعدادات الربط التقني</p>
            </div>
            <button className="glass-panel px-md py-sm rounded-lg font-label-md text-white bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span>
              حفظ التغييرات
            </button>
         </div>

         {/* Forms Container */}
         <div className="grow flex flex-col gap-8 relative z-10 overflow-y-auto pr-2 scrollbar-hide">
            
            {/* Company Info */}
            <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
              <h2 className="font-label-md text-white mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">business</span>
                 بيانات الشركة
              </h2>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="block text-outline-variant font-label-sm mb-2">اسم الشركة</label>
                    <input type="text" defaultValue="شركة التقنية الحديثة ش.م.م" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
                 </div>
                 <div>
                    <label className="block text-outline-variant font-label-sm mb-2">الرقم الضريبي</label>
                    <input type="text" defaultValue="310000000000003" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none focus:border-secondary-container transition" />
                 </div>
                 <div className="col-span-2">
                    <label className="block text-outline-variant font-label-sm mb-2">عنوان المقر الرئيسي</label>
                    <input type="text" defaultValue="طريق الملك فهد، العليا، الرياض، المملكة العربية السعودية" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
                 </div>
              </div>
            </div>

            {/* CR Upload */}
            <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
              <h2 className="font-label-md text-white mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">description</span>
                 السجل التجاري
              </h2>
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[32px] text-white/50">picture_as_pdf</span>
                 </div>
                 <div className="grow">
                    <h3 className="text-white font-body-sm mb-1">Commercial_Register_2023.pdf</h3>
                    <p className="text-outline-variant text-xs">تم التحديث في 1 يناير 2023 - صالح حتى 31 ديسمبر 2024</p>
                 </div>
                 <button className="px-4 py-2 rounded-lg border border-white/20 text-white font-label-sm hover:bg-white/10 transition">
                    تحديث الملف
                 </button>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
              <h2 className="font-label-md text-white mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">key</span>
                 مفاتيح الربط (API Keys)
              </h2>
              <div className="space-y-4">
                 <div className="flex items-end gap-4">
                    <div className="grow">
                      <label className="block text-outline-variant font-label-sm mb-2">مفتاح بيئة الإنتاج (Production Key)</label>
                      <input type="password" defaultValue="sk_live_1234567890abcdef" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none" />
                    </div>
                    <button className="h-[46px] px-4 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                 </div>
                 <div className="flex items-end gap-4">
                    <div className="grow">
                      <label className="block text-outline-variant font-label-sm mb-2">مفتاح بيئة التطوير (Test Key)</label>
                      <input type="text" defaultValue="sk_test_0987654321fedcba" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none" />
                    </div>
                    <button className="h-[46px] px-4 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition flex items-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                 </div>
              </div>
            </div>

         </div>
      </div>
    </div>
  );
}
