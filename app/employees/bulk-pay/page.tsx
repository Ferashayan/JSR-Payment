'use client';
import { useState, useRef } from 'react';
import { useApp } from '@/components/AppContext';

export default function BulkPayPage() {
  const { companyBalance, showToast, bulkPayResults, setBulkPayResults, executeBulkPay, bulkPayExecuted } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        const text = e.target?.result as string;
        if (text) {
          try {
            const lines = text.split('\n').filter(l => l.trim());
            const rows = lines.slice(1).map(line => {
              const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
              const amount = parseFloat(cols[2]) || 0;
              const hasError = !cols[3] || cols[3].toLowerCase().includes('invalid') || cols[3].toLowerCase().includes('غير');
              return {
                name: cols[0] || 'غير معروف',
                country: cols[1] || 'غير محدد',
                flag: cols[1]?.includes('سعود') ? '🇸🇦' : cols[1]?.includes('مصر') ? '🇪🇬' : cols[1]?.includes('أمري') ? '🇺🇸' : cols[1]?.includes('بريطان') ? '🇬🇧' : '🌍',
                amount,
                method: hasError ? 'رقم حساب غير صالح' : (cols[3] || 'تحويل بنكي مباشر'),
                valid: !hasError && amount > 0,
                error: hasError ? 'بيانات الحساب غير مكتملة' : undefined,
              };
            });
            setBulkPayResults(rows);
            showToast(`تم تحليل ${rows.length} سجل من الملف`, 'info');
          } catch {
            showToast('خطأ في قراءة الملف. تأكد من صيغة CSV الصحيحة.', 'error');
          }
        }
        setIsProcessing(false);
      }, 1200);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleExecute = () => {
    const validCount = bulkPayResults.filter(r => r.valid).length;
    const total = bulkPayResults.filter(r => r.valid).reduce((s, r) => s + r.amount, 0);
    if (total > companyBalance) {
      showToast('رصيد المحفظة غير كافٍ لتنفيذ التحويل', 'error');
      return;
    }
    setIsExecuting(true);
    setTimeout(() => {
      executeBulkPay();
      setIsExecuting(false);
      showToast(`تم تحويل الرواتب بنجاح لـ ${validCount} موظف بمبلغ ${total.toLocaleString()} ر.س`);
    }, 2000);
  };

  const validTotal = bulkPayResults.filter(r => r.valid).reduce((s, r) => s + r.amount, 0);
  const validCount = bulkPayResults.filter(r => r.valid).length;
  const invalidCount = bulkPayResults.filter(r => !r.valid).length;

  // If no file uploaded yet, show demo data
  const showingResults = bulkPayResults.length > 0;

  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-secondary-container/5 blur-3xl rounded-full z-[-1]"></div>
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4"><span className="font-body-sm text-outline-variant">رصيد محفظة الشركة</span><span className="material-symbols-outlined text-primary-fixed opacity-70 group-hover:opacity-100 transition-opacity">account_balance_wallet</span></div>
          <div><div className="font-h3 text-white">{companyBalance.toLocaleString()}<span className="font-body-sm text-outline-variant"> ر.س</span></div></div>
        </div>
        {showingResults && (
          <div className="glass-panel rounded-xl p-md flex flex-col gap-3">
            <div className="flex justify-between"><span className="text-xs text-outline-variant">صالح</span><span className="text-xs text-secondary-container font-bold">{validCount}</span></div>
            <div className="flex justify-between"><span className="text-xs text-outline-variant">خطأ</span><span className="text-xs text-error-container font-bold">{invalidCount}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-xs text-outline-variant">الإجمالي</span><span className="text-xs text-white font-bold">{validTotal.toLocaleString()} ر.س</span></div>
          </div>
        )}
        <div className="glass-panel rounded-xl p-md flex flex-col flex-1 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10"><span className="font-body-sm text-white font-medium">حاسبة التوفير السريعة</span><span className="material-symbols-outlined text-secondary-container">calculate</span></div>
          <div className="flex flex-col gap-3 relative z-10">
            <input type="text" placeholder="المبلغ بالدولار" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-data-tabular outline-none focus:border-secondary-container transition" defaultValue="10000" />
            <div className="flex justify-between items-center text-sm"><span className="text-outline-variant">المبلغ بالريال</span><span className="text-white font-data-tabular">37,580 ر.س</span></div>
            <div className="flex justify-between items-center text-sm"><span className="text-outline-variant">التوفير المتوقع</span><span className="text-secondary-container font-data-tabular font-bold">+280 ر.س</span></div>
          </div>
        </div>
      </div>
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-xl relative z-10"><div><h1 className="font-h2 text-white mb-xs glow-text">الدفع الجماعي</h1><p className="font-body-sm text-outline-variant">رفع وتدقيق ملفات مسير الرواتب</p></div></div>
        <div className="grow flex flex-col gap-6 relative z-10">
          {/* Upload Area */}
          <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-white/20 rounded-2xl p-10 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/5 hover:border-secondary-container/50 transition-all cursor-pointer group">
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
            {isProcessing ? (
              <>
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4"><span className="material-symbols-outlined text-[40px] text-secondary-container animate-spin">progress_activity</span></div>
                <h3 className="font-label-md text-white mb-2">جارِ تحليل الملف...</h3>
                <p className="font-body-sm text-outline-variant">{fileName}</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[40px] text-outline-variant group-hover:text-secondary-container transition-colors">cloud_upload</span></div>
                <h3 className="font-label-md text-white mb-2">{fileName || 'اسحب وأفلت ملف إكسيل هنا'}</h3>
                <p className="font-body-sm text-outline-variant mb-6">صيغة CSV: الاسم، الدولة، المبلغ، طريقة الدفع</p>
                <button className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-label-md hover:bg-white/20 transition-colors">تصفح الملفات</button>
              </>
            )}
          </div>

          {/* Results Table */}
          {showingResults && (
            <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col grow overflow-hidden shadow-sm">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-label-md text-white">معاينة: {fileName} ({bulkPayResults.length} سجل)</h3>
                <button disabled={bulkPayExecuted || isExecuting} onClick={handleExecute} className="px-4 py-2 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm flex items-center gap-2 hover:bg-secondary-fixed transition disabled:opacity-50 shadow-[0_0_15px_rgba(108,248,187,0.3)]">
                  {isExecuting ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">fact_check</span>}
                  {bulkPayExecuted ? 'تم التحويل ✓' : isExecuting ? 'جارِ التحويل...' : 'بدء التحويل'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-white/[0.02] border-b border-white/10 font-label-sm text-outline-variant">
                    <tr><th className="px-6 py-4 font-medium">اسم الموظف</th><th className="px-6 py-4 font-medium">الدولة</th><th className="px-6 py-4 font-medium">المبلغ المستحق</th><th className="px-6 py-4 font-medium">وسيلة الدفع</th><th className="px-6 py-4 font-medium text-left">التحقق</th></tr>
                  </thead>
                  <tbody className="font-body-sm text-white divide-y divide-white/5">
                    {bulkPayResults.map((row, i) => (
                      <tr key={i} className={`hover:bg-white/5 transition-colors ${!row.valid ? 'bg-error-container/5' : ''}`}>
                        <td className="px-6 py-4 font-medium">{row.name}</td>
                        <td className="px-6 py-4"><span className="flex items-center gap-2">{row.flag} {row.country}</span></td>
                        <td className="px-6 py-4 font-data-tabular">{row.amount.toLocaleString()} <span className="text-xs text-outline-variant">ر.س</span></td>
                        <td className={`px-6 py-4 ${!row.valid ? 'text-error-container' : 'text-outline-variant'}`}>{row.method}</td>
                        <td className="px-6 py-4 text-left"><span className={`material-symbols-outlined ${row.valid ? 'text-secondary-container' : 'text-error'}`}>{row.valid ? 'check_circle' : 'cancel'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Default demo table when no file uploaded */}
          {!showingResults && !isProcessing && (
            <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col grow overflow-hidden shadow-sm">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-label-md text-white">مثال: Payroll_Oct_2023.xlsx</h3>
                <span className="text-xs text-outline-variant">ارفع ملف CSV لبدء العملية</span>
              </div>
              <div className="p-8 text-center text-outline-variant font-body-sm">ارفع ملف CSV يحتوي على: اسم الموظف، الدولة، المبلغ، طريقة الدفع</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
