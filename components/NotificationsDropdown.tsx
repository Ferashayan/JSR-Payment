export type NotificationType = {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'success' | 'warning' | 'info';
};

export default function NotificationsDropdown({ notifications, onMarkAllRead }: { notifications: NotificationType[]; onMarkAllRead: () => void }) {
  const unreadCount = notifications.filter(n => n.unread).length;
  return (
    <div className="absolute bottom-[calc(100%+16px)] left-0 min-w-[320px] max-w-[360px] glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/20 animate-in slide-in-from-bottom-2 fade-in z-50 text-right" dir="rtl">
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h3 className="font-label-md text-white">الإشعارات</h3>
        {unreadCount > 0 && (
          <button onClick={onMarkAllRead} className="text-xs text-primary-fixed hover:underline">تحديد الكل مقروء</button>
        )}
      </div>
      <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <div className="text-center text-outline-variant text-[13px] py-6">لا توجد إشعارات</div>
        ) : notifications.map((n) => (
          <div key={n.id} className={`p-3 rounded-xl flex items-start gap-3 ${n.unread ? 'bg-white/10' : 'bg-white/5'} hover:bg-white/10 transition-colors cursor-pointer group`}>
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
  );
}
