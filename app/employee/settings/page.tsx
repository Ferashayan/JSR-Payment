'use client';

export default function EmployeeSettingsPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-primary-fixed/5 blur-3xl rounded-full z-[-1]"></div>

        {/* Profile Preview */}
        <div className="glass-panel rounded-xl p-md flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full border-2 border-primary-fixed/30 bg-primary-fixed/10 flex items-center justify-center text-primary-fixed text-2xl font-bold mb-3 shadow-[0_0_15px_rgba(218,226,253,0.1)]">
            أ.س
          </div>
          <h2 className="font-h3 text-white mb-1">أحمد سالم</h2>
          <p className="font-body-sm text-outline-variant">مطور واجهات أمامية</p>
          <div className="mt-3 px-3 py-1 bg-secondary-container/10 border border-secondary-container/20 rounded-full text-xs text-secondary-container flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            الحساب موثق
          </div>
        </div>

        {/* Security Status */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">حالة الأمان</span>
            <span className="material-symbols-outlined text-secondary-container">shield_locked</span>
          </div>
          <div>
            <div className="font-h3 text-white">مُفعل</div>
            <div className="font-label-sm text-secondary-container mt-xs flex items-center gap-1">
              المصادقة الثنائية (2FA) نشطة
            </div>
          </div>
        </div>

        {/* Notification Prefs */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">تفضيلات الإشعارات</span>
            <span className="material-symbols-outlined text-primary-fixed-dim">notifications_active</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white">إشعارات الراتب</span>
              <div className="w-8 h-4 bg-secondary-container/40 rounded-full relative"><div className="w-3 h-3 bg-secondary-container rounded-full absolute left-0.5 top-0.5"></div></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white">إشعارات التحويلات</span>
              <div className="w-8 h-4 bg-secondary-container/40 rounded-full relative"><div className="w-3 h-3 bg-secondary-container rounded-full absolute left-0.5 top-0.5"></div></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white">إشعارات الطلبات</span>
              <div className="w-8 h-4 bg-white/20 rounded-full relative"><div className="w-3 h-3 bg-white/60 rounded-full absolute right-0.5 top-0.5"></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Stage */}
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-xl relative z-10">
          <div>
            <h1 className="font-h2 text-white mb-xs glow-text">إعداداتي الشخصية</h1>
            <p className="font-body-sm text-outline-variant">إدارة بياناتك الشخصية وإعدادات الحساب</p>
          </div>
          <button className="glass-panel px-md py-sm rounded-lg font-label-md text-white bg-white/10 hover:bg-white/20 transition flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            حفظ التغييرات
          </button>
        </div>

        {/* Forms Container */}
        <div className="grow flex flex-col gap-8 relative z-10 overflow-y-auto pr-2 scrollbar-hide">

          {/* Personal Info */}
          <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">person</span>
              البيانات الشخصية
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">الاسم الكامل</label>
                <input type="text" defaultValue="أحمد سالم العتيبي" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
              </div>
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">البريد الإلكتروني</label>
                <input type="email" defaultValue="ahmed.salem@company.sa" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
              </div>
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">رقم الجوال</label>
                <input type="tel" defaultValue="+966 50 123 4567" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none focus:border-secondary-container transition" dir="ltr" />
              </div>
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">رقم الهوية الوطنية</label>
                <input type="text" defaultValue="1098765432" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 font-data-tabular outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Bank Account */}
          <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">account_balance</span>
              الحساب البنكي الأساسي
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">اسم البنك</label>
                <input type="text" defaultValue="بنك الراجحي" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
              </div>
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">رقم IBAN</label>
                <input type="text" defaultValue="SA 89 8000 0000 6080 1016 4567" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none focus:border-secondary-container transition" dir="ltr" />
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">lock</span>
              تغيير كلمة المرور
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">كلمة المرور الحالية</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
              </div>
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">كلمة المرور الجديدة</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
              </div>
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">تأكيد كلمة المرور</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" />
              </div>
            </div>
          </div>

          {/* Language & Appearance */}
          <div className="bg-white/2 border border-white/10 rounded-2xl p-6">
            <h2 className="font-label-md text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">palette</span>
              اللغة والمظهر
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">اللغة</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-white/30">
                  <option value="ar" className="bg-[#1e1e1e]">العربية</option>
                  <option value="en" className="bg-[#1e1e1e]">English</option>
                </select>
              </div>
              <div>
                <label className="block text-outline-variant font-label-sm mb-2">المظهر</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-white/30">
                  <option value="dark" className="bg-[#1e1e1e]">الوضع الداكن</option>
                  <option value="light" className="bg-[#1e1e1e]">الوضع الفاتح</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
