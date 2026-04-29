import type { NotificationType } from './NotificationsDropdown';

export default function ToastNotification({ notification, onClose }: { notification: NotificationType; onClose: () => void }) {
  return (
    <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in pointer-events-auto">
      <div className="glass-panel rounded-2xl p-4 flex gap-4 w-auto min-w-[300px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/20 bg-black/60 backdrop-blur-xl">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
          notification.type === 'success' ? 'bg-secondary-container/20 text-secondary-container border-secondary-container/30' :
          notification.type === 'warning' ? 'bg-orange-400/20 text-orange-400 border-orange-400/30' : 'bg-primary-fixed/20 text-primary-fixed border-primary-fixed/30'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {notification.type === 'success' ? 'check_circle' : notification.type === 'warning' ? 'error' : 'info'}
          </span>
        </div>
        <div className="flex-grow pr-1 text-right">
          <h4 className="font-label-md text-white mb-1">{notification.title}</h4>
          <p className="font-body-sm text-outline-variant text-[13px]">{notification.description}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-outline-variant hover:text-white transition-colors self-start shrink-0 mr-2 -mt-1 -ml-1">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
