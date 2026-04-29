/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import DashboardView from './views/DashboardView';
import BulkPayView from './views/BulkPayView';
import EmployeesView from './views/EmployeesView';
import WalletView from './views/WalletView';
import SettingsView from './views/SettingsView';
import EmployeeDashboardView from './views/EmployeeDashboardView';

export default function App() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'bulk_pay' | 'employees' | 'wallet' | 'settings'>('dashboard');
  const [currentRole, setCurrentRole] = useState<'employer' | 'employee'>('employer');
  const [employeeView, setEmployeeView] = useState<'dashboard' | 'wallet' | 'settings'>('dashboard');
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'مرحباً بك! أنا المساعد الذكي لمنصة Pay. كيف يمكنني مساعدتك لإنهاء مهام الرواتب اليوم؟' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'تم تأكيد الدفع', description: 'تم تحويل رواتب شهر أكتوبر بنجاح', time: 'منذ ١٠ دقائق', unread: false, type: 'success' },
    { id: 2, title: 'إيداع مكتمل', description: 'تم إيداع مبلغ 2,000,000 ر.س في محفظة الشركة', time: 'منذ ساعتين', unread: false, type: 'info' }
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ id: number; title: string; description: string; type: string } | null>(null);
  
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    // Simulate incoming real-time notification
    const timer = setTimeout(() => {
      const newNotif = {
        id: Date.now(),
        title: 'مهمة معلقة جديدة',
        description: 'طلب إجازة/سلفة جديد في انتظار מراجعتك.',
        time: 'الآن',
        unread: true,
        type: 'warning'
      };
      setNotifications(prev => [newNotif, ...prev]);
      setToastNotification(newNotif);
      
      // Auto-hide toast
      setTimeout(() => {
        setToastNotification(null);
      }, 6000);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    setChatInput('');
    setIsChatOpen(true);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'لقد قمت بتحليل طلبك وإعداد ملخص للإجراءات المطلوبة. أبلغني إن أردت المضي قدماً في تنفيذ الدفع الجماعي أو إرسال تنبيهات للموظفين.' 
      }]);
    }, 1500);
  };

  const renderModal = () => {
    if (!activeModal) return null;

    let title = '', icon = '', color = '', description = '', data = [];

    switch(activeModal) {
      case 'savings':
        title = 'تفاصيل إجمالي المدخرات';
        icon = 'account_balance_wallet';
        color = 'text-secondary-container bg-secondary-container/20 border-secondary-container/30';
        description = 'نظرة شاملة على المدخرات الخاصة بالرواتب لهذا الشهر.';
        data = [
          { label: 'مدخرات الموظفين', value: '35,200 ر.س', highlight: true },
          { label: 'المديونيات المحصلة', value: '10,000 ر.س' },
          { label: 'النمو مقارنة بالشهر السابق', value: '+2.4%', icon: 'trending_up', iconColor: 'text-secondary-container' },
          { label: 'حالة التحويل البنكي', value: 'تم', badge: 'bg-secondary-container/20 text-secondary-container' }
        ];
        break;
      case 'exchange':
        title = 'أسعار الصرف المتوقعة';
        icon = 'currency_exchange';
        color = 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30';
        description = 'تحليلات صرف العملات الرئيسية للرواتب المحولة دولياً.';
        data = [
          { label: 'الدولار الأمريكي (USD)', value: '3.758 ر.س', highlight: true },
          { label: 'اليورو (EUR)', value: '4.021 ر.س' },
          { label: 'الدرهم الإماراتي (AED)', value: '1.023 ر.س' }
        ];
        break;
      case 'tasks':
        title = 'المهام المعلقة العاجلة';
        icon = 'pending_actions';
        color = 'text-error-container bg-error-container/20 border-error-container/30';
        description = 'المهام التي تتطلب إجراءً فورياً قبل اعتماد مسير الرواتب الرئيسي.';
        data = [
          { label: 'مراجعة بيانات البصمة', value: '3 مهام', highlight: true, badge: 'bg-error/20 text-error-container' },
          { label: 'إضافة الحسابات البنكية للموظفين الجدد', value: '4 مهام' },
          { label: 'اعتماد سلف الموظفين', value: '5 مهام' }
        ];
        break;
      case 'net_salary':
        title = 'تفاصيل صافي الرواتب';
        icon = 'payments';
        color = 'text-secondary-container bg-secondary-container/20 border-secondary-container/30';
        description = 'المبلغ الإجمالي المعتمد للتحويل بعد خصم الاستقطاعات وإضافة البدلات.';
        data = [
          { label: 'إجمالي الرواتب الأساسية', value: '1,320,000 ر.س', highlight: true },
          { label: 'البدلات الثابتة والمتغيرة', value: '+ 344,500 ر.س', iconColor: 'text-secondary-container' },
          { label: 'إجمالي الخصومات', value: '- 124,500 ر.س', iconColor: 'text-error-container' },
          { label: 'عدد الموظفين المستفيدين', value: '142 موظف' }
        ];
        break;
      case 'bonuses':
        title = 'مستحقات البدلات والمكافآت';
        icon = 'redeem';
        color = 'text-primary-fixed-dim bg-primary-fixed-dim/20 border-primary-fixed-dim/30';
        description = 'تفصيل لجميع البدلات والمكافآت للموظفين للشهر الحالي.';
        data = [
          { label: 'بدل السكن', value: '180,000 ر.س' },
          { label: 'بدل النقل', value: '45,500 ر.س' },
          { label: 'مكافآت الأداء', value: '25,000 ر.س', highlight: true }
        ];
        break;
      case 'deductions':
        title = 'تفاصيل الاستقطاعات';
        icon = 'receipt_long';
        color = 'text-error-container bg-error-container/20 border-error-container/30';
        description = 'بيان بالخصومات والمخالفات والتأمينات المستقطعة من رواتب الموظفين.';
        data = [
          { label: 'التأمينات الاجتماعية (حصة الموظف)', value: '94,500 ر.س', highlight: true },
          { label: 'غياب بدون عذر أو تأخير', value: '15,000 ر.س' },
          { label: 'خصم السلف', value: '15,000 ر.س' }
        ];
        break;
      case 'overtime':
        title = 'ساعات العمل الإضافي';
        icon = 'more_time';
        color = 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30';
        description = 'مجموع ساعات العمل الإضافي المعتمدة والمبالغ المستحقة لتعويض الموظفين.';
        data = [
          { label: 'العمل الإضافي (الأيام العادية)', value: '45,000 ر.س' },
          { label: 'ال العمل الإضافي (العطل الرسمية)', value: '29,000 ر.س', highlight: true },
          { label: 'إجمالي الساعات المعتمدة', value: '750 ساعة' }
        ];
        break;
      case 'total_salaries':
        title = 'تحليل إجمالي الرواتب';
        icon = 'bar_chart';
        color = 'text-primary-fixed bg-primary-fixed/20 border-primary-fixed/30';
        description = 'نظرة تفصيلية على مسير الرواتب والميزانية المخصصة مقارنة بالأشهر السابقة.';
        data = [
          { label: 'إجمالي الرواتب لهذا الشهر', value: '1,940,200 ر.س', highlight: true },
          { label: 'مقارنة بالشهر السابق (سبتمبر)', value: '+4.2%', icon: 'trending_up', iconColor: 'text-secondary-container' },
          { label: 'الميزانية المعتمدة', value: '2,000,000 ر.س' }
        ];
        break;
      case 'active_employees':
        title = 'حركة ونشاط الموظفين';
        icon = 'groups';
        color = 'text-secondary-container bg-secondary-container/20 border-secondary-container/30';
        description = 'إحصائيات الموظفين النشطين والتغيرات الديموغرافية والوظيفية خلال دورة الدفع الحالية.';
        data = [
          { label: 'إجمالي الموظفين النشطين', value: '142 موظف', highlight: true },
          { label: 'التعيينات الجديدة', value: '5 موظفين', iconColor: 'text-secondary-container' },
          { label: 'نهاية خدمة / استقالات', value: '0 موظف', iconColor: 'text-outline-variant' },
          { label: 'في إجازة بدون راتب', value: '2 موظف' }
        ];
        break;
      case 'departments':
        title = 'توزيع الرواتب على الأقسام';
        icon = 'pie_chart';
        color = 'text-tertiary-fixed-dim bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim/30';
        description = 'تحليل لتوزيع ميزانية الرواتب على مختلف الأقسام داخل المنظمة.';
        data = [
          { label: 'قسم التطوير (45%)', value: '873,090 ر.س', highlight: true },
          { label: 'المبيعات (30%)', value: '582,060 ر.س' },
          { label: 'الإدارة (25%)', value: '485,050 ر.س' }
        ];
        break;
      case 'add_payment_method':
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setActiveModal(null)}>
            <div 
              className="glass-panel w-full max-w-[500px] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative animate-in zoom-in-95 duration-200 overflow-hidden" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                 <div>
                   <h2 className="font-h2 text-white mb-1">إضافة طريقة دفع</h2>
                   <p className="font-body-sm text-outline-variant">اختر نوع طريقة الدفع لإضافتها إلى حسابك.</p>
                 </div>
                 <button onClick={() => setActiveModal(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition-colors border border-white/10">
                   <span className="material-symbols-outlined text-[20px]">close</span>
                 </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                 <button className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors text-right group">
                    <div className="w-12 h-12 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center group-hover:bg-secondary-container/30 transition-colors">
                      <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-label-md text-white mb-1">حساب بنكي (IBAN)</div>
                      <div className="font-body-sm text-outline-variant text-xs">تحويل بنكي مباشر (يستغرق 1-2 أيام عمل)</div>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant rtl:-scale-x-100">arrow_forward_ios</span>
                 </button>
                 <button className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors text-right group">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed/20 text-primary-fixed flex items-center justify-center group-hover:bg-primary-fixed/30 transition-colors">
                      <span className="material-symbols-outlined">phone_iphone</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-label-md text-white mb-1">محفظة رقمية (مثال: STC Pay)</div>
                      <div className="font-body-sm text-outline-variant text-xs">تحويل فوري برقم الجوال</div>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant rtl:-scale-x-100">arrow_forward_ios</span>
                 </button>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xl p-6 transition-all duration-300" onClick={() => setActiveModal(null)}>
        <div className="glass-panel w-full max-w-[1400px] h-[90vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative animate-bubble-pop overflow-hidden" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-lg lg:p-xl border-b border-white/10 shrink-0 bg-white/[0.02]">
             <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${color} shadow-[0_0_20px_rgba(255,255,255,0.05)]`}>
                  <span className="material-symbols-outlined text-[32px]">{icon}</span>
                </div>
                <div>
                  <h2 className="font-h2 text-white glow-text mb-1">{title}</h2>
                  <p className="font-body-sm text-outline-variant">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="px-4 py-2.5 rounded-xl bg-white/5 text-white font-label-md hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10 shadow-sm">
                   <span className="material-symbols-outlined text-[20px]">filter_list</span>
                   الفلاتر المتقدمة
                 </button>
                 <button className="px-4 py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(108,248,187,0.3)]">
                   <span className="material-symbols-outlined text-[20px]">download</span>
                   تصدير التقرير
                 </button>
                 <div className="w-px h-8 bg-white/10 mx-2"></div>
                 <button onClick={() => setActiveModal(null)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-error/20 hover:text-error hover:border-error/30 text-outline-variant transition-colors border border-white/10 group">
                   <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">close</span>
                 </button>
              </div>
          </div>
          
          {/* Body */}
          <div className="flex-grow p-lg lg:p-xl overflow-y-auto flex gap-xl scrollbar-hide">
             
             {/* Main Content (Table) */}
             <div className="flex-grow flex flex-col gap-6">
                
                {/* Horizontal Summary Cards */}
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

                {/* Table Section */}
                <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col flex-grow overflow-hidden shadow-sm">
                   <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <h3 className="font-h3 text-white">التفاصيل التحليلية</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-data-tabular text-xs">5 سجلات</span>
                      </div>
                      <div className="flex gap-3">
                         <div className="glass-panel rounded-xl flex items-center px-4 py-2 border border-white/10 w-72 focus-within:border-secondary-container/50 focus-within:shadow-[0_0_10px_rgba(108,248,187,0.1)] transition-all">
                           <span className="material-symbols-outlined text-outline-variant text-[20px] ml-3">search</span>
                           <input type="text" placeholder="البحث..." className="bg-transparent border-none outline-none text-white font-body-sm w-full placeholder-outline-variant/50" />
                         </div>
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-right border-collapse">
                      {activeModal === 'exchange' ? (
                        <>
                          <thead className="bg-white/[0.02] border-b border-white/10 font-label-md text-outline-variant">
                            <tr>
                              <th className="px-6 py-4 font-medium">العملة الأساسية</th>
                              <th className="px-6 py-4 font-medium">العملة المقابلة</th>
                              <th className="px-6 py-4 font-medium">سعر الصرف الحالي</th>
                              <th className="px-6 py-4 font-medium">سعر الإغلاق السابق</th>
                              <th className="px-6 py-4 font-medium">تاريخ التحديث</th>
                              <th className="px-6 py-4 font-medium text-left">التغير</th>
                            </tr>
                          </thead>
                          <tbody className="font-body-sm text-white divide-y divide-white/5">
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-outline-variant group-hover:text-white transition-colors">دولار أمريكي (USD)</td>
                              <td className="px-6 py-4 font-medium">ريال سعودي (SAR)</td>
                              <td className="px-6 py-4 font-data-tabular">3.758</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">3.758</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">28 أكتوبر 2023, 10:00 ص</td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-outline-variant"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant ml-1.5"></span>مستقر</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-outline-variant group-hover:text-white transition-colors">يورو (EUR)</td>
                              <td className="px-6 py-4 font-medium">ريال سعودي (SAR)</td>
                              <td className="px-6 py-4 font-data-tabular">4.021</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">4.015</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">28 أكتوبر 2023, 10:00 ص</td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-container/10 text-secondary-container"><span className="material-symbols-outlined text-[14px] ml-1">trending_up</span>+0.15%</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-outline-variant group-hover:text-white transition-colors">جنيه إسترليني (GBP)</td>
                              <td className="px-6 py-4 font-medium">ريال سعودي (SAR)</td>
                              <td className="px-6 py-4 font-data-tabular">4.560</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">4.582</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">28 أكتوبر 2023, 10:00 ص</td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-error/10 text-error-container"><span className="material-symbols-outlined text-[14px] ml-1">trending_down</span>-0.48%</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-outline-variant group-hover:text-white transition-colors">درهم إماراتي (AED)</td>
                              <td className="px-6 py-4 font-medium">ريال سعودي (SAR)</td>
                              <td className="px-6 py-4 font-data-tabular">1.023</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">1.023</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">28 أكتوبر 2023, 10:00 ص</td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-outline-variant"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant ml-1.5"></span>مستقر</span></td>
                            </tr>
                          </tbody>
                        </>
                      ) : activeModal === 'tasks' ? (
                        <>
                          <thead className="bg-white/[0.02] border-b border-white/10 font-label-md text-outline-variant">
                            <tr>
                              <th className="px-6 py-4 font-medium">معرف المهمة</th>
                              <th className="px-6 py-4 font-medium">وصف المهمة</th>
                              <th className="px-6 py-4 font-medium">القسم المعني</th>
                              <th className="px-6 py-4 font-medium">تاريخ الإنشاء</th>
                              <th className="px-6 py-4 font-medium text-left">الأولوية والحالة</th>
                            </tr>
                          </thead>
                          <tbody className="font-body-sm text-white divide-y divide-white/5">
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#TSK-8021</td>
                              <td className="px-6 py-4 font-medium">مراجعة بيانات البصمة والتأخيرات غير المبررة</td>
                              <td className="px-6 py-4 text-outline-variant">الموارد البشرية</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">25 أكتوبر 2023</td>
                              <td className="px-6 py-4 text-left">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold bg-error-container/20 text-error-container border border-error-container/30">أولوية قصوى</span>
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-outline-variant"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant ml-1.5"></span>لم تبدأ</span>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#TSK-8022</td>
                              <td className="px-6 py-4 font-medium">اعتماد الحسابات البنكية للموظفين الجدد (5 موظفين)</td>
                              <td className="px-6 py-4 text-outline-variant">الإدارة المالية</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">26 أكتوبر 2023</td>
                              <td className="px-6 py-4 text-left">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold bg-orange-400/20 text-orange-400 border border-orange-400/30">أولوية متوسطة</span>
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-container/10 text-secondary-container border border-secondary-container/20"><span className="w-1.5 h-1.5 rounded-full bg-secondary-container ml-1.5"></span>قيد المعالجة</span>
                                </div>
                              </td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#TSK-8023</td>
                              <td className="px-6 py-4 font-medium">تحديث خصومات السلف للموظف سالم عبدالله</td>
                              <td className="px-6 py-4 text-outline-variant">الإدارة المالية</td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">27 أكتوبر 2023</td>
                              <td className="px-6 py-4 text-left">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold bg-error-container/20 text-error-container border border-error-container/30">أولوية قصوى</span>
                                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-outline-variant"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant ml-1.5"></span>لم تبدأ</span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </>
                      ) : activeModal === 'savings' ? (
                        <>
                          <thead className="bg-white/[0.02] border-b border-white/10 font-label-md text-outline-variant">
                            <tr>
                              <th className="px-6 py-4 font-medium">الفترة الزمنية</th>
                              <th className="px-6 py-4 font-medium">إجمالي المدخرات (ر.س)</th>
                              <th className="px-6 py-4 font-medium relative">نسبة التغير<span className="text-[10px] absolute top-1/2 -translate-y-1/2 ml-1 opacity-50">(عن الشهر السابق)</span></th>
                              <th className="px-6 py-4 font-medium">الفرق بالمبلغ</th>
                              <th className="px-6 py-4 font-medium text-left">ملاحظات والتوصيات</th>
                            </tr>
                          </thead>
                          <tbody className="font-body-sm text-white divide-y divide-white/5">
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-medium text-secondary-container">أكتوبر 2023 (الحالي)</td>
                              <td className="px-6 py-4 font-data-tabular text-xl glow-text">45,200</td>
                              <td className="px-6 py-4">
                                <span className="flex items-center gap-1 text-secondary-container font-data-tabular bg-secondary-container/10 w-fit px-2 py-0.5 rounded">
                                  <span className="material-symbols-outlined text-[14px]">trending_up</span>+2.4%
                                </span>
                              </td>
                              <td className="px-6 py-4 font-data-tabular text-secondary-container">+1,100 ر.س</td>
                              <td className="px-6 py-4 text-outline-variant text-left">نمو مستقر بدعم من تقليل السلف المتراكمة</td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-outline-variant group-hover:text-white transition-colors">سبتمبر 2023</td>
                              <td className="px-6 py-4 font-data-tabular">44,100</td>
                              <td className="px-6 py-4">
                                 <span className="flex items-center gap-1 text-secondary-container font-data-tabular">
                                  <span className="material-symbols-outlined text-[14px]">trending_up</span>+1.5%
                                </span>
                              </td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">+650 ر.س</td>
                              <td className="px-6 py-4 text-outline-variant text-left">تحسن في تحصيل مديونيات الموظفين</td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 text-outline-variant group-hover:text-white transition-colors">أغسطس 2023</td>
                              <td className="px-6 py-4 font-data-tabular">43,450</td>
                              <td className="px-6 py-4">
                                 <span className="flex items-center gap-1 text-error-container font-data-tabular">
                                  <span className="material-symbols-outlined text-[14px]">trending_down</span>-0.3%
                                </span>
                              </td>
                              <td className="px-6 py-4 font-data-tabular text-outline-variant">-130 ر.س</td>
                              <td className="px-6 py-4 text-outline-variant text-left">تأثر طفيف بسبب صرف بدلات سنوية</td>
                            </tr>
                          </tbody>
                        </>
                      ) : (
                        <>
                          <thead className="bg-white/[0.02] border-b border-white/10 font-label-md text-outline-variant">
                            <tr>
                              <th className="px-6 py-4 font-medium">رقم المرجع</th>
                              <th className="px-6 py-4 font-medium">اسم الموظف</th>
                              <th className="px-6 py-4 font-medium">القسم</th>
                              <th className="px-6 py-4 font-medium">المبلغ المستحق</th>
                              <th className="px-6 py-4 font-medium">ملاحظات النظام</th>
                              <th className="px-6 py-4 font-medium text-left">الحالة</th>
                            </tr>
                          </thead>
                          <tbody className="font-body-sm text-white divide-y divide-white/5">
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#REQ-8021</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-fixed to-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed text-xs font-bold border border-primary-fixed/30 shadow-inner">FR</div>
                                  <span className="font-medium">فراس العيان</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-outline-variant">قسم التطوير</td>
                              <td className="px-6 py-4 font-data-tabular">24,500 <span className="text-outline-variant text-xs">ر.س</span></td>
                              <td className="px-6 py-4 text-outline-variant truncate max-w-[150px]">لا توجد ملاحظات إضافية</td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-container/10 text-secondary-container border border-secondary-container/20"><span className="w-1.5 h-1.5 rounded-full bg-secondary-container ml-1.5"></span>معتمد</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#REQ-8022</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-tertiary-fixed-dim to-tertiary-fixed-dim/20 flex items-center justify-center text-tertiary-fixed-dim text-xs font-bold border border-tertiary-fixed-dim/30 shadow-inner">SA</div>
                                  <span className="font-medium">سالم عبدالله</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-outline-variant">المبيعات</td>
                              <td className="px-6 py-4 font-data-tabular">18,200 <span className="text-outline-variant text-xs">ر.س</span></td>
                              <td className="px-6 py-4 text-warning flex items-center gap-1.5 text-orange-400">
                                <span className="material-symbols-outlined text-[16px]">warning</span>
                                تجاوز حد السلف
                              </td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400 border border-orange-400/20"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 ml-1.5"></span>قيد المراجعة</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#REQ-8023</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-error-container to-error-container/20 flex items-center justify-center text-error-container text-xs font-bold border border-error-container/30 shadow-inner">NA</div>
                                  <span className="font-medium">نورة الأحمد</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-outline-variant">الإدارة المالية</td>
                              <td className="px-6 py-4 font-data-tabular">21,000 <span className="text-outline-variant text-xs">ر.س</span></td>
                              <td className="px-6 py-4 text-error-container flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                بيانات بنكية غير مكتملة
                              </td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-error/10 text-error-container border border-error/20"><span className="w-1.5 h-1.5 rounded-full bg-error ml-1.5"></span>إجراء مطلوب</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#REQ-8024</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-fixed to-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed text-xs font-bold border border-primary-fixed/30 shadow-inner">KH</div>
                                  <span className="font-medium">خالد سعيد</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-outline-variant">قسم التطوير</td>
                              <td className="px-6 py-4 font-data-tabular">26,100 <span className="text-outline-variant text-xs">ر.س</span></td>
                              <td className="px-6 py-4 text-outline-variant truncate max-w-[150px]">متضمنة بدل نقل إضافي</td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-container/10 text-secondary-container border border-secondary-container/20"><span className="w-1.5 h-1.5 rounded-full bg-secondary-container ml-1.5"></span>معتمد</span></td>
                            </tr>
                            <tr className="hover:bg-white/[0.05] transition-colors cursor-pointer group">
                              <td className="px-6 py-4 font-data-tabular text-outline-variant group-hover:text-white transition-colors">#REQ-8025</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-fixed to-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed text-xs font-bold border border-primary-fixed/30 shadow-inner">MH</div>
                                  <span className="font-medium">محمد العتيبي</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-outline-variant">المبيعات</td>
                              <td className="px-6 py-4 font-data-tabular">15,400 <span className="text-outline-variant text-xs">ر.س</span></td>
                              <td className="px-6 py-4 text-outline-variant truncate max-w-[150px]">استقطاع غياب يومين</td>
                              <td className="px-6 py-4 text-left"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-container/10 text-secondary-container border border-secondary-container/20"><span className="w-1.5 h-1.5 rounded-full bg-secondary-container ml-1.5"></span>معتمد</span></td>
                            </tr>
                          </tbody>
                        </>
                      )}
                     </table>
                   </div>
                   {/* Pagination Placeholder */}
                   <div className="p-4 border-t border-white/10 bg-white/[0.01] flex items-center justify-between">
                     <span className="text-xs text-outline-variant">إظهار 5 من أصل 142 سجل</span>
                     <div className="flex gap-1">
                       <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-outline-variant hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                         <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                       </button>
                       <button className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white transition-colors font-data-tabular text-xs">1</button>
                       <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-outline-variant hover:text-white hover:bg-white/10 transition-colors font-data-tabular text-xs">2</button>
                       <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-outline-variant hover:text-white hover:bg-white/10 transition-colors font-data-tabular text-xs">3</button>
                       <span className="w-8 h-8 flex items-center justify-center text-outline-variant text-xs">...</span>
                       <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-outline-variant hover:text-white hover:bg-white/10 transition-colors">
                         <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                       </button>
                     </div>
                   </div>
                </div>

             </div>

             {/* Right Sidebar (Filters & Quick Actions) */}
             <div className="w-[320px] shrink-0 flex flex-col gap-6 border-r border-white/10 pr-6 relative">
                {/* Subtle gradient behind sidebar */}
                <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none -z-10"></div>
                
                <div>
                   <div className="flex items-center gap-2 mb-4 text-white">
                      <span className="material-symbols-outlined text-[20px] text-outline-variant">tune</span>
                      <h3 className="font-label-md">تصفية النتائج</h3>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex flex-col gap-2.5">
                        <label className="font-label-sm text-outline-variant flex justify-between items-center">
                          الفترة الزمنية
                          <span className="text-secondary-container text-xs font-normal hover:underline cursor-pointer">اليوم الدراسي الحالي</span>
                        </label>
                        <select className="bg-white/5 border border-white/10 rounded-xl p-3 text-white font-body-sm outline-none w-full hover:bg-white/10 focus:border-secondary-container/50 transition-colors appearance-none relative">
                          <option className="bg-surface text-on-surface">أكتوبر 2023</option>
                          <option className="bg-surface text-on-surface">سبتمبر 2023</option>
                          <option className="bg-surface text-on-surface">أغسطس 2023</option>
                        </select>
                      </div>
                      
                      <div className="flex flex-col gap-2.5">
                        <label className="font-label-sm text-outline-variant">فرز حسب القسم</label>
                        <div className="space-y-1.5 bg-white/5 rounded-xl p-3 border border-white/10">
                           <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-secondary-container focus:ring-secondary-container focus:ring-offset-0" defaultChecked/>
                               <span className="font-body-sm text-white group-hover:text-secondary-container transition-colors">التطوير والتقنية</span>
                             </div>
                             <span className="text-[10px] font-data-tabular text-outline-variant bg-white/10 px-1.5 py-0.5 rounded">42</span>
                           </label>
                           <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-secondary-container focus:ring-secondary-container focus:ring-offset-0" defaultChecked/>
                               <span className="font-body-sm text-white group-hover:text-secondary-container transition-colors">المبيعات والتسويق</span>
                             </div>
                             <span className="text-[10px] font-data-tabular text-outline-variant bg-white/10 px-1.5 py-0.5 rounded">65</span>
                           </label>
                           <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-secondary-container focus:ring-secondary-container focus:ring-offset-0" />
                               <span className="font-body-sm text-outline-variant group-hover:text-white transition-colors">الإدارة المالية</span>
                             </div>
                             <span className="text-[10px] font-data-tabular text-outline-variant bg-white/5 px-1.5 py-0.5 rounded">15</span>
                           </label>
                           <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors">
                             <div className="flex items-center gap-3">
                               <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20 text-secondary-container focus:ring-secondary-container focus:ring-offset-0" />
                               <span className="font-body-sm text-outline-variant group-hover:text-white transition-colors">الموارد البشرية</span>
                             </div>
                             <span className="text-[10px] font-data-tabular text-outline-variant bg-white/5 px-1.5 py-0.5 rounded">20</span>
                           </label>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <label className="font-label-sm text-outline-variant">حالة الطلب</label>
                        <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1.5 rounded-lg border border-secondary-container text-secondary-container bg-secondary-container/10 font-label-sm hover:bg-secondary-container/20 transition-colors">معتمد</button>
                          <button className="px-3 py-1.5 rounded-lg border border-white/20 text-outline-variant bg-white/5 font-label-sm hover:text-white hover:bg-white/10 transition-colors">إجراء مطلوب</button>
                          <button className="px-3 py-1.5 rounded-lg border border-white/20 text-outline-variant bg-white/5 font-label-sm hover:text-white hover:bg-white/10 transition-colors">قيد المراجعة</button>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="mt-auto">
                   <div className="bg-gradient-to-br from-error-container/20 to-error-container/5 border border-error-container/20 rounded-xl p-5 relative overflow-hidden group">
                     {/* Decorative blur inside card */}
                     <div className="absolute top-0 left-0 w-20 h-20 bg-error-container/20 rounded-full blur-[20px] -translate-x-1/2 -translate-y-1/2"></div>
                     
                     <div className="flex items-center gap-2 mb-3 text-error-container font-label-md relative z-10">
                       <span className="material-symbols-outlined text-[20px]">warning</span>
                       تنبيهات النظام الذكي
                     </div>
                     <p className="font-body-sm text-white/90 leading-relaxed text-sm mb-4 relative z-10">
                        تم رصد 3 حالات تتطلب تحديث مسارات الاعتماد وبيانات التأمينات. يرجى مراجعتها وتدقيقها قبل اعتماد مسير الرواتب النهائي للبنك.
                     </p>
                     <button className="w-full py-2 rounded-lg bg-error-container/20 text-error-container border border-error-container/30 font-label-sm hover:bg-error-container/30 transition-colors flex items-center justify-center gap-2 relative z-10">
                        مراجعة الحالات الآن
                        <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
                     </button>
                   </div>
                </div>
             </div>

          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md overflow-hidden text-on-background w-full">
      {renderModal()}
      {/* Main Content Area */}
      <main className="flex-grow flex items-stretch justify-center p-gutter pt-xl pb-[220px] relative z-10 w-full overflow-hidden">
        {currentRole === 'employer' ? (
          <>
            {currentView === 'dashboard' && <DashboardView setActiveModal={setActiveModal} />}
            {currentView === 'bulk_pay' && <BulkPayView setActiveModal={setActiveModal} />}
            {currentView === 'employees' && <EmployeesView />}
            {currentView === 'wallet' && <WalletView />}
            {currentView === 'settings' && <SettingsView />}
          </>
        ) : (
          <>
            {employeeView === 'dashboard' && <EmployeeDashboardView setActiveModal={setActiveModal} />}
            {employeeView === 'wallet' && <div className="text-white">طريقة عرض محفظة الموظف قريباً...</div>}
            {employeeView === 'settings' && <div className="text-white">طريقة عرض إعدادات الموظف قريباً...</div>}
          </>
        )}
      </main>

      {/* Role Toggle Floating Button */}
      <div className="fixed top-1/2 left-6 -translate-y-1/2 z-50 pointer-events-auto">
         <button 
           onClick={() => setCurrentRole(r => r === 'employer' ? 'employee' : 'employer')} 
           className="glass-panel p-3 rounded-full flex flex-col gap-2 items-center text-white border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all group"
         >
            <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
            <span className="font-label-sm whitespace-nowrap opacity-0 group-hover:opacity-100 absolute left-full ml-4 bg-black/80 px-3 py-1.5 rounded border border-white/10 pointer-events-none transition-opacity">
              {currentRole === 'employer' ? 'التبديل لحساب الموظف' : 'التبديل لحساب الشركة'}
            </span>
         </button>
      </div>

      {/* Bottom Interactive Area */}
      <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center pb-xl pointer-events-none">
        
        {/* Dynamic AI Chat Popover */}
        {isChatOpen && (
          <div className="mb-md w-[800px] h-[500px] pointer-events-auto transform transition-transform duration-300 animate-in slide-in-from-bottom-8 fade-in flex flex-col glass-panel rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/20 overflow-hidden relative">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/[0.02]">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary-fixed/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed shadow-[0_0_15px_rgba(218,226,253,0.1)]">
                   <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                 </div>
                 <div>
                   <h3 className="font-label-md text-white font-bold tracking-wide">المساعد الذكي</h3>
                   <p className="font-body-sm text-secondary-container text-xs flex items-center gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span> متصل
                   </p>
                 </div>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-outline-variant transition-colors" title="إغلاق">
                 <span className="material-symbols-outlined text-[20px]">close</span>
               </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-6 scrollbar-hide">
               {chatMessages.map((msg, idx) => (
                  msg.role === 'ai' ? (
                     <div key={idx} className="flex gap-4 max-w-[85%] self-start transform transition-all animate-in fade-in slide-in-from-right-4">
                       <div className="w-8 h-8 mt-1 rounded-full bg-primary-fixed/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed shrink-0">
                         <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                       </div>
                       <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm p-4 text-white font-body-sm leading-relaxed shadow-sm">
                          {msg.content}
                       </div>
                     </div>
                  ) : (
                     <div key={idx} className="flex gap-4 max-w-[85%] self-end flex-row-reverse transform transition-all animate-in fade-in slide-in-from-left-4">
                       <div className="w-8 h-8 mt-1 rounded-full bg-secondary-container/20 border border-secondary-container/30 flex items-center justify-center text-secondary-container shrink-0">
                         <span className="material-symbols-outlined text-[16px]">person</span>
                       </div>
                       <div className="bg-secondary-container/90 text-on-secondary-container rounded-2xl rounded-tl-sm p-4 text-sm font-medium leading-relaxed shadow-md">
                          {msg.content}
                       </div>
                     </div>
                  )
               ))}
               {isTyping && (
                 <div className="flex gap-4 max-w-[80%] self-start">
                   <div className="w-8 h-8 mt-1 rounded-full bg-primary-fixed/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed shrink-0">
                     <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm p-4 h-12 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                      <span className="w-1.5 h-1.5 bg-outline-variant rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                   </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Combined Navigation and Chat Bar */}
        <div className="flex items-center justify-center pointer-events-auto">
          <div className="glass-panel rounded-full flex items-center p-2 w-[800px] border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-xl">
            {/* Nav Group 1 (Dashboard, Bulk Pay, Employees) */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
               {currentRole === 'employer' ? (
                 <>
                    <button onClick={() => setCurrentView('dashboard')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${currentView === 'dashboard' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">dashboard</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الرئيسية</span>
                    </button>
                    <button onClick={() => setCurrentView('bulk_pay')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${currentView === 'bulk_pay' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">account_balance</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الدفع الجماعي</span>
                    </button>
                    <button onClick={() => setCurrentView('employees')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${currentView === 'employees' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">groups</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">إدارة الموظفين</span>
                    </button>
                 </>
               ) : (
                 <>
                    <button onClick={() => setEmployeeView('dashboard')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${employeeView === 'dashboard' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">dashboard</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الرئيسية</span>
                    </button>
                 </>
               )}
            </div>

            <div className="w-px h-8 bg-white/10 mx-2 shrink-0"></div>

            {/* Chat Input */}
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-outline-variant hover:text-white hover:bg-white/10 transition-colors shrink-0">
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <input 
              className="flex-grow bg-transparent border-none text-white font-body-sm focus:ring-0 outline-none placeholder-outline-variant px-md h-full rtl:text-right min-w-0" 
              dir="rtl" 
              placeholder="اسأل المساعد الذكي أو ادخل أمرًا..." 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              onClick={() => { if (!isChatOpen) setIsChatOpen(true); }}
            />
            <button 
              onClick={handleSendMessage}
              className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center transition-colors shrink-0 mr-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              <span className="material-symbols-outlined text-[20px] rtl:-scale-x-100">send</span>
            </button>

            <div className="w-px h-8 bg-white/10 mx-2 shrink-0"></div>

            {/* Nav Group 2 (Wallet, Settings) */}
            <div className="flex items-center gap-1 shrink-0 mr-2">
               {currentRole === 'employer' ? (
                 <>
                    <div className="relative flex items-center justify-center">
                      <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${isNotificationsOpen ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                         <span className="material-symbols-outlined text-[20px]">notifications</span>
                         {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-error-container rounded-full border border-black pointer-events-none"></span>}
                         <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الإشعارات</span>
                      </button>
                      {isNotificationsOpen && (
                        <div className="absolute bottom-[calc(100%+16px)] left-0 min-w-[320px] max-w-[360px] glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/20 animate-in slide-in-from-bottom-2 fade-in z-50 text-right" dir="rtl">
                           <div className="flex justify-between items-center border-b border-white/10 pb-2">
                             <h3 className="font-label-md text-white">الإشعارات</h3>
                             {unreadCount > 0 && (
                               <button onClick={() => setNotifications(n => n.map(x => ({...x, unread: false})))} className="text-xs text-primary-fixed hover:underline">تحديد الكل مقروء</button>
                             )}
                           </div>
                           <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto scrollbar-hide">
                              {notifications.length === 0 ? (
                                 <div className="text-center text-outline-variant text-[13px] py-6">لا توجد إشعارات</div>
                              ) : notifications.map((n, i) => (
                                <div key={i} className={`p-3 rounded-xl flex items-start gap-3 ${n.unread ? 'bg-white/10' : 'bg-white/5'} hover:bg-white/10 transition-colors cursor-pointer group`}>
                                   <div className={`w-9 h-9 mt-0.5 rounded-full flex items-center justify-center shrink-0 border ${
                                     n.type === 'success' ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/30' : 
                                     n.type === 'warning' ? 'bg-orange-400/20 text-orange-400 border-orange-400/30' : 'bg-primary-fixed/20 text-primary-fixed border-primary-fixed/30'
                                   }`}>
                                     <span className="material-symbols-outlined text-[18px]">
                                       {n.type === 'success' ? 'check_circle' : n.type === 'warning' ? 'error' : 'info'}
                                     </span>
                                   </div>
                                   <div className="flex-grow">
                                     <div className="font-label-md text-white text-[13px] mb-1 group-hover:text-primary-fixed transition-colors">{n.title}</div>
                                     <div className="font-body-sm text-outline-variant text-[12px] mb-1.5 leading-snug">{n.description}</div>
                                     <div className="text-[10px] text-white/50 font-data-tabular">{n.time}</div>
                                   </div>
                                   {n.unread && <div className="w-1.5 h-1.5 bg-secondary-container rounded-full shrink-0 mt-2"></div>}
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setCurrentView('wallet')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${currentView === 'wallet' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">wallet</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">محفظة الشركة</span>
                    </button>
                    <button onClick={() => setCurrentView('settings')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${currentView === 'settings' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">settings</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الإعدادات</span>
                    </button>
                 </>
               ) : (
                 <>
                    <div className="relative flex items-center justify-center">
                      <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${isNotificationsOpen ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                         <span className="material-symbols-outlined text-[20px]">notifications</span>
                         {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-error-container rounded-full border border-black pointer-events-none"></span>}
                         <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الإشعارات</span>
                      </button>
                      {/* Notifications dropdown logic is reused identically */}
                      {isNotificationsOpen && (
                        <div className="absolute bottom-[calc(100%+16px)] left-0 min-w-[320px] max-w-[360px] glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/20 animate-in slide-in-from-bottom-2 fade-in z-50 text-right" dir="rtl">
                           <div className="flex justify-between items-center border-b border-white/10 pb-2">
                             <h3 className="font-label-md text-white">الإشعارات</h3>
                             {unreadCount > 0 && (
                               <button onClick={() => setNotifications(n => n.map(x => ({...x, unread: false})))} className="text-xs text-primary-fixed hover:underline">تحديد الكل مقروء</button>
                             )}
                           </div>
                           <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto scrollbar-hide">
                              {notifications.length === 0 ? (
                                 <div className="text-center text-outline-variant text-[13px] py-6">لا توجد إشعارات</div>
                              ) : notifications.map((n, i) => (
                                <div key={i} className={`p-3 rounded-xl flex items-start gap-3 ${n.unread ? 'bg-white/10' : 'bg-white/5'} hover:bg-white/10 transition-colors cursor-pointer group`}>
                                   <div className={`w-9 h-9 mt-0.5 rounded-full flex items-center justify-center shrink-0 border ${
                                     n.type === 'success' ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/30' : 
                                     n.type === 'warning' ? 'bg-orange-400/20 text-orange-400 border-orange-400/30' : 'bg-primary-fixed/20 text-primary-fixed border-primary-fixed/30'
                                   }`}>
                                     <span className="material-symbols-outlined text-[18px]">
                                       {n.type === 'success' ? 'check_circle' : n.type === 'warning' ? 'error' : 'info'}
                                     </span>
                                   </div>
                                   <div className="flex-grow">
                                     <div className="font-label-md text-white text-[13px] mb-1 group-hover:text-primary-fixed transition-colors">{n.title}</div>
                                     <div className="font-body-sm text-outline-variant text-[12px] mb-1.5 leading-snug">{n.description}</div>
                                     <div className="text-[10px] text-white/50 font-data-tabular">{n.time}</div>
                                   </div>
                                   {n.unread && <div className="w-1.5 h-1.5 bg-secondary-container rounded-full shrink-0 mt-2"></div>}
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setEmployeeView('wallet')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${employeeView === 'wallet' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">wallet</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">محفظتي</span>
                    </button>
                    <button onClick={() => setEmployeeView('settings')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${employeeView === 'settings' ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                       <span className="material-symbols-outlined text-[20px]">settings</span>
                       <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الإعدادات</span>
                    </button>
                 </>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in pointer-events-auto">
          <div className="glass-panel rounded-2xl p-4 flex gap-4 w-auto min-w-[300px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/20 bg-black/60 backdrop-blur-xl">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
              toastNotification.type === 'success' ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/30' : 
              toastNotification.type === 'warning' ? 'bg-orange-400/20 text-orange-400 border-orange-400/30' : 'bg-primary-fixed/20 text-primary-fixed border-primary-fixed/30'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {toastNotification.type === 'success' ? 'check_circle' : toastNotification.type === 'warning' ? 'error' : 'info'}
              </span>
            </div>
            <div className="flex-grow pr-1 text-right">
              <h4 className="font-label-md text-white mb-1">{toastNotification.title}</h4>
              <p className="font-body-sm text-outline-variant text-[13px]">{toastNotification.description}</p>
            </div>
            <button onClick={() => setToastNotification(null)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-outline-variant hover:text-white transition-colors self-start shrink-0 mr-2 -mt-1 -ml-1">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Background Elements for Depth */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-secondary-container/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary-fixed/5 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
}
