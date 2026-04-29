'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ModalSystem from './ModalSystem';
import { ModalProvider } from './ModalContext';

import NavItem from './NavItem';
import NotificationsDropdown, { type NotificationType } from './NotificationsDropdown';
import ToastNotification from './ToastNotification';
import ChatPanel from './ChatPanel';

// ─── Main AppShell ──────────────────────────────────────────────────────────────
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'مرحباً بك! أنا المساعد الذكي لمنصة Pay. كيف يمكنني مساعدتك لإنهاء مهام الرواتب اليوم؟' }
  ]);

  const [notifications, setNotifications] = useState<NotificationType[]>([
    { id: 1, title: 'تم تأكيد الدفع', description: 'تم تحويل رواتب شهر أكتوبر بنجاح', time: 'منذ ١٠ دقائق', unread: false, type: 'success' },
    { id: 2, title: 'إيداع مكتمل', description: 'تم إيداع مبلغ 2,000,000 ر.س في محفظة الشركة', time: 'منذ ساعتين', unread: false, type: 'info' }
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<NotificationType | null>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Role detection
  const isEmployeeRole = pathname === '/employee' || pathname.startsWith('/employee/');

  // Active nav detection
  const getActiveNav = () => {
    if (isEmployeeRole) {
      if (pathname === '/employee') return 'dashboard';
      if (pathname === '/employee/wallet') return 'wallet';
      if (pathname === '/employee/settings') return 'settings';
      return 'dashboard';
    }
    if (pathname === '/' || pathname === '/employees') return 'dashboard';
    if (pathname === '/employees/bulk-pay') return 'bulk_pay';
    if (pathname === '/employees/wallet') return 'wallet';
    if (pathname === '/employees/settings') return 'settings';
    return 'dashboard';
  };

  const activeNav = getActiveNav();

  // Simulated live notification
  useEffect(() => {
    const timer = setTimeout(() => {
      const newNotif: NotificationType = {
        id: Date.now(),
        title: 'مهمة معلقة جديدة',
        description: 'طلب إجازة/سلفة جديد في انتظار مراجعتك.',
        time: 'الآن',
        unread: true,
        type: 'warning'
      };
      setNotifications(prev => [newNotif, ...prev]);
      setToastNotification(newNotif);
      setTimeout(() => setToastNotification(null), 6000);
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

  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col font-body-md overflow-hidden text-on-background w-full">
        <ModalSystem />

        {/* Main Content */}
        <main className="flex-grow flex items-stretch justify-center p-gutter pt-xl pb-[220px] relative z-10 w-full overflow-hidden">
          {children}
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
        {toastNotification && (
          <ToastNotification notification={toastNotification} onClose={() => setToastNotification(null)} />
        )}

        {/* Background Depth */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-secondary-container/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary-fixed/5 rounded-full blur-[150px]"></div>
        </div>
      </div>
    </ModalProvider>
  );
}
