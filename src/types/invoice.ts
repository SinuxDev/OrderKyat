export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  totalPrice: number;
  date: string;
  status: "draft" | "completed";
}

export interface ExtractedData {
  customerName: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  totalPrice: number;
}
