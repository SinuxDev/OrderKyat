export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

export function generateFileName(
  storeName: string,
  customerName: string,
  timestamp: number
): string {
  const storeInitials = getInitials(storeName || "OrderKyat");
  const customerInitials = getInitials(customerName || "Customer");
  const dateStr = formatDate(timestamp);
  return `INV-${storeInitials}-${customerInitials}-${dateStr}.pdf`;
}

export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000);
  return `INV-${year}-${String(random).padStart(4, "0")}`;
};

export const generateSequentialInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const key = `orderkyat_invoice_counter_${year}`;

  const counter = parseInt(localStorage.getItem(key) || "0", 10) + 1;

  localStorage.setItem(key, counter.toString());

  return `INV-${year}-${String(counter).padStart(4, "0")}`;
};
