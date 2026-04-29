'use client';

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface Employee {
  id: number;
  name: string;
  country: string;
  flag: string;
  wallet: string;
  walletCurrency: string;
  status: string;
  initial: string;
  isFrozen?: boolean;
  salary: number;
  department: string;
  position: string;
  lastPayDate: string;
  balance: number;
}

export interface Transaction {
  id: number;
  type: 'إيداع' | 'سحب';
  amount: string;
  numericAmount: number;
  date: string;
  details: string;
  status: 'مكتمل' | 'قيد التنفيذ' | 'فشل';
}

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface PaymentMethod {
  id: number;
  type: 'bank' | 'wallet';
  label: string;
  subLabel: string;
  icon: string;
  iconColor: string;
}

export interface EmployeeRequest {
  id: number;
  type: 'سلفة' | 'إجازة';
  status: 'قيد المراجعة' | 'مقبول' | 'مرفوض';
  date: string;
  details: string;
  amount?: number;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// ─── Initial Data ───────────────────────────────────────────────────────────────
const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: 'فراس النعسان', country: 'السعودية', flag: '🇸🇦', wallet: 'المحفظة الرئيسية (SAR)', walletCurrency: 'SAR', status: 'نشط', initial: 'FR', salary: 24500, department: 'التطوير', position: 'مهندس برمجيات أول', lastPayDate: '28 سبتمبر 2023', balance: 14500, isFrozen: false },
  { id: 2, name: 'سالم عبدالله', country: 'الإمارات', flag: '🇦🇪', wallet: 'محفظة AED', walletCurrency: 'AED', status: 'نشط', initial: 'SA', salary: 28000, department: 'المبيعات', position: 'مدير مبيعات', lastPayDate: '28 سبتمبر 2023', balance: 18200, isFrozen: false },
  { id: 3, name: 'جون ميلر', country: 'الولايات المتحدة', flag: '🇺🇸', wallet: 'محفظة USD', walletCurrency: 'USD', status: 'نشط', initial: 'JM', salary: 31200, department: 'التطوير', position: 'مهندس DevOps', lastPayDate: '28 سبتمبر 2023', balance: 22000, isFrozen: false },
  { id: 4, name: 'نورة الأحمد', country: 'السعودية', flag: '🇸🇦', wallet: 'المحفظة الرئيسية (SAR)', walletCurrency: 'SAR', status: 'مُجمد', initial: 'NA', salary: 19000, department: 'الإدارة', position: 'محاسبة', lastPayDate: '28 سبتمبر 2023', balance: 9500, isFrozen: true },
  { id: 5, name: 'كريم حسن', country: 'مصر', flag: '🇪🇬', wallet: 'محفظة EGP', walletCurrency: 'EGP', status: 'نشط', initial: 'KH', salary: 15400, department: 'التطوير', position: 'مبرمج واجهات', lastPayDate: '28 سبتمبر 2023', balance: 11000, isFrozen: false },
  { id: 6, name: 'لورا سميث', country: 'المملكة المتحدة', flag: '🇬🇧', wallet: 'محفظة GBP', walletCurrency: 'GBP', status: 'نشط', initial: 'LS', salary: 28900, department: 'المبيعات', position: 'مديرة تسويق', lastPayDate: '28 سبتمبر 2023', balance: 20300, isFrozen: false },
];

const INITIAL_COMPANY_TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'إيداع', amount: '+ 2,000,000 ر.س', numericAmount: 2000000, date: '28 أكتوبر 2023, 10:00 ص', details: 'تغذية المحفظة لمسير رواتب شهر أكتوبر', status: 'مكتمل' },
  { id: 2, type: 'سحب', amount: '- 1,940,200 ر.س', numericAmount: -1940200, date: '29 أكتوبر 2023, 08:30 ص', details: 'صرف الرواتب - مسير أكتوبر (142 موظف)', status: 'قيد التنفيذ' },
  { id: 3, type: 'سحب', amount: '- 5,000 ر.س', numericAmount: -5000, date: '15 أكتوبر 2023, 11:20 ص', details: 'سحب رصيد متبقي إلى حساب الشركة الأساسي', status: 'مكتمل' },
  { id: 4, type: 'إيداع', amount: '+ 150,000 ر.س', numericAmount: 150000, date: '01 أكتوبر 2023, 09:15 ص', details: 'تغذية إضافية - مكافآت ومصاريف طارئة', status: 'مكتمل' },
];

const INITIAL_EMPLOYEE_TRANSACTIONS: Transaction[] = [
  { id: 1, type: 'إيداع', amount: '+ 24,500 ر.س', numericAmount: 24500, date: '28 سبتمبر 2023, 10:00 ص', details: 'إيداع راتب شهر سبتمبر', status: 'مكتمل' },
  { id: 2, type: 'سحب', amount: '- 4,000 ر.س', numericAmount: -4000, date: '02 أكتوبر 2023, 02:30 م', details: 'تحويل بنكي - سداد بطاقة الراجحي', status: 'مكتمل' },
  { id: 3, type: 'سحب', amount: '- 1,500 ر.س', numericAmount: -1500, date: '15 أكتوبر 2023, 11:20 ص', details: 'تحويل محلي - محمد عبدالعزيز', status: 'مكتمل' },
  { id: 4, type: 'إيداع', amount: '+ 5,000 ر.س', numericAmount: 5000, date: '15 أغسطس 2023, 09:15 ص', details: 'سلفة نقدية معتمدة', status: 'مكتمل' },
];

// ─── Helper ─────────────────────────────────────────────────────────────────────
function formatAmount(n: number): string {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US');
  return `${n >= 0 ? '+' : '-'} ${formatted} ر.س`;
}

function nowDate(): string {
  const d = new Date();
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${h12}:${m} ${period}`;
}

// ─── Context Type ───────────────────────────────────────────────────────────────
interface AppContextType {
  // Employees
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: number, data: Partial<Employee>) => void;
  deleteEmployee: (id: number) => void;
  toggleFreezeEmployee: (id: number) => void;

  // Company Wallet
  companyBalance: number;
  companyTransactions: Transaction[];
  companyDeposit: (amount: number, details: string) => void;
  companyWithdraw: (amount: number, details: string) => void;

  // Employee Wallet (personal view)
  employeeBalance: number;
  employeeTransactions: Transaction[];
  employeeDeposit: (amount: number, details: string) => void;
  employeeWithdraw: (amount: number, details: string) => void;

  // Toasts
  toasts: ToastData[];
  showToast: (message: string, type?: ToastData['type']) => void;
  dismissToast: (id: number) => void;

  // Bulk pay
  bulkPayResults: BulkPayRow[];
  setBulkPayResults: (rows: BulkPayRow[]) => void;
  executeBulkPay: () => void;
  bulkPayExecuted: boolean;

  // Payment methods
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (pm: Omit<PaymentMethod, 'id'>) => void;

  // Employee requests
  requests: EmployeeRequest[];
  addRequest: (req: Omit<EmployeeRequest, 'id' | 'date' | 'status'>) => void;

  // ID generator
  nextId: () => number;
}

export interface BulkPayRow {
  name: string;
  country: string;
  flag: string;
  amount: number;
  method: string;
  valid: boolean;
  error?: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  // ID counter
  const [idCounter, setIdCounter] = useState(1000);
  const nextId = useCallback(() => {
    setIdCounter(prev => prev + 1);
    return idCounter + 1;
  }, [idCounter]);

  // Employees
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  const addEmployee = useCallback((emp: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...emp, id: Date.now() }]);
  }, []);

  const updateEmployee = useCallback((id: number, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);

  const deleteEmployee = useCallback((id: number) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  const toggleFreezeEmployee = useCallback((id: number) => {
    setEmployees(prev => prev.map(e => e.id === id
      ? { ...e, isFrozen: !e.isFrozen, status: e.isFrozen ? 'نشط' : 'مُجمد' }
      : e));
  }, []);

  // Company Wallet
  const [companyBalance, setCompanyBalance] = useState(209800);
  const [companyTransactions, setCompanyTransactions] = useState<Transaction[]>(INITIAL_COMPANY_TRANSACTIONS);

  const companyDeposit = useCallback((amount: number, details: string) => {
    setCompanyBalance(prev => prev + amount);
    setCompanyTransactions(prev => [{
      id: Date.now(),
      type: 'إيداع',
      amount: formatAmount(amount),
      numericAmount: amount,
      date: nowDate(),
      details,
      status: 'مكتمل',
    }, ...prev]);
  }, []);

  const companyWithdraw = useCallback((amount: number, details: string) => {
    setCompanyBalance(prev => prev - amount);
    setCompanyTransactions(prev => [{
      id: Date.now(),
      type: 'سحب',
      amount: formatAmount(-amount),
      numericAmount: -amount,
      date: nowDate(),
      details,
      status: 'مكتمل',
    }, ...prev]);
  }, []);

  // Employee Wallet
  const [employeeBalance, setEmployeeBalance] = useState(12450);
  const [employeeTransactions, setEmployeeTransactions] = useState<Transaction[]>(INITIAL_EMPLOYEE_TRANSACTIONS);

  const employeeDeposit = useCallback((amount: number, details: string) => {
    setEmployeeBalance(prev => prev + amount);
    setEmployeeTransactions(prev => [{
      id: Date.now(),
      type: 'إيداع',
      amount: formatAmount(amount),
      numericAmount: amount,
      date: nowDate(),
      details,
      status: 'مكتمل',
    }, ...prev]);
  }, []);

  const employeeWithdraw = useCallback((amount: number, details: string) => {
    setEmployeeBalance(prev => prev - amount);
    setEmployeeTransactions(prev => [{
      id: Date.now(),
      type: 'سحب',
      amount: formatAmount(-amount),
      numericAmount: -amount,
      date: nowDate(),
      details,
      status: 'مكتمل',
    }, ...prev]);
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    const toast: ToastData = { id: Date.now() + Math.random(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Bulk pay
  const [bulkPayResults, setBulkPayResults] = useState<BulkPayRow[]>([]);
  const [bulkPayExecuted, setBulkPayExecuted] = useState(false);

  const executeBulkPay = useCallback(() => {
    const totalValid = bulkPayResults.filter(r => r.valid).reduce((sum, r) => sum + r.amount, 0);
    setCompanyBalance(prev => prev - totalValid);
    setCompanyTransactions(prev => [{
      id: Date.now(),
      type: 'سحب',
      amount: formatAmount(-totalValid),
      numericAmount: -totalValid,
      date: nowDate(),
      details: `صرف رواتب جماعي - ${bulkPayResults.filter(r => r.valid).length} موظف`,
      status: 'مكتمل',
    }, ...prev]);
    setBulkPayExecuted(true);
  }, [bulkPayResults]);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, type: 'bank', label: 'بنك الراجحي', subLabel: '**** 4567', icon: 'account_balance', iconColor: 'bg-secondary-container/20 text-secondary-container' },
    { id: 2, type: 'wallet', label: 'STC Pay', subLabel: '**** 0900', icon: 'phone_iphone', iconColor: 'bg-primary-fixed-dim/20 text-primary-fixed-dim' },
  ]);

  const addPaymentMethod = useCallback((pm: Omit<PaymentMethod, 'id'>) => {
    setPaymentMethods(prev => [...prev, { ...pm, id: Date.now() }]);
  }, []);

  // Employee requests
  const [requests, setRequests] = useState<EmployeeRequest[]>([
    { id: 1, type: 'سلفة', status: 'مقبول', date: '15 سبتمبر 2023', details: 'سلفة نقدية لمصاريف طارئة', amount: 5000 },
    { id: 2, type: 'إجازة', status: 'مقبول', date: '01 أغسطس 2023', details: 'إجازة سنوية', leaveType: 'سنوية', startDate: '2023-08-10', endDate: '2023-08-20' },
  ]);

  const addRequest = useCallback((req: Omit<EmployeeRequest, 'id' | 'date' | 'status'>) => {
    setRequests(prev => [{ ...req, id: Date.now(), date: nowDate(), status: 'قيد المراجعة' }, ...prev]);
  }, []);

  const value = useMemo(() => ({
    employees, addEmployee, updateEmployee, deleteEmployee, toggleFreezeEmployee,
    companyBalance, companyTransactions, companyDeposit, companyWithdraw,
    employeeBalance, employeeTransactions, employeeDeposit, employeeWithdraw,
    toasts, showToast, dismissToast,
    bulkPayResults, setBulkPayResults, executeBulkPay, bulkPayExecuted,
    paymentMethods, addPaymentMethod,
    requests, addRequest,
    nextId,
  }), [
    employees, companyBalance, companyTransactions, employeeBalance, employeeTransactions,
    toasts, bulkPayResults, bulkPayExecuted, paymentMethods, requests,
    addEmployee, updateEmployee, deleteEmployee, toggleFreezeEmployee,
    companyDeposit, companyWithdraw, employeeDeposit, employeeWithdraw,
    showToast, dismissToast, setBulkPayResults, executeBulkPay,
    addPaymentMethod, addRequest, nextId,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
