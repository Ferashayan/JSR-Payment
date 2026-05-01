'use client';
import { useState, useRef, useMemo } from 'react';
import { useApp, type Employee } from '@/components/AppContext';

interface PayrollRow {
  id: number;
  name: string;
  country: string;
  flag: string;
  department: string;
  position: string;
  baseSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  gosiDeduction: number;
  otherDeductions: number;
  netPay: number;
  method: string;
  valid: boolean;
  error?: string;
  isExternal?: boolean;
}

function buildPayrollFromEmployee(emp: Employee): PayrollRow {
  const housing = Math.round(emp.salary * 0.25);
  const transport = Math.round(emp.salary * 0.10);
  const gosi = Math.round(emp.salary * 0.0975);
  const other = 0;
  const net = emp.salary + housing + transport - gosi - other;
  return {
    id: emp.id,
    name: emp.name,
    country: emp.country,
    flag: emp.flag,
    department: emp.department,
    position: emp.position,
    baseSalary: emp.salary,
    housingAllowance: housing,
    transportAllowance: transport,
    gosiDeduction: gosi,
    otherDeductions: other,
    netPay: net,
    method: emp.wallet,
    valid: !emp.isFrozen,
    error: emp.isFrozen ? 'حساب مجمّد' : undefined,
    isExternal: false,
  };
}

function buildPayrollFromCSV(cols: string[], idx: number): PayrollRow {
  const name = cols[0] || 'غير معروف';
  const country = cols[1] || 'غير محدد';
  const base = parseFloat(cols[2]) || 0;
  const dept = cols[3] || 'غير محدد';
  const position = cols[4] || 'غير محدد';
  const method = cols[5] || 'تحويل بنكي';
  const hasError = !method || method.toLowerCase().includes('invalid') || method.includes('غير');
  const housing = Math.round(base * 0.25);
  const transport = Math.round(base * 0.10);
  const gosi = Math.round(base * 0.0975);
  const net = base + housing + transport - gosi;
  const flag = country.includes('سعود') ? '🇸🇦' : country.includes('مصر') ? '🇪🇬' : country.includes('أمري') ? '🇺🇸' : country.includes('بريطان') ? '🇬🇧' : country.includes('إمارات') ? '🇦🇪' : '🌍';
  return {
    id: -(idx + 1),
    name, country, flag, department: dept, position,
    baseSalary: base, housingAllowance: housing, transportAllowance: transport,
    gosiDeduction: gosi, otherDeductions: 0, netPay: net,
    method: hasError ? 'طريقة دفع غير صالحة' : method,
    valid: !hasError && base > 0,
    error: hasError ? 'بيانات غير مكتملة' : (base <= 0 ? 'مبلغ غير صالح' : undefined),
    isExternal: true,
  };
}

export default function BulkPayPage() {
  const { employees, companyBalance, showToast, companyWithdraw } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [externalRows, setExternalRows] = useState<PayrollRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<'employees' | 'external'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBreakdown, setShowBreakdown] = useState<number | null>(null);

  // Build payroll rows from context employees
  const employeeRows = useMemo(() => employees.map(buildPayrollFromEmployee), [employees]);

  // Combined or filtered view
  const displayRows = activeTab === 'employees' ? employeeRows : externalRows;
  const filteredRows = displayRows.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Selection helpers
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const validIds = filteredRows.filter(r => r.valid).map(r => r.id);
    const allSelected = validIds.every(id => selectedIds.has(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      validIds.forEach(id => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  };

  // Calculate totals for selected
  const selectedRows = [...employeeRows, ...externalRows].filter(r => selectedIds.has(r.id) && r.valid);
  const totalBase = selectedRows.reduce((s, r) => s + r.baseSalary, 0);
  const totalHousing = selectedRows.reduce((s, r) => s + r.housingAllowance, 0);
  const totalTransport = selectedRows.reduce((s, r) => s + r.transportAllowance, 0);
  const totalGosi = selectedRows.reduce((s, r) => s + r.gosiDeduction, 0);
  const totalNet = selectedRows.reduce((s, r) => s + r.netPay, 0);

  // CSV upload handler
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
            const rows = lines.slice(1).map((line, i) => {
              const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
              return buildPayrollFromCSV(cols, i);
            });
            setExternalRows(rows);
            setActiveTab('external');
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

  const [executed, setExecuted] = useState(false);

  const handleExecute = () => {
    if (selectedRows.length === 0) {
      showToast('يرجى اختيار موظفين أولاً', 'warning');
      return;
    }
    if (totalNet > companyBalance) {
      showToast('رصيد المحفظة غير كافٍ لتنفيذ التحويل', 'error');
      return;
    }
    setIsExecuting(true);
    setTimeout(() => {
      // Deduct directly from company balance
      companyWithdraw(totalNet, `صرف رواتب جماعي - ${selectedRows.length} موظف`);
      setIsExecuting(false);
      setExecuted(true);
      showToast(`تم تحويل الرواتب بنجاح لـ ${selectedRows.length} موظف بمبلغ ${totalNet.toLocaleString()} ر.س`);
    }, 2000);
  };

  const downloadTemplate = () => {
    const header = 'الاسم,الدولة,الراتب الأساسي,القسم,المسمى الوظيفي,طريقة الدفع';
    const sample = 'أحمد محمد,السعودية,15000,التطوير,مهندس برمجيات,تحويل بنكي';
    const blob = new Blob([header + '\n' + sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'payroll_template.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('تم تحميل نموذج CSV', 'info');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch">
      {/* ── Sidebar ── */}
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-secondary-container/5 blur-3xl rounded-full z-[-1]"></div>

        {/* Company Balance */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center flex-1 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">رصيد محفظة الشركة</span>
            <span className="material-symbols-outlined text-primary-fixed opacity-70 group-hover:opacity-100 transition-opacity">account_balance_wallet</span>
          </div>
          <div className="font-h3 text-white">{companyBalance.toLocaleString()}<span className="font-body-sm text-outline-variant"> ر.س</span></div>
          {totalNet > 0 && (
            <div className={`font-label-sm mt-2 ${totalNet > companyBalance ? 'text-error-container' : 'text-secondary-container'}`}>
              {totalNet > companyBalance ? '⚠ الرصيد غير كافٍ' : `✓ الرصيد كافٍ`}
            </div>
          )}
        </div>

        {/* Selection Summary */}
        {selectedRows.length > 0 && (
          <div className="glass-panel rounded-xl p-md flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-label-md text-white">ملخص الدفع</span>
              <span className="text-xs bg-secondary-container/20 text-secondary-container px-2 py-0.5 rounded-full font-bold">{selectedRows.length} موظف</span>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between"><span className="text-outline-variant">الرواتب الأساسية</span><span className="text-white font-data-tabular">{totalBase.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-outline-variant">بدل السكن</span><span className="text-secondary-container font-data-tabular">+{totalHousing.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-outline-variant">بدل النقل</span><span className="text-secondary-container font-data-tabular">+{totalTransport.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-outline-variant">خصم GOSI</span><span className="text-error-container font-data-tabular">-{totalGosi.toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-2 mt-1">
                <span className="text-white font-bold">صافي الدفع</span>
                <span className="text-white font-data-tabular font-bold">{totalNet.toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Calculator */}
        <div className="glass-panel rounded-xl p-md flex flex-col flex-1 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-body-sm text-white font-medium">إحصائيات</span>
            <span className="material-symbols-outlined text-secondary-container">bar_chart</span>
          </div>
          <div className="flex flex-col gap-3 relative z-10 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-outline-variant">إجمالي الموظفين</span>
              <span className="text-white font-data-tabular font-bold">{employees.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-outline-variant">نشط</span>
              <span className="text-secondary-container font-data-tabular">{employees.filter(e => !e.isFrozen).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-outline-variant">مجمّد</span>
              <span className="text-error-container font-data-tabular">{employees.filter(e => e.isFrozen).length}</span>
            </div>
            {externalRows.length > 0 && (
              <div className="flex justify-between items-center border-t border-white/10 pt-2">
                <span className="text-outline-variant">خارجي (CSV)</span>
                <span className="text-primary-fixed font-data-tabular">{externalRows.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-center mb-xl relative z-10">
          <div>
            <h1 className="font-h2 text-white mb-xs glow-text">الدفع الجماعي</h1>
            <p className="font-body-sm text-outline-variant">إدارة مسير الرواتب وحساب المستحقات</p>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={downloadTemplate} className="px-4 py-2 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>تحميل نموذج CSV
            </button>
            <button
              disabled={executed || isExecuting || selectedRows.length === 0}
              onClick={handleExecute}
              className="px-5 py-2.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-md flex items-center gap-2 hover:bg-secondary-fixed transition disabled:opacity-50 shadow-[0_0_15px_rgba(108,248,187,0.3)]"
            >
              {isExecuting ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">fact_check</span>}
              {executed ? 'تم التحويل ✓' : isExecuting ? 'جارِ التحويل...' : `تحويل (${selectedRows.length})`}
            </button>
          </div>
        </div>

        <div className="grow flex flex-col gap-5 relative z-10">
          {/* CSV Upload Area */}
          <div
            onDragOver={e => e.preventDefault()} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-white/15 rounded-2xl p-6 flex items-center justify-between bg-white/[0.02] hover:bg-white/5 hover:border-secondary-container/50 transition-all cursor-pointer group"
          >
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
            {isProcessing ? (
              <div className="flex items-center gap-4 w-full justify-center">
                <span className="material-symbols-outlined text-[28px] text-secondary-container animate-spin">progress_activity</span>
                <div><h3 className="font-label-md text-white">جارِ تحليل الملف...</h3><p className="font-body-sm text-outline-variant text-xs">{fileName}</p></div>
              </div>
            ) : (
              <div className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px] text-outline-variant group-hover:text-secondary-container transition-colors">cloud_upload</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-label-md text-white mb-1">{fileName || 'استيراد بيانات خارجية عبر CSV'}</h3>
                  <p className="font-body-sm text-outline-variant text-xs">صيغة CSV: الاسم، الدولة، الراتب، القسم، المسمى، طريقة الدفع</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/10 text-white font-label-sm hover:bg-white/20 transition-colors shrink-0">تصفح الملفات</button>
              </div>
            )}
          </div>

          {/* Tabs & Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              <button onClick={() => setActiveTab('employees')} className={`px-4 py-2 rounded-md font-label-sm transition-all flex items-center gap-2 ${activeTab === 'employees' ? 'bg-white/15 text-white shadow-sm' : 'text-outline-variant hover:text-white'}`}>
                <span className="material-symbols-outlined text-[16px]">group</span>الموظفون ({employeeRows.length})
              </button>
              <button onClick={() => setActiveTab('external')} className={`px-4 py-2 rounded-md font-label-sm transition-all flex items-center gap-2 ${activeTab === 'external' ? 'bg-white/15 text-white shadow-sm' : 'text-outline-variant hover:text-white'}`}>
                <span className="material-symbols-outlined text-[16px]">upload_file</span>خارجي ({externalRows.length})
              </button>
            </div>
            <div className="glass-panel flex items-center px-3 py-2 rounded-lg border border-white/10">
              <span className="material-symbols-outlined text-outline-variant text-[18px] ml-2">search</span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="بحث بالاسم أو القسم..." className="bg-transparent border-none outline-none text-white font-body-sm w-40" dir="rtl" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/5 rounded-2xl border border-white/10 flex flex-col grow overflow-hidden shadow-sm">
            <div className="overflow-x-auto grow">
              <table className="w-full text-right border-collapse min-w-[900px]">
                <thead className="bg-white/[0.03] border-b border-white/10 font-label-sm text-outline-variant sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-medium w-10">
                      <input type="checkbox" checked={filteredRows.filter(r => r.valid).length > 0 && filteredRows.filter(r => r.valid).every(r => selectedIds.has(r.id))} onChange={toggleSelectAll} className="accent-[#6cf8bb] w-4 h-4 cursor-pointer" />
                    </th>
                    <th className="px-4 py-3 font-medium">الموظف</th>
                    <th className="px-4 py-3 font-medium">القسم</th>
                    <th className="px-4 py-3 font-medium">الراتب الأساسي</th>
                    <th className="px-4 py-3 font-medium">البدلات</th>
                    <th className="px-4 py-3 font-medium">الخصومات</th>
                    <th className="px-4 py-3 font-medium">صافي الراتب</th>
                    <th className="px-4 py-3 font-medium">طريقة الدفع</th>
                    <th className="px-4 py-3 font-medium text-center w-16">الحالة</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-white divide-y divide-white/5">
                  {filteredRows.length === 0 ? (
                    <tr><td colSpan={9} className="px-6 py-12 text-center text-outline-variant">
                      {activeTab === 'external' ? 'لم يتم استيراد بيانات خارجية بعد. ارفع ملف CSV للبدء.' : 'لا توجد نتائج'}
                    </td></tr>
                  ) : filteredRows.map((row) => (
                    <tr key={row.id} className={`hover:bg-white/5 transition-colors ${!row.valid ? 'bg-error-container/5' : ''} ${selectedIds.has(row.id) ? 'bg-secondary-container/5' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" disabled={!row.valid} checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="accent-[#6cf8bb] w-4 h-4 cursor-pointer disabled:opacity-30" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${row.valid ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30' : 'bg-error/10 text-error-container border border-error/20'}`}>
                            {row.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-label-sm text-white flex items-center gap-1.5">
                              {row.name}
                              {row.isExternal && <span className="text-[9px] bg-primary-fixed/20 text-primary-fixed px-1.5 py-0.5 rounded">خارجي</span>}
                            </div>
                            <div className="text-[11px] text-outline-variant flex items-center gap-1">{row.flag} {row.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-outline-variant">{row.department}</td>
                      <td className="px-4 py-3 font-data-tabular text-xs">{row.baseSalary.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={(e) => { e.stopPropagation(); setShowBreakdown(showBreakdown === row.id ? null : row.id); }} className="text-secondary-container font-data-tabular text-xs hover:underline cursor-pointer">
                          +{(row.housingAllowance + row.transportAllowance).toLocaleString()}
                        </button>
                        {showBreakdown === row.id && (
                          <div className="absolute mt-1 bg-[#1a1a2e] border border-white/15 rounded-xl p-3 shadow-xl z-30 min-w-[180px] text-xs">
                            <div className="flex justify-between mb-1.5"><span className="text-outline-variant">بدل سكن (25%)</span><span className="text-white font-data-tabular">{row.housingAllowance.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-outline-variant">بدل نقل (10%)</span><span className="text-white font-data-tabular">{row.transportAllowance.toLocaleString()}</span></div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-error-container font-data-tabular text-xs">-{(row.gosiDeduction + row.otherDeductions).toLocaleString()}</td>
                      <td className="px-4 py-3 font-data-tabular text-sm font-bold text-white">{row.netPay.toLocaleString()} <span className="text-[10px] text-outline-variant font-normal">ر.س</span></td>
                      <td className="px-4 py-3 text-[11px] text-outline-variant">{row.method}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`material-symbols-outlined text-[20px] ${row.valid ? 'text-secondary-container' : 'text-error'}`}>
                          {row.valid ? 'check_circle' : 'cancel'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {filteredRows.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-between items-center">
                <div className="text-xs text-outline-variant">
                  {filteredRows.filter(r => r.valid).length} صالح  •  {filteredRows.filter(r => !r.valid).length} خطأ  •  {selectedRows.length} محدد
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-outline-variant">إجمالي صافي المحدد: <span className="text-white font-data-tabular font-bold">{totalNet.toLocaleString()} ر.س</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
