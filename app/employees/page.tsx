'use client';
import { useState } from 'react';
import { useApp, type Employee } from '@/components/AppContext';

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, toggleFreezeEmployee, showToast } = useApp();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
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
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center gap-3 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-white">
            <span className="font-label-sm text-outline-variant">رابط دعوة الموظفين</span>
            <span className="material-symbols-outlined text-[18px]">share</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-white font-body-sm overflow-hidden text-ellipsis whitespace-nowrap">
            https://pay.platform.app/invite/abc-123
          </div>
          <button onClick={() => { navigator.clipboard.writeText('https://pay.platform.app/invite/abc-123'); showToast('تم نسخ رابط الدعوة'); }} className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-label-sm flex items-center justify-center gap-2 transition">
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            نسخ الرابط
          </button>
        </div>
        <div className="glass-panel rounded-xl p-md flex flex-col justify-center hover:bg-white/5 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <span className="font-body-sm text-outline-variant">الموظفون النشطون</span>
            <span className="material-symbols-outlined text-secondary-container opacity-70 group-hover:opacity-100 transition-opacity">group_add</span>
          </div>
          <div>
            <div className="font-h3 text-white">{employees.filter(e => !e.isFrozen).length} <span className="font-body-sm text-outline-variant">موظف</span></div>
            <div className="font-label-sm text-secondary-container mt-xs">{employees.filter(e => e.isFrozen).length} مُجمد</div>
          </div>
        </div>
      </div>

      {/* Center Stage */}
      <div className="grow glass-panel rounded-2xl p-xl flex flex-col relative overflow-hidden glow-effect">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="flex justify-between items-center mb-xl relative z-10">
          <div>
            <h1 className="font-h2 text-white mb-xs glow-text">إدارة الموظفين</h1>
            <p className="font-body-sm text-outline-variant">إدارة الحسابات، المحافظ الرقمية، وتفاصيل الفريق</p>
          </div>
          <div className="flex gap-3">
            <div className="glass-panel flex items-center px-4 py-2 rounded-lg border border-white/10">
              <span className="material-symbols-outlined text-outline-variant mr-3 pr-2 text-[20px]">search</span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="البحث عن موظف..." className="bg-transparent border-none outline-none text-white font-body-sm w-48 rtl:text-right" dir="rtl" />
            </div>
            <div className="relative">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`px-4 py-2 rounded-lg text-white font-label-md transition flex items-center gap-2 ${isFilterOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}>
                <span className="material-symbols-outlined text-[18px]">filter_list</span> الفرز والتصفية
              </button>
              {isFilterOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-64 glass-panel border border-white/20 rounded-xl p-5 shadow-xl z-50 flex flex-col gap-4">
                  <div><h4 className="font-label-sm text-outline-variant mb-2">ترتيب حسب الاسم</h4><div className="flex gap-2"><button onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')} className={`flex-1 py-1.5 rounded border text-xs transition-colors ${sortOrder === 'asc' ? 'bg-primary-fixed/20 border-primary-fixed/50 text-white' : 'border-white/10 text-outline-variant hover:text-white'}`}>أ - ي</button><button onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')} className={`flex-1 py-1.5 rounded border text-xs transition-colors ${sortOrder === 'desc' ? 'bg-primary-fixed/20 border-primary-fixed/50 text-white' : 'border-white/10 text-outline-variant hover:text-white'}`}>ي - أ</button></div></div>
                  <div><h4 className="font-label-sm text-outline-variant mb-2">الدولة</h4><select value={filterCountry} onChange={e => setFilterCountry(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-body-sm outline-none">{uniqueCountries.map(c => <option key={c} value={c} className="bg-[#1e1e1e]">{c}</option>)}</select></div>
                  <div><h4 className="font-label-sm text-outline-variant mb-2">الحالة</h4><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-body-sm outline-none">{uniqueStatuses.map(s => <option key={s} value={s} className="bg-[#1e1e1e]">{s}</option>)}</select></div>
                  <div><h4 className="font-label-sm text-outline-variant mb-2">المحفظة</h4><select value={filterWallet} onChange={e => setFilterWallet(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-body-sm outline-none">{uniqueWallets.map(w => <option key={w} value={w} className="bg-[#1e1e1e]">{w}</option>)}</select></div>
                  {(filterCountry !== 'الكل' || filterStatus !== 'الكل' || filterWallet !== 'الكل' || sortOrder !== 'none' || searchQuery !== '') && (
                    <button onClick={() => { setFilterCountry('الكل'); setFilterStatus('الكل'); setFilterWallet('الكل'); setSortOrder('none'); setSearchQuery(''); }} className="w-full py-2 mt-2 rounded bg-error-container/20 text-error-container text-xs font-label-sm hover:bg-error-container/30 transition-colors">إعادة ضبط</button>
                  )}
                </div>
              )}
            </div>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded-lg bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition flex items-center gap-2 shadow-[0_0_15px_rgba(108,248,187,0.3)]">
              <span className="material-symbols-outlined text-[18px]">person_add</span> إضافة موظف
            </button>
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 overflow-y-auto pr-2 scrollbar-hide">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} onClick={() => setSelectedEmployee(emp)} className={`bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col relative hover:bg-white/[0.07] transition-all cursor-pointer group ${emp.isFrozen ? 'opacity-70 grayscale-[30%]' : ''}`}>
              {emp.isFrozen && <div className="absolute top-3 left-4 text-[10px] bg-error-container/20 text-error-container border border-error-container/30 px-2 py-0.5 rounded font-bold">مُجمد</div>}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border shadow-inner shrink-0 ${emp.isFrozen ? 'bg-error/10 border-error/20 text-error-container' : 'bg-primary-fixed/20 border-primary-fixed/30 text-primary-fixed'}`}>{emp.initial}</div>
                <div>
                  <h3 className="font-label-md text-white mb-1 group-hover:text-primary-fixed transition-colors">{emp.name}</h3>
                  <div className="font-body-sm text-outline-variant flex items-center gap-1.5">{emp.flag} {emp.country}</div>
                </div>
              </div>
              <div className="bg-white/3 rounded-xl p-3 border border-white/5 mb-5 flex flex-col gap-2">
                <div className="flex justify-between items-center"><span className="text-xs text-outline-variant">المحفظة النشطة</span><span className="text-xs text-white font-data-tabular">{emp.wallet}</span></div>
                <div className="flex justify-between items-center"><span className="text-xs text-outline-variant">الراتب</span><span className="text-xs text-white font-data-tabular">{emp.salary.toLocaleString()} ر.س</span></div>
              </div>
              <div className="mt-auto flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setEditingEmployee(emp); }} className="flex-1 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-label-sm flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[16px]">edit</span>تعديل</button>
                <button onClick={(e) => { e.stopPropagation(); toggleFreezeEmployee(emp.id); showToast(emp.isFrozen ? `تم تفعيل حساب ${emp.name}` : `تم تجميد حساب ${emp.name}`, 'warning'); }} className="w-10 h-10 rounded-lg border border-white/10 text-outline-variant hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-[18px]">ac_unit</span></button>
                <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(emp.id); }} className="w-10 h-10 rounded-lg border border-error-container/20 text-error-container hover:bg-error-container/20 flex items-center justify-center transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setSelectedEmployee(null)}>
          <div className="glass-panel w-full max-w-[800px] max-h-[90vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative animate-in zoom-in-95 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border shadow-inner shrink-0 ${selectedEmployee.isFrozen ? 'bg-error/10 border-error/20 text-error-container' : 'bg-primary-fixed/20 border-primary-fixed/30 text-primary-fixed'}`}>{selectedEmployee.initial}</div>
                <div>
                  <h2 className="font-h2 text-white glow-text mb-1 flex items-center gap-2">{selectedEmployee.name}{selectedEmployee.isFrozen && <span className="text-[10px] bg-error-container/20 text-error-container border border-error-container/30 px-2 py-0.5 rounded font-bold">مُجمد</span>}</h2>
                  <p className="font-body-sm text-outline-variant flex items-center gap-2">{selectedEmployee.flag} {selectedEmployee.country} • {selectedEmployee.position}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition-colors border border-white/10"><span className="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <div className="p-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div>
                  <h3 className="font-label-md text-outline-variant mb-2">رصيد المحفظة النشطة</h3>
                  <div className="font-h1 text-white glow-text mb-1">{selectedEmployee.balance.toLocaleString()} <span className="font-body-md text-outline-variant">ر.س</span></div>
                  <div className="font-body-sm text-primary-fixed flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">call_received</span>آخر إيداع: {selectedEmployee.lastPayDate}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4"><span className="text-xs text-outline-variant block mb-1">القسم</span><span className="text-white font-label-md">{selectedEmployee.department}</span></div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4"><span className="text-xs text-outline-variant block mb-1">الراتب الشهري</span><span className="text-white font-label-md">{selectedEmployee.salary.toLocaleString()} ر.س</span></div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4"><span className="text-xs text-outline-variant block mb-1">المحفظة</span><span className="text-white font-label-md">{selectedEmployee.wallet}</span></div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4"><span className="text-xs text-outline-variant block mb-1">الحالة</span><span className={`font-label-md ${selectedEmployee.isFrozen ? 'text-error-container' : 'text-secondary-container'}`}>{selectedEmployee.status}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Employee Modal */}
      {(showAddModal || editingEmployee) && (
        <EmployeeFormModal
          employee={editingEmployee}
          onClose={() => { setShowAddModal(false); setEditingEmployee(null); }}
          onSave={(data) => {
            if (editingEmployee) {
              updateEmployee(editingEmployee.id, data);
              showToast(`تم تحديث بيانات ${data.name || editingEmployee.name}`);
            } else {
              addEmployee(data as Omit<Employee, 'id'>);
              showToast(`تم إضافة الموظف ${data.name} بنجاح`);
            }
            setShowAddModal(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={() => setConfirmDelete(null)}>
          <div className="glass-panel w-full max-w-[400px] rounded-3xl p-8 border border-white/10 text-center animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-error-container/20 text-error-container flex items-center justify-center mx-auto mb-4 border border-error-container/30"><span className="material-symbols-outlined text-[32px]">delete_forever</span></div>
            <h3 className="font-h3 text-white mb-2">تأكيد الحذف</h3>
            <p className="font-body-sm text-outline-variant mb-6">هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-label-md hover:bg-white/10 transition">إلغاء</button>
              <button onClick={() => { const emp = employees.find(e => e.id === confirmDelete); deleteEmployee(confirmDelete); showToast(`تم حذف الموظف ${emp?.name}`, 'error'); setConfirmDelete(null); }} className="flex-1 py-3 rounded-xl bg-error/80 text-white font-label-md hover:bg-error transition">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Employee Form Modal ──────────────────────────────────────────────────────
const COUNTRIES = [
  { name: 'السعودية', flag: '🇸🇦', currency: 'SAR', wallet: 'المحفظة الرئيسية (SAR)' },
  { name: 'الإمارات', flag: '🇦🇪', currency: 'AED', wallet: 'محفظة AED' },
  { name: 'الولايات المتحدة', flag: '🇺🇸', currency: 'USD', wallet: 'محفظة USD' },
  { name: 'مصر', flag: '🇪🇬', currency: 'EGP', wallet: 'محفظة EGP' },
  { name: 'المملكة المتحدة', flag: '🇬🇧', currency: 'GBP', wallet: 'محفظة GBP' },
  { name: 'الأردن', flag: '🇯🇴', currency: 'JOD', wallet: 'محفظة JOD' },
];

function EmployeeFormModal({ employee, onClose, onSave }: { employee: Employee | null; onClose: () => void; onSave: (data: Partial<Employee> & { name: string }) => void }) {
  const isEdit = !!employee;
  const [name, setName] = useState(employee?.name || '');
  const [countryIdx, setCountryIdx] = useState(employee ? COUNTRIES.findIndex(c => c.name === employee.country) : 0);
  const [salary, setSalary] = useState(employee?.salary?.toString() || '');
  const [department, setDepartment] = useState(employee?.department || 'التطوير');
  const [position, setPosition] = useState(employee?.position || '');
  const [saving, setSaving] = useState(false);

  const country = COUNTRIES[countryIdx >= 0 ? countryIdx : 0];
  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??';

  const handleSubmit = () => {
    if (!name.trim() || !salary) return;
    setSaving(true);
    setTimeout(() => {
      onSave({
        name, country: country.name, flag: country.flag, wallet: country.wallet,
        walletCurrency: country.currency, status: 'نشط', initial: initials,
        salary: parseInt(salary), department, position,
        lastPayDate: 'لم يتم بعد', balance: 0, isFrozen: false,
      });
      setSaving(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6" onClick={onClose}>
      <div className="glass-panel w-full max-w-[550px] rounded-3xl border border-white/10 flex flex-col animate-in zoom-in-95 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
          <h2 className="font-h2 text-white">{isEdit ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-outline-variant hover:text-white transition-colors border border-white/10"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div><label className="block text-outline-variant font-label-sm mb-2">الاسم الكامل *</label><input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" placeholder="مثال: أحمد محمد" dir="rtl" /></div>
          <div><label className="block text-outline-variant font-label-sm mb-2">الدولة</label><select value={countryIdx} onChange={e => setCountryIdx(parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none">{COUNTRIES.map((c, i) => <option key={i} value={i} className="bg-[#1e1e1e]">{c.flag} {c.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-outline-variant font-label-sm mb-2">الراتب الشهري (ر.س) *</label><input type="number" value={salary} onChange={e => setSalary(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-data-tabular outline-none focus:border-secondary-container transition" placeholder="25000" dir="ltr" /></div>
            <div><label className="block text-outline-variant font-label-sm mb-2">القسم</label><select value={department} onChange={e => setDepartment(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none"><option className="bg-[#1e1e1e]">التطوير</option><option className="bg-[#1e1e1e]">المبيعات</option><option className="bg-[#1e1e1e]">الإدارة</option><option className="bg-[#1e1e1e]">الموارد البشرية</option></select></div>
          </div>
          <div><label className="block text-outline-variant font-label-sm mb-2">المسمى الوظيفي</label><input value={position} onChange={e => setPosition(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body-sm outline-none focus:border-secondary-container transition" placeholder="مثال: مهندس برمجيات" dir="rtl" /></div>
          <div className="flex gap-3 mt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-label-md hover:bg-white/10 transition">إلغاء</button>
            <button onClick={handleSubmit} disabled={saving || !name.trim() || !salary} className="flex-1 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md hover:bg-secondary-fixed transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_15px_rgba(108,248,187,0.3)]">
              {saving ? <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-[18px]">check</span>}
              {isEdit ? 'حفظ التعديلات' : 'إضافة الموظف'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
