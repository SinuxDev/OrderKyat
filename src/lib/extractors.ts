import { ExtractedData, InvoiceItem } from "@/types/invoice";
import { v4 as uuidv4 } from "uuid";
import { MYANMAR_CITIES } from "@/lib/cities";

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

  // ✅ Extract address BEFORE items
  const address = extractAddress(cleanText);

  // ✅ UPDATED: Extract items - now works with comma separation
  // Pattern: "2 shirts @ 15000" OR "2 shirts (15000)"
  const itemsRegex =
    /(\d+)\s+([a-zA-Z\s]+?)\s*(?:@\s*(\d+(?:,\d{3})*)|[\(@]\s*(\d+(?:,\d{3})*)\)?)/gi;
  const itemsMatches = Array.from(cleanText.matchAll(itemsRegex));

  let totalPrice = 0;

  const items: InvoiceItem[] = itemsMatches.map((match) => {
    const quantity = parseInt(match[1]);
    const name = match[2].trim();
    // Price can be in match[3] (@ format) or match[4] (parentheses)
    const priceString = match[3] || match[4];
    const price = parseInt(priceString.replace(/,/g, ""));

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

// ✅ UPDATED: Improved address extraction for comma-separated format
function extractAddress(text: string): string {
  // 1. Try to find known cities first
  const cityRegex = new RegExp(`\\b(${MYANMAR_CITIES.join("|")})\\b`, "i");
  const cityMatch = text.match(cityRegex);

  if (cityMatch) {
    return cityMatch[0];
  }

  // 2. Extract city after last item price
  // Find all prices in the text
  const allPrices = Array.from(
    text.matchAll(/(?:@|[\(])\s*(\d+(?:,\d{3})*)\)?/g)
  );

  if (allPrices.length > 0) {
    // Get the last price match
    const lastPrice = allPrices[allPrices.length - 1];
    const lastPriceEnd = (lastPrice.index || 0) + lastPrice[0].length;

    // Get text after the last price
    const remainingText = text.substring(lastPriceEnd).trim();

    // Remove leading comma and whitespace
    const cleaned = remainingText.replace(/^[,\s]+/, "").trim();

    // Validate: letters only, reasonable length, not empty
    if (cleaned.length >= 2 && cleaned.length <= 50) {
      const onlyLetters = /^[a-zA-Z\s]+$/.test(cleaned);
      const notFillerWord = !["and", "or", "with", "plus"].includes(
        cleaned.toLowerCase()
      );

      if (onlyLetters && notFillerWord) {
        return cleaned;
      }
    }
  }

  return "";
}
