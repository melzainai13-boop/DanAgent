
export type OrderStatus = 'جديد' | 'تم التواصل' | 'مكتمل' | 'ملغي';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
}

export interface AgentConfig {
  contactNumber: string;
  welcomeMessage: string;
  confirmationMessage: string;
  outOfStockMessage: string;
  addressPrompt: string;
  additionalInfo: string; // حقل جديد لمعلومات الشركة العامة
}
