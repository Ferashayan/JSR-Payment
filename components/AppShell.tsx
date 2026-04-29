'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ModalSystem from './ModalSystem';
import { ModalProvider } from './ModalContext';
import { AppProvider, useApp } from './AppContext';

import NavItem from './NavItem';
import NotificationsDropdown, { type NotificationType } from './NotificationsDropdown';
import ToastNotification from './ToastNotification';
import ChatPanel from './ChatPanel';

// ─── AI Smart Response Engine ────────────────────────────────────────────────
const AI_RESPONSES: { keywords: string[]; response: string }[] = [
  { keywords: ['راتب', 'رواتب', 'مسير', 'payroll'], response: 'بحسب البيانات الحالية، إجمالي مسير الرواتب لهذا الشهر هو 1,940,200 ر.س لـ 142 موظفاً نشطاً. الدورة الحالية: أكتوبر 2023. هل تود مراجعة التفاصيل أو تصدير التقرير؟' },
  { keywords: ['موظف', 'موظفين', 'فريق', 'عدد'], response: 'لديك حالياً 142 موظفاً نشطاً عبر 3 أقسام: التطوير (45%)، المبيعات (30%)، والإدارة (25%). تم تعيين 5 موظفين جدد هذا الشهر. هل تود إضافة موظف جديد أو مراجعة قائمة الفريق؟' },
  { keywords: ['تحويل', 'دفع', 'تحويلات', 'إيداع', 'سحب'], response: 'يمكنني مساعدتك في إجراء التحويلات. الرصيد المتاح في محفظة الشركة: 209,800 ر.س. للتحويل الجماعي، توجه لصفحة "الدفع الجماعي" وارفع ملف CSV. للتحويل الفردي، اختر الموظف من صفحة إدارة الموظفين.' },
  { keywords: ['إجازة', 'إجازات', 'غياب'], response: 'يوجد حالياً طلب إجازة واحد قيد المراجعة. يمكنك الموافقة أو الرفض من صفحة المهام المعلقة. رصيد الإجازات المتبقي للموظف أحمد سالم: 15 يوم.' },
  { keywords: ['سلفة', 'قرض', 'استقطاع'], response: 'يمكن للموظفين طلب سلف نقدية من حساباتهم الشخصية. يتم خصم السلفة على 3-6 أقساط شهرية من الراتب. هل تود مراجعة طلبات السلف المعلقة؟' },
  { keywords: ['محفظة', 'رصيد', 'حساب'], response: 'رصيد محفظة الشركة الحالي: 209,800 ر.س. آخر عملية: صرف الرواتب بمبلغ 1,940,200 ر.س. يمكنك تغذية المحفظة أو تصدير كشف الحساب من صفحة المحفظة.' },
  { keywords: ['تقرير', 'تصدير', 'إحصائيات'], response: 'يمكنني تجهيز التقارير التالية: 📊 تقرير مسير الرواتب الشهري، 📋 كشف حساب المحفظة، 👥 تقرير الموظفين والأقسام، 📈 تحليل التكاليف. أي تقرير تود تصديره؟' },
  { keywords: ['مساعدة', 'help', 'كيف', 'شرح'], response: 'أنا المساعد الذكي لمنصة جسر Pay. يمكنني مساعدتك في:\n• إدارة الرواتب والمدفوعات\n• مراجعة بيانات الموظفين\n• تنفيذ التحويلات والدفع الجماعي\n• تصدير التقارير\n• الإجابة على استفساراتك المالية\n\nما الذي تحتاج مساعدة فيه؟' },
  { keywords: ['صرف', 'اعتماد', 'تنفيذ'], response: 'لاعتماد مسير الرواتب، تأكد من:\n1. ✅ مراجعة بيانات البصمة (3 مهام معلقة)\n2. ✅ إضافة الحسابات البنكية للموظفين الجدد\n3. ✅ كفاية رصيد المحفظة\n\nهل تود المتابعة في اعتماد المسير؟' },
];

function getAIResponse(input: string): string {
  const normalized = input.toLowerCase();
  for (const entry of AI_RESPONSES) {
    if (entry.keywords.some(kw => normalized.includes(kw))) {
      return entry.response;
    }
  }
  return 'شكراً لتواصلك! لقد قمت بتحليل طلبك. يمكنني مساعدتك في إدارة الرواتب، متابعة التحويلات، أو تصدير التقارير. أخبرني بالتفاصيل وسأقوم بالمتابعة فوراً.';
}

// ─── Main AppShell ──────────────────────────────────────────────────────────────
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'مرحباً بك! أنا المساعد الذكي لمنصة Pay. كيف يمكنني مساعدتك لإنهاء مهام الرواتب اليوم؟' }
  ]);

  // Role detection
  const isEmployeeRole = pathname === '/employee' || pathname.startsWith('/employee/');

  // --- Role-based notifications ---
  const [adminNotifications, setAdminNotifications] = useState<NotificationType[]>([
    { id: 1, title: 'تم تأكيد الدفع', description: 'تم تحويل رواتب شهر أكتوبر بنجاح لـ 142 موظف', time: 'منذ ١٠ دقائق', unread: false, type: 'success' },
    { id: 2, title: 'إيداع مكتمل', description: 'تم إيداع مبلغ 2,000,000 ر.س في محفظة الشركة', time: 'منذ ساعتين', unread: false, type: 'info' },
  ]);
  const [employeeNotifications, setEmployeeNotifications] = useState<NotificationType[]>([
    { id: 10, title: 'تم إيداع الراتب', description: 'تم إيداع راتب شهر سبتمبر بمبلغ 24,500 ر.س', time: 'منذ يوم', unread: false, type: 'success' },
    { id: 11, title: 'طلب سلفة مقبول', description: 'تمت الموافقة على طلب السلفة بمبلغ 5,000 ر.س', time: 'منذ أسبوع', unread: false, type: 'info' },
  ]);

  const notifications = isEmployeeRole ? employeeNotifications : adminNotifications;
  const setNotifications = isEmployeeRole ? setEmployeeNotifications : setAdminNotifications;

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<NotificationType | null>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Active nav detection
  const getActiveNav = () => {
    if (isEmployeeRole) {
      if (pathname === '/employee') return 'dashboard';
      if (pathname === '/employee/wallet') return 'wallet';
      if (pathname === '/employee/settings') return 'settings';
      return 'dashboard';
    }
    if (pathname === '/') return 'dashboard';
    if (pathname === '/employees') return 'employees';
    if (pathname === '/employees/bulk-pay') return 'bulk_pay';
    if (pathname === '/employees/wallet') return 'wallet';
    if (pathname === '/employees/settings') return 'settings';
    return 'dashboard';
  };

  const activeNav = getActiveNav();

  // Stable ID counter
  const notifIdRef = useRef(100);

  // Simulated live admin notification
  useEffect(() => {
    const timer = setTimeout(() => {
      notifIdRef.current += 1;
      const adminNotif: NotificationType = {
        id: notifIdRef.current,
        title: 'طلب إجازة جديد',
        description: 'الموظف أحمد سالم قدم طلب إجازة سنوية بانتظار موافقتك.',
        time: 'الآن',
        unread: true,
        type: 'warning'
      };
      setAdminNotifications(prev => [adminNotif, ...prev]);
      setToastNotification(adminNotif);
      setTimeout(() => setToastNotification(null), 6000);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleNotificationClick = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setIsNotificationsOpen(false);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatOpen(true);
    setIsTyping(true);
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        role: 'ai',
        content: getAIResponse(userMessage)
      }]);
    }, delay);
  };

  return (
    <AppProvider>
    <ModalProvider>
      <div className="min-h-screen flex flex-col font-body-md overflow-hidden text-on-background w-full">
        <ModalSystem />
        <GlobalToasts />

        {/* Main Content */}
        <main className="flex-grow flex items-stretch justify-center p-gutter pt-xl pb-[220px] relative z-10 w-full overflow-hidden">
          <div key={pathname} className="w-full flex items-stretch justify-center page-fade-in">
            {children}
          </div>
        </main>

        {/* Role Toggle */}
        <div className="fixed top-1/2 left-6 -translate-y-1/2 z-50 pointer-events-auto">
          <Link
            href={isEmployeeRole ? '/' : '/employee'}
            prefetch={true}
            className="glass-panel p-3 rounded-full flex flex-col gap-2 items-center text-white border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-white/10 hover:scale-105 active:scale-95 transition-all group"
          >
            <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
            <span className="font-label-sm whitespace-nowrap opacity-0 group-hover:opacity-100 absolute left-full ml-4 bg-black/80 px-3 py-1.5 rounded border border-white/10 pointer-events-none transition-opacity">
              {isEmployeeRole ? 'التبديل لحساب الشركة' : 'التبديل لحساب الموظف'}
            </span>
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center pb-xl pointer-events-none">

          {/* Chat Panel */}
          {isChatOpen && (
            <ChatPanel messages={chatMessages} isTyping={isTyping} onClose={() => setIsChatOpen(false)} />
          )}

          {/* Navigation + Chat Input Bar */}
          <div className="flex items-center justify-center pointer-events-auto">
            <div className="glass-panel rounded-full flex items-center p-2 w-[800px] border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-xl">

              {/* Nav Left */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {!isEmployeeRole ? (
                  <>
                    <NavItem href="/" icon="dashboard" label="الرئيسية" isActive={activeNav === 'dashboard'} />
                    <NavItem href="/employees/bulk-pay" icon="account_balance" label="الدفع الجماعي" isActive={activeNav === 'bulk_pay'} />
                    <NavItem href="/employees" icon="groups" label="إدارة الموظفين" isActive={activeNav === 'employees'} />
                  </>
                ) : (
                  <NavItem href="/employee" icon="dashboard" label="الرئيسية" isActive={activeNav === 'dashboard'} />
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
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                onClick={() => { if (!isChatOpen) setIsChatOpen(true); }}
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center transition-colors shrink-0 mr-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                <span className="material-symbols-outlined text-[20px] rtl:-scale-x-100">send</span>
              </button>

              <div className="w-px h-8 bg-white/10 mx-2 shrink-0"></div>

              {/* Nav Right */}
              <div className="flex items-center gap-1 shrink-0 mr-2">
                {/* Notifications */}
                <div className="relative flex items-center justify-center">
                  <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all group relative ${isNotificationsOpen ? 'bg-white/15 text-primary-fixed shadow-inner' : 'text-outline-variant hover:bg-white/10 hover:text-white'}`}>
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-error-container rounded-full border border-black pointer-events-none"></span>}
                    <span className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">الإشعارات</span>
                  </button>
                  {isNotificationsOpen && (
                    <NotificationsDropdown
                      notifications={notifications}
                      onMarkAllRead={() => setNotifications(n => n.map(x => ({ ...x, unread: false })))}
                      onNotificationClick={handleNotificationClick}
                    />
                  )}
                </div>

                {!isEmployeeRole ? (
                  <>
                    <NavItem href="/employees/wallet" icon="wallet" label="محفظة الشركة" isActive={activeNav === 'wallet'} />
                    <NavItem href="/employees/settings" icon="settings" label="الإعدادات" isActive={activeNav === 'settings'} />
                  </>
                ) : (
                  <>
                    <NavItem href="/employee/wallet" icon="wallet" label="محفظتي" isActive={activeNav === 'wallet'} />
                    <NavItem href="/employee/settings" icon="settings" label="الإعدادات" isActive={activeNav === 'settings'} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toastNotification && !isEmployeeRole && (
          <ToastNotification notification={toastNotification} onClose={() => setToastNotification(null)} />
        )}

        {/* Background Depth */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-secondary-container/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary-fixed/5 rounded-full blur-[150px]"></div>
        </div>
      </div>
    </ModalProvider>
    </AppProvider>
  );
}

// ─── Global Toast Renderer ──────────────────────────────────────────────────
function GlobalToasts() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 pointer-events-auto" dir="rtl">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`glass-panel rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[320px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border animate-in slide-in-from-bottom-2 fade-in ${
            toast.type === 'success' ? 'border-secondary-container/30 bg-secondary-container/10' :
            toast.type === 'error' ? 'border-error-container/30 bg-error-container/10' :
            toast.type === 'warning' ? 'border-orange-400/30 bg-orange-400/10' :
            'border-primary-fixed/30 bg-primary-fixed/10'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === 'success' ? 'bg-secondary-container/20 text-secondary-container' :
            toast.type === 'error' ? 'bg-error-container/20 text-error-container' :
            toast.type === 'warning' ? 'bg-orange-400/20 text-orange-400' :
            'bg-primary-fixed/20 text-primary-fixed'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'info'}
            </span>
          </div>
          <span className="font-body-sm text-white flex-1">{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className="text-outline-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
