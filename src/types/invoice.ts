export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ExtractedData {
  customerName: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  totalPrice: number;
}

export interface StoreInfo {
  name: string;
  phone: string;
  address: string;
  logo?: string;
}
