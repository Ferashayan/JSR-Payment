'use client';
import { useState, useRef } from 'react';
import { useApp, type Employee } from '@/components/AppContext';

const CONTRACT_DATE = '٢٠٢٥/٠١/٠١';
const HIJRI_DATE = '١٤٤٦/٠٦/٢٩';

function getContractClauses(emp: Employee) {
  const housing = Math.round(emp.salary * 0.25);
  const transport = Math.round(emp.salary * 0.10);
  const total = emp.salary + housing + transport;
  return {
    housing, transport, total,
    clauses: [
      {
        title: 'المادة الأولى: التعيين والمسمى الوظيفي',
        text: `يُعيَّن الطرف الثاني بوظيفة "${emp.position}" في قسم "${emp.department}"، ويلتزم بأداء جميع المهام والمسؤوليات المنوطة بهذا المنصب وفقاً للتوصيف الوظيفي المعتمد لدى الطرف الأول.`,
      },
      {
        title: 'المادة الثانية: مدة العقد',
        text: 'مدة هذا العقد سنتان (٢) ميلاديتان تبدأ من تاريخ مباشرة العمل الفعلي، ويتجدد تلقائياً لمدة مماثلة ما لم يُخطر أحد الطرفين الآخر كتابياً برغبته في عدم التجديد قبل (٦٠) يوماً من تاريخ الانتهاء.',
      },
      {
        title: 'المادة الثالثة: فترة التجربة',
        text: 'يخضع الطرف الثاني لفترة تجربة مدتها تسعون (٩٠) يوماً من تاريخ المباشرة، يحق لأي من الطرفين خلالها إنهاء العقد دون إشعار مسبق أو تعويض.',
      },
      {
        title: 'المادة الرابعة: الأجر والمزايا المالية',
        text: `يستحق الطرف الثاني الأجر الشهري التالي:\n• الراتب الأساسي: ${emp.salary.toLocaleString()} ر.س\n• بدل السكن (٢٥٪): ${housing.toLocaleString()} ر.س\n• بدل النقل (١٠٪): ${transport.toLocaleString()} ر.س\n• إجمالي الراتب الشهري: ${total.toLocaleString()} ر.س\n\nيُصرف الراتب في نهاية كل شهر ميلادي عبر ${emp.wallet}.`,
      },
      {
        title: 'المادة الخامسة: ساعات العمل',
        text: 'يلتزم الطرف الثاني بالعمل ثمان (٨) ساعات يومياً، بواقع خمسة (٥) أيام عمل في الأسبوع. يجوز للطرف الأول تكليف الطرف الثاني بالعمل الإضافي وفقاً لأحكام نظام العمل.',
      },
      {
        title: 'المادة السادسة: الإجازات',
        text: 'يستحق الطرف الثاني إجازة سنوية مدتها واحد وعشرون (٢١) يوماً مدفوعة الأجر، تُرفع إلى ثلاثين (٣٠) يوماً بعد إتمام خمس سنوات خدمة متصلة. كما يستحق الإجازات الرسمية والمرضية وفقاً لنظام العمل السعودي.',
      },
      {
        title: 'المادة السابعة: التأمينات الاجتماعية والطبية',
        text: 'يلتزم الطرف الأول بتسجيل الطرف الثاني في المؤسسة العامة للتأمينات الاجتماعية (GOSI) وتوفير تأمين طبي شامل للموظف وأسرته وفقاً لمتطلبات مجلس الضمان الصحي التعاوني.',
      },
      {
        title: 'المادة الثامنة: السرية وعدم المنافسة',
        text: 'يلتزم الطرف الثاني بالحفاظ على سرية جميع المعلومات والبيانات التي يطلع عليها بحكم عمله، وعدم إفشائها أثناء سريان العقد أو بعد انتهائه. كما يلتزم بعدم العمل لدى جهة منافسة لمدة سنة (١) بعد انتهاء العلاقة التعاقدية.',
      },
      {
        title: 'المادة التاسعة: إنهاء العقد ومكافأة نهاية الخدمة',
        text: 'يجوز لأي من الطرفين إنهاء هذا العقد بموجب إشعار كتابي مدته ستون (٦٠) يوماً. يستحق الطرف الثاني مكافأة نهاية الخدمة وفقاً لأحكام نظام العمل السعودي، وتُحسب على أساس أجر نصف شهر عن كل سنة من السنوات الخمس الأولى وأجر شهر كامل عن كل سنة تالية.',
      },
      {
        title: 'المادة العاشرة: أحكام عامة',
        text: 'يخضع هذا العقد لأنظمة المملكة العربية السعودية، وتختص الجهات القضائية المختصة بالفصل في أي نزاع ينشأ عن تفسيره أو تنفيذه. حُرر هذا العقد من نسختين أصليتين، استلم كل طرف نسخة للعمل بموجبها.',
      },
    ],
  };
}

export default function ContractsPage() {
  const { employees, showToast } = useApp();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmp = employees.find(e => e.id === selectedId) || null;

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { showToast('يرجى السماح بالنوافذ المنبثقة للطباعة', 'error'); return; }
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>عقد عمل - ${selectedEmp?.name}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'IBM Plex Sans Arabic',sans-serif;color:#1a1a1a;padding:40px 60px;line-height:1.9;font-size:14px;background:#fff}
.header{text-align:center;margin-bottom:32px;border-bottom:3px double #0a3d2a;padding-bottom:24px}
.logo{font-size:28px;font-weight:700;color:#0a3d2a;margin-bottom:4px;letter-spacing:1px}
.subtitle{color:#555;font-size:13px}
.contract-title{text-align:center;font-size:22px;font-weight:700;margin:28px 0;color:#0a3d2a}
.parties{background:#f8faf9;border:1px solid #e0e8e4;border-radius:8px;padding:20px;margin-bottom:24px}
.parties h3{font-size:14px;color:#0a3d2a;margin-bottom:8px}
.parties .row{display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px}
.parties .label{color:#666;min-width:120px}
.parties .value{font-weight:600}
.clause{margin-bottom:20px;page-break-inside:avoid}
.clause h3{font-size:15px;font-weight:700;color:#0a3d2a;margin-bottom:6px;border-right:4px solid #6cf8bb;padding-right:12px}
.clause p{white-space:pre-line;text-align:justify}
.signatures{display:flex;justify-content:space-between;margin-top:60px;page-break-inside:avoid}
.sig-box{width:45%;text-align:center;border-top:2px solid #0a3d2a;padding-top:16px}
.sig-box .role{font-weight:700;font-size:14px;color:#0a3d2a}
.sig-box .name{font-size:13px;color:#555;margin-top:4px}
.sig-box .line{margin-top:48px;border-bottom:1px dashed #999;width:80%;margin-left:auto;margin-right:auto}
.sig-box .sig-label{font-size:11px;color:#999;margin-top:4px}
.stamp-area{text-align:center;margin-top:40px;padding:16px;border:2px dashed #ccc;border-radius:8px;color:#999;font-size:12px}
.footer{text-align:center;margin-top:32px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px}
@media print{body{padding:20px 40px}button{display:none!important}}
</style></head><body>${printRef.current.innerHTML}
<script>setTimeout(()=>window.print(),500)<\/script></body></html>`);
    printWindow.document.close();
  };

return (
  /* أضفنا dir="rtl" هنا لضمان أن كل التوزيع يبدأ من اليمين بشكل صحيح */
  <div className="w-full max-w-[1600px] mx-auto flex gap-gutter items-stretch" dir="rtl">
    
    {/* Sidebar - Employee List */}
    <div className="hidden lg:flex flex-col gap-gutter w-80 shrink-0 z-20 relative">
      <div className="absolute -inset-4 bg-secondary-container/5 blur-3xl rounded-full z-[-1]"></div>

      <div className="glass-panel rounded-xl p-md">
        <div className="flex justify-between items-center mb-3">
          <span className="font-label-md text-white">عقود الموظفين</span>
          <span className="material-symbols-outlined text-secondary-container">description</span>
        </div>
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
          <span className="material-symbols-outlined text-outline-variant text-[18px] ml-2">search</span>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="بحث..." 
            className="bg-transparent border-none outline-none text-white font-body-sm w-full text-right" 
          />
        </div>
        <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto scrollbar-hide">
          {filtered.map(emp => (
            <button key={emp.id} onClick={() => setSelectedId(emp.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${selectedId === emp.id ? 'bg-secondary-container/15 border border-secondary-container/30' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${emp.isFrozen ? 'bg-error/10 text-error-container border border-error/20' : 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30'}`}>{emp.initial}</div>
              <div className="flex-1 min-w-0">
                <div className="font-label-sm text-white truncate">{emp.name}</div>
                <div className="text-[11px] text-outline-variant">{emp.position}</div>
              </div>
              {selectedId === emp.id && <span className="material-symbols-outlined text-secondary-container text-[18px]">check_circle</span>}
            </button>
          ))}
        </div>
      </div>

      {selectedEmp && (
        <div className="glass-panel rounded-xl p-md flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-label-sm text-outline-variant">معلومات سريعة</span>
            <span className="text-xs text-secondary-container font-bold">{selectedEmp.flag} {selectedEmp.country}</span>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between"><span className="text-outline-variant">القسم</span><span className="text-white">{selectedEmp.department}</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">الراتب</span><span className="text-white font-data-tabular">{selectedEmp.salary.toLocaleString()} ر.س</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">الحالة</span><span className={selectedEmp.isFrozen ? 'text-error-container' : 'text-secondary-container'}>{selectedEmp.status}</span></div>
          </div>
        </div>
      )}
    </div>

    {/* Main Content */}
    {/* التعديل: استبدلنا grow بـ flex-1 وأضفنا min-w-0 لضمان تمدد المحتوى بشكل صحيح */}
    <div className="flex-1 glass-panel rounded-2xl p-8 lg:p-12 flex flex-col relative overflow-hidden glow-effect min-w-0"> 
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      {!selectedEmp ? (
        /* التعديل: تأكدنا من أن الحاوية تأخذ العرض الكامل w-full */
        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 w-full animate-in fade-in duration-500"> 
          
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[48px] text-outline-variant">contract</span>
          </div>
          
          {/* التعديل: أضفنا w-full و max-w-2xl لضمان عدم ضغط النص */}
          <div className='flex flex-col items-center justify-center text-center w-full max-w-2xl'>
            <h2 className="text-3xl font-bold text-white mb-4 whitespace-nowrap">عقود العمل</h2> 
            
            {/* التعديل: أضفنا text-balance (إذا كنت تستخدم إصدار حديث من Tailwind) أو تأكدنا من العرض */}
            <p className="font-body-sm text-outline-variant leading-relaxed text-center">
              اختر موظفاً من القائمة لعرض عقد العمل الخاص به. يتضمن العقد جميع البنود والحقوق والتفاصيل المالية المعتمدة في النظام.
            </p>
          </div>
        </div>
      ) : (
        /* Contract View */
        <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-300">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h1 className="font-h2 text-white mb-xs glow-text">عقد عمل: {selectedEmp.name}</h1>
              <p className="font-body-sm text-outline-variant">{selectedEmp.position} • {selectedEmp.department}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handlePrint} className="px-5 py-2.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-md flex items-center gap-2 hover:bg-secondary-fixed transition shadow-[0_0_15px_rgba(108,248,187,0.3)]">
                <span className="material-symbols-outlined text-[18px]">print</span>طباعة العقد
              </button>
            </div>
          </div>

          {/* Contract Document */}
          <div className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
            <div ref={printRef}>
              <ContractDocument emp={selectedEmp} />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

/* ─── Contract Document Component ─── */
function ContractDocument({ emp }: { emp: Employee }) {
  const { housing, transport, total, clauses } = getContractClauses(emp);

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-12" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-white/10" style={{ borderBottomStyle: 'double' }}>
        <div className="font-h2 text-white mb-1" style={{ letterSpacing: '2px' }}>شركة جسر للتقنية المالية</div>
        <div className="text-xs text-outline-variant mb-1">JSR FinTech Corporation</div>
        <div className="text-[11px] text-outline-variant">سجل تجاري: ٤٠٣٠٥٨٧٤٣٢ • الرياض، المملكة العربية السعودية</div>
      </div>

      {/* Title */}
      <h2 className="text-center font-h2 text-white mb-8 relative">
        <span className="relative z-10">عقد عمل</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10"></div>
      </h2>

      {/* Preamble */}
      <div className="font-body-sm text-outline-variant mb-6 leading-relaxed text-justify">
        بعون الله تعالى، أُبرم هذا العقد في يوم {CONTRACT_DATE}م الموافق {HIJRI_DATE}هـ بين كل من:
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="font-label-md text-secondary-container mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">apartment</span>الطرف الأول (صاحب العمل)
          </h3>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between"><span className="text-outline-variant">الاسم</span><span className="text-white font-medium">شركة جسر للتقنية المالية</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">السجل التجاري</span><span className="text-white font-data-tabular">٤٠٣٠٥٨٧٤٣٢</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">المقر</span><span className="text-white">الرياض، المملكة العربية السعودية</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">الممثل</span><span className="text-white">الرئيس التنفيذي</span></div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h3 className="font-label-md text-primary-fixed mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">person</span>الطرف الثاني (الموظف)
          </h3>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between"><span className="text-outline-variant">الاسم</span><span className="text-white font-medium">{emp.name}</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">الجنسية</span><span className="text-white">{emp.flag} {emp.country}</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">المسمى</span><span className="text-white">{emp.position}</span></div>
            <div className="flex justify-between"><span className="text-outline-variant">القسم</span><span className="text-white">{emp.department}</span></div>
          </div>
        </div>
      </div>

      {/* Clauses */}
      <div className="flex flex-col gap-6 mb-10">
        {clauses.map((clause, i) => (
          <div key={i} className="group">
            <h3 className="font-label-md text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary-container rounded-full inline-block"></span>
              {clause.title}
            </h3>
            <p className="font-body-sm text-outline-variant leading-relaxed whitespace-pre-line text-justify pr-5">
              {clause.text}
            </p>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
        <h3 className="font-label-md text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container text-[18px]">payments</span>
          ملخص المستحقات الشهرية
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-[11px] text-outline-variant mb-1">الراتب الأساسي</div>
            <div className="font-data-tabular text-white font-bold">{emp.salary.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-[11px] text-outline-variant mb-1">بدل السكن</div>
            <div className="font-data-tabular text-secondary-container font-bold">{housing.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-[11px] text-outline-variant mb-1">بدل النقل</div>
            <div className="font-data-tabular text-secondary-container font-bold">{transport.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-secondary-container/10 rounded-lg border border-secondary-container/20">
            <div className="text-[11px] text-outline-variant mb-1">الإجمالي</div>
            <div className="font-data-tabular text-white font-bold">{total.toLocaleString()} ر.س</div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="text-center pt-4 border-t-2 border-white/15">
          <div className="font-label-md text-white mb-1">الطرف الأول</div>
          <div className="text-xs text-outline-variant mb-1">شركة جسر للتقنية المالية</div>
          <div className="text-xs text-outline-variant">الرئيس التنفيذي</div>
          <div className="mt-12 border-b border-dashed border-white/20 w-3/4 mx-auto"></div>
          <div className="text-[10px] text-outline-variant mt-2">التوقيع والختم</div>
        </div>
        <div className="text-center pt-4 border-t-2 border-white/15">
          <div className="font-label-md text-white mb-1">الطرف الثاني</div>
          <div className="text-xs text-outline-variant mb-1">{emp.name}</div>
          <div className="text-xs text-outline-variant">{emp.position}</div>
          <div className="mt-12 border-b border-dashed border-white/20 w-3/4 mx-auto"></div>
          <div className="text-[10px] text-outline-variant mt-2">التوقيع</div>
        </div>
      </div>

      {/* Stamp Area */}
      <div className="mt-10 border-2 border-dashed border-white/10 rounded-xl p-4 text-center">
        <span className="text-[11px] text-outline-variant">مكان ختم الشركة الرسمي</span>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[10px] text-outline-variant border-t border-white/10 pt-4">
        تم إعداد هذا العقد إلكترونياً عبر منصة جسر Pay • رقم العقد: JSR-{emp.id.toString().padStart(4, '0')} • التاريخ: {CONTRACT_DATE}م
      </div>
    </div>
  );
}
}
