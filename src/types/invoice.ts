export interface InvoiceItem {
  id: string;
  quantity: number;
  name: string;
  price: number;
}

export type DeliveryType =
  | "Cash on Delivery"
  | "Prepaid"
  | "Self Pickup"
  | "Free Delivery";

export interface ExtractedData {
  customerName: string;
  phone: string;
  address: string;
  items: InvoiceItem[];
  totalPrice: number;
  deliveryType?: DeliveryType;
  deliveryFee?: number;
}

export interface StoreInfo {
  name: string;
  phone: string;
  address: string;
  logo?: string;
}
