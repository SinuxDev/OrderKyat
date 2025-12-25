import { ExtractedData, InvoiceItem } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";

export function extractInvoiceData(text: string): ExtractedData {
  const phoneRegex = /09\d{7,9}/;
  const phoneMatch = text.match(phoneRegex);

  const priceRegex = /(\d+(?:,\d{3})*)\s*(?:ks|kyat|MMK)/i;
  const priceMatch = text.match(priceRegex);

  const addressRegex =
    /(?:send to|deliver to|address:?)\s*([^,]+(?:Yangon|Mandalay|Naypyidaw)[^,]*)/i;
  const addressMatch = text.match(addressRegex);

  const itemsRegex = /(\d+)\s+([a-zA-Z\s]+(?:shirt|bag|pants|shoes|item)s?)/gi;
  const itemsMatches = Array.from(text.matchAll(itemsRegex));

  const nameRegex = /^([A-Za-z\s]+?)(?=,|\s*\d)/;
  const nameMatch = text.match(nameRegex);

  const items: InvoiceItem[] = itemsMatches.map((match) => ({
    id: uuidv4(),
    quantity: parseInt(match[1]),
    name: match[2].trim(),
    price: 0,
  }));

  return {
    customerName: nameMatch?.[1]?.trim() || "",
    phone: phoneMatch?.[0] || "",
    address: addressMatch?.[1]?.trim() || "",
    items,
    totalPrice: priceMatch ? parseInt(priceMatch[1].replace(/,/g, "")) : 0,
  };
}
