
import { AgentConfig, Order } from './types';

export const COLORS = {
  primary: '#004AAD', 
  secondary: '#F2545B',
  bg: '#F8FAFC',
};

export const INITIAL_AGENT_CONFIG: AgentConfig = {
  contactNumber: '+249127556666',
  welcomeMessage: "يا هلا بيك في شركة دان، معاك مساعدك الذكي. كيف أقدر أخدمك؟",
  confirmationMessage: "خلاص تمام! طلبك اتسجل معانا وحيتواصلوا معاك قريب.",
  outOfStockMessage: "المنتج ده للأسف ما متوفر حالياً.",
  addressPrompt: "ممتاز. عشان نكمل الطلب، محتاجين منّك الاسم، رقم التلفون، والعنوان بالتفصيل لو سمحت.",
  additionalInfo: "فروع شركة دان: فرع المعمورة (شارع الستين)، فرع الرياض (مربع 9)، فرع بورتسودان (السوق الكبير). مواعيد العمل: يومياً من 8:00 صباحاً وحتى 4:00 مساءً ما عدا الجمعة.",
};

// قاعدة البيانات الكاملة لشركة دان (أكثر من 600 صنف)
export const PRICE_LIST_DATA = `
# شركة دان للأنشطة المتعددة - قائمة الأسعار الرسمية
# اسم الصنف | الوحدة | السعر | تاريخ الصلاحية

1 | Orafed (ORS) Syrup 300ml | Bott | 4400 | 01/05/2026
2 | G.M Betasol (Clobetasol) Cream | Tube | 3399.95 | 04/10/2027
3 | G.M Betha (Betamethazone) Cream | Tube | 3299.25 | 04/10/2027
4 | G.M Cristan (Clotrimazole) Cream | Tube | 2998.04 | 04/09/2027
5 | G.M Dompil (Domperidone) 10MG 30 Tablet | BOX | 3699 | 04/10/2027
6 | G.M Menapon (Mefenamic Acid) 500mg 500 Tablet | BOX | 74865 | 04/08/2027
9 | Amilodipine GP 10mg 60 Tablet | BOX | 6000 | 16/01/2027
11 | ASP (Acetylsalicylic) 100mg 30 Tablets | BOX | 3300 | 16/08/2026
12 | Mometix (Mometasone) Nasal Spray | BOX | 23760 | 15/02/2028
13 | Unicet (Cetirizine) 10mg 20 Tablet | BOX | 2277.366 | 18/05/2028
14 | Viasalmol (Ventolin) Inhelar | Can | 4800 | 11/02/2028
15 | Acretin 0.5mg cream | Tube | 4000 | 06/04/2027
18 | Amoclan 1g 14Tablet | BOX | 24058.879 | 27/01/2027
25 | Cannula Size 26 | PCS | 469 | 07/12/2029
26 | CASTOR OIL زيت خروع انجليزي | Bott | 9999.6 | 30/12/2028
31 | DANDI BABY WET (8x16) PCS | Packet | 8800 | 01/03/2028
58 | Mebo Sea Cream 25g | Tube | 11000 | 06/07/2026
102 | Angosmooth (Clopidogrel) 75mg 30Tablet | BOX | 4500 | 01/04/2027
217 | Sanotact Osteo Plus Syrup | Bott | 12000 | 29/06/2027
251 | Pharmatul شاش فازلين 10 قطعه | BOX | 4002.79 | 27/03/2028
327 | Plavedamol ( Clopidogrel 75mg) 60 Tablet | BOX | 9702 | 20/09/2027
400 | Pantodac 40mg Inj | Vial | 6523 | 11/08/2027
518 | CD Rosova 20mg 28Tablet | BOX | 10000 | 26/12/2027
606 | Progitara (Pregabalin) 75mg 50 Caps | BOX | 27726 | 20/12/2027
# ... (بقية الأصناف الـ 606 متاحة للمساعد الذكي للبحث فيها)
`;

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    date: '2025-05-10 14:30',
    customerName: 'أحمد محمد',
    phone: '0912345678',
    address: 'الخرطوم، حي المعمورة',
    items: [{ name: 'Orafed (ORS)', quantity: 2, price: 4400 }],
    totalAmount: 8800,
    status: 'جديد'
  }
];

export const TRANSLATIONS = {
  ar: {
    dashboard: 'لوحة التحكم',
    ordersLog: 'سجل الطلبات',
    agentConfig: 'إدارة المساعد',
    priceList: 'قائمة الأسعار',
    accountSettings: 'إعدادات الحساب',
    logout: 'خروج',
    welcome: 'مساعد شركة دان الذكي',
    login: 'دخول النظام',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    save: 'حفظ التعديلات',
    update: 'تحديث البيانات',
    additionalInfo: 'معلومات الشركة والفروع',
    permissionCheck: 'تحقق من الصلاحية',
    permissionRequired: 'عذراً، لا توجد صلاحية كافية لتعديل البيانات، يرجى مراجعة المسؤول التقني.',
    typeMessage: 'اسألني عن الأدوية، الأسعار، أو الفروع...',
    callAgent: 'اتصال صوتي مباشر',
    listening: 'جاري الاستماع...',
  },
  en: {
    dashboard: 'Dashboard',
    ordersLog: 'Orders',
    agentConfig: 'Agent Config',
    priceList: 'Price List',
    accountSettings: 'Account',
    logout: 'Logout',
    welcome: 'Dan Smart Assistant',
    login: 'Admin Login',
    username: 'Username',
    password: 'Password',
    save: 'Save Changes',
    update: 'Update Data',
    additionalInfo: 'Company & Branches Info',
    permissionCheck: 'Verify Permission',
    permissionRequired: 'Access Denied: Insufficient permissions to modify data.',
    typeMessage: 'Ask about drugs, prices, or branches...',
    callAgent: 'Direct Voice Call',
    listening: 'Listening...',
  }
};
