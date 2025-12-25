import { ExtractedData, InvoiceItem } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";

export function extractInvoiceData(text: string): ExtractedData {
  const cleanText = text.trim();

  // Extract customer name (before first comma)
  const nameRegex = /^([A-Za-z\s]+?)(?=,)/;
  const nameMatch = cleanText.match(nameRegex);
  const customerName = nameMatch?.[1]?.trim() || "";

  // Extract phone number
  const phoneRegex = /(\+?959\d{7,9}|09\d{7,9})/;
  const phoneMatch = cleanText.match(phoneRegex);
  const phone = phoneMatch?.[0] || "";

  // Extract city/address
  const cityRegex =
    /(yangon|mandalay|naypyidaw|bago|mawlamyine|pathein|monywa|sittwe|taunggyi|meiktila)/i;
  const cityMatch = cleanText.match(cityRegex);
  const address = cityMatch?.[0] || "";

  // UPDATED: Extract items with prices - supports both () and @
  // Pattern: "2 shirts (30000)" OR "2 shirts @ 30000"
  const itemsRegex =
    /(\d+)\s+([a-zA-Z\s]+?)\s*(?:\((\d+(?:,\d{3})*)\)|@\s*(\d+(?:,\d{3})*))/gi;
  const itemsMatches = Array.from(cleanText.matchAll(itemsRegex));

  let totalPrice = 0;

  const items: InvoiceItem[] = itemsMatches.map((match) => {
    const quantity = parseInt(match[1]);
    const name = match[2].trim();
    // Price can be in match[3] (parentheses) or match[4] (@)
    const priceString = match[3] || match[4];
    const price = parseInt(priceString.replace(/,/g, ""));

    // Calculate subtotal for this item
    const subtotal = quantity * price;
    totalPrice += subtotal;

    return {
      id: uuidv4(),
      quantity,
      name,
      price,
    };
  });

  return {
    customerName,
    phone,
    address,
    items,
    totalPrice,
  };
}
