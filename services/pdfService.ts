
import { Order } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * PDF Service using html2canvas to resolve Arabic RTL issues.
 */
export const generateInvoicePDF = async (order: Order, lang: 'ar' | 'en') => {
  // Ensure fonts are loaded before capturing
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Create a hidden temporary container for the invoice HTML
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.dir = 'rtl';
  container.style.fontFamily = "'Tajawal', sans-serif";

  const safePrice = (val: any) => Number(val || 0).toLocaleString('en-US');

  container.innerHTML = `
    <div style="border: 2px solid #004AAD; padding: 40px; border-radius: 30px; background-color: white;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 5px solid #F2545B; padding-bottom: 30px; margin-bottom: 40px;">
        <div>
          <h1 style="color: #004AAD; margin: 0; font-size: 32px; font-weight: 900;">شركة دان للأنشطة المتعددة</h1>
          <p style="color: #F2545B; margin: 5px 0 0 0; font-weight: 800; font-size: 18px;">Dan Multi-Activities</p>
        </div>
        <div style="text-align: left;">
          <h2 style="margin: 0; color: #64748b; font-size: 16px;">فاتورة طلب رقم</h2>
          <p style="margin: 5px 0 0 0; font-weight: 900; color: #1e293b; font-size: 24px;">${order.id}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-bottom: 50px;">
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 20px;">
          <h3 style="color: #004AAD; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; margin-top: 0; font-size: 18px;">تفاصيل العميل</h3>
          <p style="margin: 10px 0;"><strong>الاسم:</strong> ${order.customerName}</p>
          <p style="margin: 10px 0;"><strong>الجوال:</strong> ${order.phone}</p>
          <p style="margin: 10px 0;"><strong>العنوان:</strong> ${order.address}</p>
        </div>
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 20px;">
          <h3 style="color: #004AAD; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px; margin-top: 0; font-size: 18px;">معلومات الفاتورة</h3>
          <p style="margin: 10px 0;"><strong>التاريخ:</strong> ${order.date}</p>
          <p style="margin: 10px 0;"><strong>الحالة:</strong> ${order.status}</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 40px; border-radius: 15px; overflow: hidden; border: 1px solid #e2e8f0;">
        <thead>
          <tr style="background-color: #004AAD; color: white;">
            <th style="padding: 18px; text-align: right; font-weight: 900;">الصنف</th>
            <th style="padding: 18px; text-align: center; font-weight: 900;">الكمية</th>
            <th style="padding: 18px; text-align: center; font-weight: 900;">سعر الوحدة</th>
            <th style="padding: 18px; text-align: left; font-weight: 900;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(item => `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 16px; font-weight: 700; color: #334155; border-bottom: 1px solid #f1f5f9;">${item.name}</td>
              <td style="padding: 16px; text-align: center; color: #64748b; border-bottom: 1px solid #f1f5f9;">${item.quantity}</td>
              <td style="padding: 16px; text-align: center; color: #64748b; border-bottom: 1px solid #f1f5f9;">${safePrice(item.price)} SDG</td>
              <td style="padding: 16px; text-align: left; font-weight: 800; color: #004AAD; border-bottom: 1px solid #f1f5f9;">${safePrice(item.quantity * item.price)} SDG</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-top: 40px; border-top: 3px solid #004AAD; padding-top: 25px;">
        <div style="text-align: left;">
          <span style="color: #64748b; font-size: 18px; font-weight: 700; margin-left: 20px;">الإجمالي الكلي:</span>
          <span style="color: #F2545B; font-size: 32px; font-weight: 900;">${safePrice(order.totalAmount)} SDG</span>
        </div>
      </div>

      <div style="margin-top: 80px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 30px;">
        <p style="color: #94a3b8; font-size: 14px; font-weight: 700;">شكراً لتعاملك مع شركة دان للأنشطة المتعددة. نحن هنا دائماً لخدمتك.</p>
        <p style="color: #004AAD; font-weight: 900; margin-top: 10px; font-size: 14px;">Powered by Astric Company | Technical Support: +249127556666</p>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Ensure Tajawal font is applied to cloned content
        const element = clonedDoc.querySelector('div') as HTMLElement;
        if (element) element.style.fontFamily = "'Tajawal', sans-serif";
      }
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Dan_Invoice_${order.id || 'Order'}.pdf`);
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("عذراً، حدث خطأ أثناء محاولة تصدير الفاتورة.");
  } finally {
    document.body.removeChild(container);
  }
};
