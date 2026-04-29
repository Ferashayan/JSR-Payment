export default function ChatPanel({ messages, isTyping, onClose }: {
  messages: { role: string; content: string }[];
  isTyping: boolean;
  onClose: () => void;
}) {
  return (
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
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-outline-variant transition-colors" title="إغلاق">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-6 scrollbar-hide">
        {messages.map((msg, idx) => (
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
  );
}
