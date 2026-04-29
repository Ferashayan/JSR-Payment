'use client';

import { useModal } from './ModalContext';

// Modal data configuration — separated from rendering logic
const MODAL_CONFIGS: Record<string, {
  title: string;
  icon: string;
  color: string;
  description: string;
  data: { label: string; value: string; highlight?: boolean; icon?: string; iconColor?: string; badge?: string }[];
}> = {
  savings: { title: 'تفاصيل إجمالي المدخرات', icon: 'account_balance_wallet', color: 'text-secondary-container bg-secondary-container/20 border-secondary-container/30', description: 'نظرة شاملة على المدخرات الخاصة بالرواتب لهذا الشهر.', data: [{ label: 'مدخرات الموظفين', value: '35,200 ر.س', highlight: true }, { label: 'المديونيات المحصلة', value: '10,000 ر.س' }, { label: 'النمو مقارنة بالشهر السابق', value: '+2.4%', icon: 'trending_up', iconColor: 'text-secondary-container' }, { label: 'حالة التحويل البنكي', value: 'تم', badge: 'bg-secondary-container/20 text-secondary-container' }] },
  exchange: { title: 'أسعار الصرف المتوقعة', icon: 'currency_exchange', color: 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30', description: 'تحليلات صرف العملات الرئيسية للرواتب المحولة دولياً.', data: [{ label: 'الدولار الأمريكي (USD)', value: '3.758 ر.س', highlight: true }, { label: 'اليورو (EUR)', value: '4.021 ر.س' }, { label: 'الدرهم الإماراتي (AED)', value: '1.023 ر.س' }] },
  tasks: { title: 'المهام المعلقة العاجلة', icon: 'pending_actions', color: 'text-error-container bg-error-container/20 border-error-container/30', description: 'المهام التي تتطلب إجراءً فورياً قبل اعتماد مسير الرواتب الرئيسي.', data: [{ label: 'مراجعة بيانات البصمة', value: '3 مهام', highlight: true, badge: 'bg-error/20 text-error-container' }, { label: 'إضافة الحسابات البنكية للموظفين الجدد', value: '4 مهام' }, { label: 'اعتماد سلف الموظفين', value: '5 مهام' }] },
  net_salary: { title: 'تفاصيل صافي الرواتب', icon: 'payments', color: 'text-secondary-container bg-secondary-container/20 border-secondary-container/30', description: 'المبلغ الإجمالي المعتمد للتحويل بعد خصم الاستقطاعات وإضافة البدلات.', data: [{ label: 'إجمالي الرواتب الأساسية', value: '1,320,000 ر.س', highlight: true }, { label: 'البدلات الثابتة والمتغيرة', value: '+ 344,500 ر.س', iconColor: 'text-secondary-container' }, { label: 'إجمالي الخصومات', value: '- 124,500 ر.س', iconColor: 'text-error-container' }, { label: 'عدد الموظفين المستفيدين', value: '142 موظف' }] },
  bonuses: { title: 'مستحقات البدلات والمكافآت', icon: 'redeem', color: 'text-primary-fixed-dim bg-primary-fixed-dim/20 border-primary-fixed-dim/30', description: 'تفصيل لجميع البدلات والمكافآت للموظفين للشهر الحالي.', data: [{ label: 'بدل السكن', value: '180,000 ر.س' }, { label: 'بدل النقل', value: '45,500 ر.س' }, { label: 'مكافآت الأداء', value: '25,000 ر.س', highlight: true }] },
  deductions: { title: 'تفاصيل الاستقطاعات', icon: 'receipt_long', color: 'text-error-container bg-error-container/20 border-error-container/30', description: 'بيان بالخصومات والمخالفات والتأمينات المستقطعة من رواتب الموظفين.', data: [{ label: 'التأمينات الاجتماعية (حصة الموظف)', value: '94,500 ر.س', highlight: true }, { label: 'غياب بدون عذر أو تأخير', value: '15,000 ر.س' }, { label: 'خصم السلف', value: '15,000 ر.س' }] },
  overtime: { title: 'ساعات العمل الإضافي', icon: 'more_time', color: 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30', description: 'مجموع ساعات العمل الإضافي المعتمدة والمبالغ المستحقة لتعويض الموظفين.', data: [{ label: 'العمل الإضافي (الأيام العادية)', value: '45,000 ر.س' }, { label: 'العمل الإضافي (العطل الرسمية)', value: '29,000 ر.س', highlight: true }, { label: 'إجمالي الساعات المعتمدة', value: '750 ساعة' }] },
  total_salaries: { title: 'تحليل إجمالي الرواتب', icon: 'bar_chart', color: 'text-primary-fixed bg-primary-fixed/20 border-primary-fixed/30', description: 'نظرة تفصيلية على مسير الرواتب والميزانية المخصصة مقارنة بالأشهر السابقة.', data: [{ label: 'إجمالي الرواتب لهذا الشهر', value: '1,940,200 ر.س', highlight: true }, { label: 'مقارنة بالشهر السابق (سبتمبر)', value: '+4.2%', icon: 'trending_up', iconColor: 'text-secondary-container' }, { label: 'الميزانية المعتمدة', value: '2,000,000 ر.س' }] },
  active_employees: { title: 'حركة ونشاط الموظفين', icon: 'groups', color: 'text-secondary-container bg-secondary-container/20 border-secondary-container/30', description: 'إحصائيات الموظفين النشطين والتغيرات الديموغرافية والوظيفية خلال دورة الدفع الحالية.', data: [{ label: 'إجمالي الموظفين النشطين', value: '142 موظف', highlight: true }, { label: 'التعيينات الجديدة', value: '5 موظفين', iconColor: 'text-secondary-container' }, { label: 'نهاية خدمة / استقالات', value: '0 موظف', iconColor: 'text-outline-variant' }, { label: 'في إجازة بدون راتب', value: '2 موظف' }] },
  departments: { title: 'توزيع الرواتب على الأقسام', icon: 'pie_chart', color: 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30', description: 'تحليل لتوزيع ميزانية الرواتب على مختلف الأقسام داخل المنظمة.', data: [{ label: 'قسم التطوير (45%)', value: '873,090 ر.س', highlight: true }, { label: 'المبيعات (30%)', value: '582,060 ر.س' }, { label: 'الإدارة (25%)', value: '485,050 ر.س' }] },
};

function AddPaymentMethodModal() {
  const { closeModal } = useModal();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={closeModal}>
      <div className="glass-panel w-full max-w-[500px] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative animate-in zoom-in-95 duration-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <div><h2 className="font-h2 text-white mb-1">إضافة طريقة دفع</h2><p className="font-body-sm text-outline-variant">اختر نوع طريقة الدفع لإضافتها إلى حسابك.</p></div>
          <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition-colors border border-white/10"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <button className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors text-right group">
            <div className="w-12 h-12 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center group-hover:bg-secondary-container/30 transition-colors"><span className="material-symbols-outlined">account_balance</span></div>
            <div className="flex-1"><div className="font-label-md text-white mb-1">حساب بنكي (IBAN)</div><div className="font-body-sm text-outline-variant text-xs">تحويل بنكي مباشر (يستغرق 1-2 أيام عمل)</div></div>
            <span className="material-symbols-outlined text-outline-variant rtl:-scale-x-100">arrow_forward_ios</span>
          </button>
          <button className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors text-right group">
            <div className="w-12 h-12 rounded-full bg-primary-fixed/20 text-primary-fixed flex items-center justify-center group-hover:bg-primary-fixed/30 transition-colors"><span className="material-symbols-outlined">phone_iphone</span></div>
            <div className="flex-1"><div className="font-label-md text-white mb-1">محفظة رقمية (مثال: STC Pay)</div><div className="font-body-sm text-outline-variant text-xs">تحويل فوري برقم الجوال</div></div>
            <span className="material-symbols-outlined text-outline-variant rtl:-scale-x-100">arrow_forward_ios</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DataModal({ config }: { config: typeof MODAL_CONFIGS[string] }) {
  const { closeModal } = useModal();
  const { title, icon, color, description, data } = config;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xl p-6 transition-all duration-300" onClick={closeModal}>
      <div className="glass-panel w-full max-w-[1400px] h-[90vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative animate-bubble-pop overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-lg lg:p-xl border-b border-white/10 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${color} shadow-[0_0_20px_rgba(255,255,255,0.05)]`}><span className="material-symbols-outlined text-[32px]">{icon}</span></div>
            <div><h2 className="font-h2 text-white glow-text mb-1">{title}</h2><p className="font-body-sm text-outline-variant">{description}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 rounded-xl bg-white/5 text-white font-label-md hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10 shadow-sm"><span className="material-symbols-outlined text-[20px]">filter_list</span>الفلاتر المتقدمة</button>
            <button className="px-4 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(108,248,187,0.3)]"><span className="material-symbols-outlined text-[20px]">download</span>تصدير التقرير</button>
            <div className="w-px h-8 bg-white/10 mx-2"></div>
            <button onClick={closeModal} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-error/20 hover:text-error hover:border-error/30 text-outline-variant transition-colors border border-white/10 group"><span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">close</span></button>
          </div>
        </div>
        {/* Body */}
        <div className="flex-grow p-lg lg:p-xl overflow-y-auto flex gap-xl scrollbar-hide">
          <div className="flex-grow flex flex-col gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((item, index) => (
                <div key={index} className={`bg-white/5 rounded-2xl p-5 border ${item.highlight ? 'border-white/20 glow-effect' : 'border-white/5'} flex flex-col justify-between shadow-sm relative overflow-hidden group`}>
                  {item.highlight && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/4 pointer-events-none group-hover:bg-white/10 transition-colors"></div>}
                  <span className="font-body-sm text-outline-variant mb-3 relative z-10">{item.label}</span>
                  <div className={`font-data-tabular flex justify-between items-end relative z-10 ${item.highlight ? 'text-white text-2xl font-bold' : 'text-white text-xl'}`}>
                    <span>{item.value}</span>
                    <div className="flex flex-col items-end gap-2">
                      {item.icon && <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 ${item.iconColor}`}><span className="material-symbols-outlined text-[18px]">{item.icon}</span></div>}
                      {item.badge && <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide ${item.badge}`}>إجراء مطلوب</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Placeholder table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col flex-grow overflow-hidden shadow-sm">
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3"><h3 className="font-h3 text-white">التفاصيل التحليلية</h3><span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-data-tabular text-xs">5 سجلات</span></div>
              </div>
              <div className="p-8 text-center text-outline-variant font-body-sm">اضغط على أي عنصر لعرض تفاصيله الكاملة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModalSystem() {
  const { activeModal } = useModal();
  
  if (!activeModal) return null;
  if (activeModal === 'add_payment_method') return <AddPaymentMethodModal />;
  
  const config = MODAL_CONFIGS[activeModal];
  if (!config) return null;
  
  return <DataModal config={config} />;
}
