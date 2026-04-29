'use client';
import { useState } from 'react';

// Added interface for employee typing
interface Employee {
  name: string;
  country: string;
  flag: string;
  wallet: string;
  status: string;
  initial: string;
  isFrozen?: boolean;
}

export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const employees: Employee[] = [
    { name: 'فراس العيان', country: 'السعودية', flag: '🇸🇦', wallet: 'المحفظة الرئيسية (SAR)', status: 'نشط', initial: 'FR' },
    { name: 'سالم عبدالله', country: 'الإمارات', flag: '🇦🇪', wallet: 'محفظة AED', status: 'نشط', initial: 'SA' },
    { name: 'جون ميلر', country: 'الولايات المتحدة', flag: '🇺🇸', wallet: 'محفظة USD', status: 'نشط', initial: 'JM' },
    { name: 'نورة الأحمد', country: 'السعودية', flag: '🇸🇦', wallet: 'المحفظة الرئيسية (SAR)', status: 'مُجمد', initial: 'NA', isFrozen: true },
    { name: 'كريم حسن', country: 'مصر', flag: '🇪🇬', wallet: 'محفظة EGP', status: 'نشط', initial: 'KH' },
    { name: 'لورا سميث', country: 'المملكة المتحدة', flag: '🇬🇧', wallet: 'محفظة GBP', status: 'نشط', initial: 'LS' }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('الكل');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [filterWallet, setFilterWallet] = useState('الكل');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const uniqueCountries = ['الكل', ...Array.from(new Set(employees.map(e => e.country)))];
  const uniqueStatuses = ['الكل', ...Array.from(new Set(employees.map(e => e.status)))];
  const uniqueWallets = ['الكل', 'SAR', 'AED', 'USD', 'EGP', 'GBP'];

  const filteredEmployees = employees
    .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(emp => filterCountry === 'الكل' || emp.country === filterCountry)
    .filter(emp => filterStatus === 'الكل' || emp.status === filterStatus)
    .filter(emp => filterWallet === 'الكل' || emp.wallet.includes(filterWallet))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name, 'ar');
      if (sortOrder === 'desc') return b.name.localeCompare(a.name, 'ar');
      return 0;
    });

  return (
    <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch relative">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col gap-gutter w-72 shrink-0 z-20 relative">
        <div className="absolute -inset-4 bg-tertiary-fixed-dim/5 blur-3xl rounded-full z-[-1]"></div>
        
        {/* Invitation Link */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center gap-3 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-white">
            <span className="font-label-sm text-outline-variant">رابط دعوة الموظفين</span>
            <span className="material-symbols-outlined text-[18px]">share</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white font-body-sm overflow-hidden text-ellipsis whitespace-nowrap">
            https://pay.platform.app/invite/abc-123
          </div>
          <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-sm flex items-center justify-center gap-2 transition">
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            نسخ الرابط
          </button>
        </div>

        {/* Pending Requests */}
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center hover:bg-white/5 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">طلبات الانضمام الجديدة</span>
            <span className="material-symbols-outlined text-secondary-container opacity-70 group-hover:opacity-100 transition-opacity">group_add</span>
          </div>
          <div>
            <div className="font-h3 text-white">4 <span className="font-body-sm text-outline-variant">موظفين</span></div>
            <div className="font-label-sm text-secondary-container mt-xs">طلب مراجعة واحد</div>
          </div>
        </div>
      </div>

      {/* Center Stage */}
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
         {/* Ambient glow */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

         <div className="flex justify-between items-center mb-xl relative z-10">
            <div>
              <h1 className="font-h2 text-white mb-xs glow-text">إدارة الموظفين</h1>
              <p className="font-body-sm text-outline-variant">إدارة الحسابات، المحافظ الرقمية، وتفاصيل الفريق</p>
            </div>
            <div className="flex gap-3">
              <div className="glass-panel flex items-center px-4 py-2 rounded-lg border border-white/10">
                 <span className="material-symbols-outlined text-outline-variant mr-3 pr-2 text-[20px]">search</span>
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="البحث عن موظف..." 
                   className="bg-transparent border-none outline-none text-white font-body-sm w-48 rtl:text-right" 
                   dir="rtl"
                 />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`px-4 py-2 rounded-lg text-white font-label-md transition flex items-center gap-2 ${isFilterOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
                >
                   <span className="material-symbols-outlined text-[18px]">filter_list</span> الفرز والتصفية
                </button>
                {isFilterOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-64 glass-panel border border-white/20 rounded-xl p-5 shadow-xl z-50 flex flex-col gap-4">
                    
                    {/* Sort Order */}
                    <div>
                      <h4 className="font-label-sm text-outline-variant mb-2">ترتيب حسب الاسم</h4>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')} 
                          className={`flex-1 py-1.5 rounded border text-xs transition-colors ${sortOrder === 'asc' ? 'bg-primary-fixed/20 border-primary-fixed/50 text-white' : 'border-white/10 text-outline-variant hover:text-white'}`}
                        >أ - ي</button>
                        <button 
                          onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')} 
                          className={`flex-1 py-1.5 rounded border text-xs transition-colors ${sortOrder === 'desc' ? 'bg-primary-fixed/20 border-primary-fixed/50 text-white' : 'border-white/10 text-outline-variant hover:text-white'}`}
                        >ي - أ</button>
                      </div>
                    </div>

                    {/* Filter Country */}
                    <div>
                      <h4 className="font-label-sm text-outline-variant mb-2">الدولة</h4>
                      <select 
                        value={filterCountry} 
                        onChange={e => setFilterCountry(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-body-sm outline-none focus:border-white/30"
                      >
                        {uniqueCountries.map(c => <option key={c} value={c} className="bg-[#1e1e1e]">{c}</option>)}
                      </select>
                    </div>

                    {/* Filter Status */}
                    <div>
                      <h4 className="font-label-sm text-outline-variant mb-2">الحالة</h4>
                      <select 
                        value={filterStatus} 
                        onChange={e => setFilterStatus(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-body-sm outline-none focus:border-white/30"
                      >
                        {uniqueStatuses.map(s => <option key={s} value={s} className="bg-[#1e1e1e]">{s}</option>)}
                      </select>
                    </div>

                    {/* Filter Wallet */}
                    <div>
                      <h4 className="font-label-sm text-outline-variant mb-2">المحفظة</h4>
                      <select 
                        value={filterWallet} 
                        onChange={e => setFilterWallet(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-body-sm outline-none focus:border-white/30"
                      >
                        {uniqueWallets.map(w => <option key={w} value={w} className="bg-[#1e1e1e]">{w}</option>)}
                      </select>
                    </div>

                    {(filterCountry !== 'الكل' || filterStatus !== 'الكل' || filterWallet !== 'الكل' || sortOrder !== 'none' || searchQuery !== '') && (
                      <button 
                        onClick={() => {
                          setFilterCountry('الكل');
                          setFilterStatus('الكل');
                          setFilterWallet('الكل');
                          setSortOrder('none');
                          setSearchQuery('');
                        }}
                        className="w-full py-2 mt-2 rounded bg-error-container/20 text-error-container text-xs font-label-sm hover:bg-error-container/30 transition-colors"
                      >
                        إعادة ضبط الفرز والتصفية
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
         </div>

         {/* Employees Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 overflow-y-auto pr-2 scrollbar-hide">
            {filteredEmployees.map((emp, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedEmployee(emp)}
                className={`bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col relative hover:bg-white/[0.07] transition-all cursor-pointer group ${emp.isFrozen ? 'opacity-70 grayscale-[30%]' : ''}`}
              >
                 {emp.isFrozen && <div className="absolute top-3 left-4 text-[10px] bg-error-container/20 text-error-container border border-error-container/30 px-2 py-0.5 rounded font-bold">مُجمد</div>}
                 
                 <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border shadow-inner shrink-0 ${emp.isFrozen ? 'bg-error/10 border-error/20 text-error-container' : 'bg-primary-fixed/20 border-primary-fixed/30 text-primary-fixed'}`}>
                      {emp.initial}
                    </div>
                    <div>
                      <h3 className="font-label-md text-white mb-1 group-hover:text-primary-fixed transition-colors">{emp.name}</h3>
                      <div className="font-body-sm text-outline-variant flex items-center gap-1.5">
                        {emp.flag} {emp.country}
                      </div>
                    </div>
                 </div>

                 <div className="bg-white/3 rounded-xl p-3 border border-white/5 mb-5 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-outline-variant">المحفظة النشطة</span>
                      <span className="text-xs text-white font-data-tabular">{emp.wallet}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-outline-variant">آخر تحويل</span>
                      <span className="text-xs text-white font-data-tabular">28 سبتمبر 2023</span>
                    </div>
                 </div>

                 <div className="mt-auto flex gap-2">
                    <button onClick={(e) => e.stopPropagation()} className="flex-1 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-label-sm flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-[16px]">edit</span>
                       تعديل
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-lg border border-white/10 text-outline-variant hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                       <span className="material-symbols-outlined text-[18px]">ac_unit</span>
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-lg border border-error-container/20 text-error-container hover:bg-error-container/20 flex items-center justify-center transition-colors">
                       <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setSelectedEmployee(null)}>
          <div 
            className="glass-panel w-full max-w-[800px] max-h-[90vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative animate-in zoom-in-95 duration-200 overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/2 shrink-0">
               <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border shadow-inner shrink-0 ${selectedEmployee.isFrozen ? 'bg-error/10 border-error/20 text-error-container' : 'bg-primary-fixed/20 border-primary-fixed/30 text-primary-fixed'}`}>
                    {selectedEmployee.initial}
                  </div>
                  <div>
                    <h2 className="font-h2 text-white glow-text mb-1 flex items-center gap-2">
                      {selectedEmployee.name}
                      {selectedEmployee.isFrozen && <span className="text-[10px] bg-error-container/20 text-error-container border border-error-container/30 px-2 py-0.5 rounded font-bold">مُجمد</span>}
                    </h2>
                    <p className="font-body-sm text-outline-variant flex items-center gap-2">
                      {selectedEmployee.flag} {selectedEmployee.country} • مبرمج واجهات
                    </p>
                  </div>
               </div>
               <button onClick={() => setSelectedEmployee(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition-colors border border-white/10">
                 <span className="material-symbols-outlined text-[20px]">close</span>
               </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
               {/* Wallet Overview */}
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                  <div>
                    <h3 className="font-label-md text-outline-variant mb-2">رصيد المحفظة النشطة</h3>
                    <div className="font-h1 text-white glow-text mb-1">
                       14,500 <span className="font-body-md text-outline-variant">ر.س</span>
                    </div>
                    <div className="font-body-sm text-primary-fixed flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">call_received</span>
                      آخر إيداع: 28 سبتمبر 2023
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-5 py-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md hover:bg-primary-fixed-dim transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(218,226,253,0.3)]">
                       <span className="material-symbols-outlined text-[18px]">payments</span>
                       إيداع فوري
                    </button>
                    <button className="px-5 py-2.5 rounded-lg border border-white/20 text-white font-label-md hover:bg-white/10 transition flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                       تجميد الرصيد
                    </button>
                  </div>
               </div>

               {/* Transaction History */}
               <div>
                  <h3 className="font-h3 text-white mb-4">سجل العمليات</h3>
                  <div className="bg-white/2 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                     <table className="w-full text-right border-collapse">
                        <thead className="bg-white/5 border-b border-white/10 font-label-sm text-outline-variant">
                          <tr>
                            <th className="px-5 py-3 font-medium">العملية</th>
                            <th className="px-5 py-3 font-medium">المبلغ</th>
                            <th className="px-5 py-3 font-medium">التاريخ</th>
                            <th className="px-5 py-3 font-medium">الحالة</th>
                          </tr>
                        </thead>
                        <tbody className="font-data-tabular text-white divide-y divide-white/5 text-sm">
                          <tr className="hover:bg-white/[0.05] transition-colors group">
                            <td className="px-5 py-3 flex items-center gap-3">
                              <span className="material-symbols-outlined text-secondary-container">south_west</span>
                              <span>إيداع راتب سبتمبر</span>
                            </td>
                            <td className="px-5 py-3 text-secondary-container font-bold">+24,500 ر.س</td>
                            <td className="px-5 py-3 text-outline-variant">28-09-2023</td>
                            <td className="px-5 py-3"><span className="px-2 py-1 rounded bg-secondary-container/20 text-secondary-container text-xs">مكتمل</span></td>
                          </tr>
                          <tr className="hover:bg-white/[0.05] transition-colors group">
                            <td className="px-5 py-3 flex items-center gap-3">
                              <span className="material-symbols-outlined text-white">north_east</span>
                              <span>سحب للحساب البنكي</span>
                            </td>
                            <td className="px-5 py-3">-10,000 ر.س</td>
                            <td className="px-5 py-3 text-outline-variant">29-09-2023</td>
                            <td className="px-5 py-3"><span className="px-2 py-1 rounded bg-secondary-container/20 text-secondary-container text-xs">مكتمل</span></td>
                          </tr>
                          <tr className="hover:bg-white/[0.05] transition-colors group">
                            <td className="px-5 py-3 flex items-center gap-3">
                              <span className="material-symbols-outlined text-tertiary-fixed-dim">payments</span>
                              <span>سلفة نقدية</span>
                            </td>
                            <td className="px-5 py-3 text-tertiary-fixed-dim font-bold">+5,000 ر.س</td>
                            <td className="px-5 py-3 text-outline-variant">15-08-2023</td>
                            <td className="px-5 py-3"><span className="px-2 py-1 rounded bg-secondary-container/20 text-secondary-container text-xs">مكتمل</span></td>
                          </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
