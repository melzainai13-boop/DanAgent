
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { generateInvoicePDF } from '../services/pdfService';

interface OrderLogProps {
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
  t: (key: string) => string;
  lang: 'ar' | 'en';
}

const OrderLog: React.FC<OrderLogProps> = ({ orders, updateStatus, t, lang }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const statusColors: Record<OrderStatus, string> = {
    'جديد': 'bg-blue-100 text-blue-700',
    'تم التواصل': 'bg-orange-100 text-orange-700',
    'مكتمل': 'bg-green-100 text-green-700',
    'ملغي': 'bg-red-100 text-red-700'
  };

  const safeFormatPrice = (val: any) => {
    const num = Number(val);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US');
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right rtl:text-right ltr:text-left min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-bold text-gray-700 w-10"></th>
              <th className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-bold text-gray-700">{t('date')}</th>
              <th className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-bold text-gray-700">{t('customerName')}</th>
              <th className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-bold text-gray-700">{t('phone')}</th>
              <th className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-bold text-gray-700">{t('total')}</th>
              <th className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-bold text-gray-700">{t('status')}</th>
              <th className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-bold text-gray-700">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr 
                  className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${expandedOrderId === order.id ? 'bg-blue-50/30' : ''}`} 
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                >
                  <td className="px-4 py-3 text-center">
                    <svg className={`w-4 h-4 text-[#004AAD] transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-500 whitespace-nowrap">{order.date || '---'}</td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-black text-[#004AAD]">{order.customerName || 'بدون اسم'}</td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-600 font-bold">{order.phone || '---'}</td>
                  <td className="px-4 py-3 md:px-6 md:py-4 text-xs md:text-sm font-black text-[#F2545B] whitespace-nowrap">{safeFormatPrice(order.totalAmount)} SDG</td>
                  <td className="px-4 py-3 md:px-6 md:py-4" onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full outline-none border shadow-sm cursor-pointer ${statusColors[order.status]}`}
                    >
                      <option value="جديد">جديد</option>
                      <option value="تم التواصل">تم التواصل</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 md:px-6 md:py-4" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => generateInvoicePDF(order, lang)}
                      className="group flex items-center bg-[#F2545B]/10 hover:bg-[#F2545B] text-[#F2545B] hover:text-white px-3 py-1.5 rounded-lg transition-all font-black text-[10px] md:text-xs whitespace-nowrap"
                    >
                      <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      تصدير PDF
                    </button>
                  </td>
                </tr>
                {expandedOrderId === order.id && (
                  <tr className="bg-gray-50/80">
                    <td colSpan={7} className="p-0">
                      <div className="animate-slideUp p-6 md:px-12 md:py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                              <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">بيانات التوصيل</h4>
                              <div className="space-y-2">
                                <p className="text-sm font-bold text-gray-700">الاسم: <span className="text-[#004AAD]">{order.customerName}</span></p>
                                <p className="text-sm font-bold text-gray-700">التلفون: <span className="text-[#004AAD]">{order.phone}</span></p>
                                <p className="text-sm font-bold text-gray-700">العنوان: <span className="text-[#004AAD]">{order.address}</span></p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-2">
                            <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                              <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">الأصناف المطلوبة</h4>
                              <div className="overflow-hidden rounded-xl border border-gray-50">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50 text-[11px] font-black text-gray-400">
                                    <tr>
                                      <th className="px-4 py-2 text-right">الصنف</th>
                                      <th className="px-4 py-2 text-center">الكمية</th>
                                      <th className="px-4 py-2 text-left">الإجمالي</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-50">
                                    {order.items && order.items.length > 0 ? (
                                      order.items.map((item, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50">
                                          <td className="px-4 py-3 font-bold text-gray-700">{item.name}</td>
                                          <td className="px-4 py-3 text-center font-black text-blue-500 bg-blue-50/30">{item.quantity}</td>
                                          <td className="px-4 py-3 text-left font-black text-[#F2545B]">{safeFormatPrice(item.price * item.quantity)} SDG</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr><td colSpan={3} className="p-4 text-center text-gray-300 italic">لا يوجد تفاصيل أصناف</td></tr>
                                    )}
                                  </tbody>
                                  <tfoot className="bg-blue-600 text-white font-black">
                                    <tr>
                                      <td colSpan={2} className="px-4 py-3 text-right">الإجمالي الكلي</td>
                                      <td className="px-4 py-3 text-left">{safeFormatPrice(order.totalAmount)} SDG</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="p-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <p className="text-gray-400 font-bold">لا توجد طلبات مسجلة في النظام حالياً.</p>
        </div>
      )}
    </div>
  );
};

export default OrderLog;
