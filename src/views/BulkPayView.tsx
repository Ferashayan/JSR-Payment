import { useState } from 'react';

export default function BulkPayView({ setActiveModal }: { setActiveModal: (v: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  
  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-secondary-container/5 blur-3xl rounded-full z-[-1]"></div>
        
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">أسعار الصرف (SAR/USD)</span>
            <span className="material-symbols-outlined text-tertiary-fixed-dim opacity-70 group-hover:opacity-100 transition-opacity">currency_exchange</span>
          </div>
          <div>
            <div className="font-h3 text-white">3.75<span className="font-body-sm text-outline-variant">8</span></div>
            <div className="font-label-sm text-outline-variant mt-xs flex items-center gap-1">مستقر</div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-md flex flex-col flex-1 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-body-sm text-white font-medium">حاسبة التوفير السريعة</span>
            <span className="material-symbols-outlined text-secondary-container">calculate</span>
          </div>
          <div className="flex flex-col gap-3 relative z-10">
            <input type="text" placeholder="المبلغ بالدولار" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-data-tabular outline-none focus:border-secondary-container transition" defaultValue="10000" />
            <div className="flex justify-between items-center text-sm">
               <span className="text-outline-variant">المبلغ بالريال</span>
               <span className="text-white font-data-tabular">37,580 ر.س</span>
            </div>
             <div className="flex justify-between items-center text-sm">
               <span className="text-outline-variant">التوفير المتوقع</span>
               <span className="text-secondary-container font-data-tabular font-bold">+280 ر.س</span>
            </div>
            <button className="w-full mt-2 py-2 rounded-lg bg-secondary-container/20 text-secondary-container font-label-sm hover:bg-secondary-container/30 transition border border-secondary-container/30">
               محاكاة التحويل
            </button>
          </div>
        </div>
      </div>

      {/* Center Stage */}
      <div className="flex-grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
         {/* Ambient glow */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

         <div className="flex justify-between items-center mb-xl relative z-10">
            <div>
              <h1 className="font-h2 text-white mb-xs glow-text">الدفع الجماعي</h1>
              <p className="font-body-sm text-outline-variant">رفع وتدقيق ملفات مسير الرواتب</p>
            </div>
         </div>

         <div className="flex-grow flex flex-col gap-6 relative z-10">
            {/* Dropzone */}
            <div className="w-full border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] hover:border-secondary-container/50 transition-all cursor-pointer group group-hover:shadow-[0_0_20px_rgba(108,248,187,0.1)]">
               <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-[40px] text-outline-variant group-hover:text-secondary-container transition-colors">cloud_upload</span>
               </div>
               <h3 className="font-label-md text-white mb-2">اسحب وأفلت ملف إكسيل هنا</h3>
               <p className="font-body-sm text-outline-variant mb-6">أو اضغط لتصفح الملفات بصيغة CSV أو XLSX</p>
               <button className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-label-md hover:bg-white/20 transition-colors">تصفح الملفات</button>
            </div>

            {/* Verification Table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col flex-grow overflow-hidden shadow-sm">
               <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="font-label-md text-white">معاينة الملف المرفوع: Payroll_Oct_2023.xlsx</h3>
                  <button className="px-4 py-2 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm flex items-center gap-2 hover:bg-secondary-fixed transition">
                    <span className="material-symbols-outlined text-[18px]">fact_check</span>
                    بدء التحويل
                  </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-right border-collapse">
                    <thead className="bg-white/[0.02] border-b border-white/10 font-label-sm text-outline-variant">
                      <tr>
                        <th className="px-6 py-4 font-medium">اسم الموظف</th>
                        <th className="px-6 py-4 font-medium">الدولة</th>
                        <th className="px-6 py-4 font-medium">المبلغ المستحق</th>
                        <th className="px-6 py-4 font-medium">وسيلة الدفع</th>
                        <th className="px-6 py-4 font-medium text-left">التحقق</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-white divide-y divide-white/5">
                      <tr className="hover:bg-white/[0.05] transition-colors">
                        <td className="px-6 py-4 font-medium">أحمد سالم</td>
                        <td className="px-6 py-4"><span className="flex items-center gap-2">🇸🇦 السعودية</span></td>
                        <td className="px-6 py-4 font-data-tabular">24,500 <span className="text-xs text-outline-variant">ر.س</span></td>
                        <td className="px-6 py-4 text-outline-variant">تحويل بنكي مباشر</td>
                        <td className="px-6 py-4 text-left"><span className="material-symbols-outlined text-secondary-container">check_circle</span></td>
                      </tr>
                      <tr className="hover:bg-white/[0.05] transition-colors">
                        <td className="px-6 py-4 font-medium">جون ميلر</td>
                        <td className="px-6 py-4"><span className="flex items-center gap-2">🇺🇸 الولايات المتحدة</span></td>
                        <td className="px-6 py-4 font-data-tabular">31,200 <span className="text-xs text-outline-variant">ر.س</span></td>
                        <td className="px-6 py-4 text-outline-variant">USD Wallet</td>
                        <td className="px-6 py-4 text-left"><span className="material-symbols-outlined text-secondary-container">check_circle</span></td>
                      </tr>
                      <tr className="hover:bg-white/[0.05] transition-colors bg-error-container/5">
                        <td className="px-6 py-4 font-medium">كريم حسن</td>
                        <td className="px-6 py-4"><span className="flex items-center gap-2">🇪🇬 مصر</span></td>
                        <td className="px-6 py-4 font-data-tabular">15,400 <span className="text-xs text-outline-variant">ر.س</span></td>
                        <td className="px-6 py-4 text-error-container">رقم حساب غير صالح</td>
                        <td className="px-6 py-4 text-left"><span className="material-symbols-outlined text-error">cancel</span></td>
                      </tr>
                      <tr className="hover:bg-white/[0.05] transition-colors">
                        <td className="px-6 py-4 font-medium">سارة جونسون</td>
                        <td className="px-6 py-4"><span className="flex items-center gap-2">🇬🇧 المملكة المتحدة</span></td>
                        <td className="px-6 py-4 font-data-tabular">28,900 <span className="text-xs text-outline-variant">ر.س</span></td>
                        <td className="px-6 py-4 text-outline-variant">GBP Wallet</td>
                        <td className="px-6 py-4 text-left"><span className="material-symbols-outlined text-secondary-container">check_circle</span></td>
                      </tr>
                    </tbody>
                 </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
