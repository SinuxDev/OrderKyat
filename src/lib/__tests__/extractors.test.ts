import { describe, it, expect } from "vitest";
import { extractInvoiceData } from "../extractors";

// ---------------------------------------------------------------------------
// extractInvoiceData — integration tests
// These tests cover the core parsing logic that converts raw chat text into
// structured invoice data. This is the single most important function in the
// codebase because every invoice depends on it being correct.
// ---------------------------------------------------------------------------

describe("extractInvoiceData", () => {
  // -------------------------------------------------------------------------
  // Customer name extraction
  // -------------------------------------------------------------------------
  describe("customer name", () => {
    it("extracts a single-word name before the first comma", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 1 shirt @ 15000, Yangon"
      );
      expect(result.customerName).toBe("Mg Mg");
    });

    it("extracts a multi-word name", () => {
      const result = extractInvoiceData(
        "Ko Aung Naing, 09987654321, 2 bags @ 50000"
      );
      expect(result.customerName).toBe("Ko Aung Naing");
    });

    it("returns empty string when no comma-separated name is found", () => {
      const result = extractInvoiceData("09123456789, 1 shirt @ 15000");
      expect(result.customerName).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // Phone number extraction
  // -------------------------------------------------------------------------
  describe("phone number", () => {
    it("extracts a 09-prefix Myanmar phone number", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 1 shirt @ 15000"
      );
      expect(result.phone).toBe("09123456789");
    });

    it("extracts a +959-prefix phone number", () => {
      const result = extractInvoiceData(
        "Su Su, +959987654321, 1 bag @ 25000"
      );
      expect(result.phone).toBe("+959987654321");
    });

    it("returns empty string when no phone number is present", () => {
      const result = extractInvoiceData("Mg Mg, 1 shirt @ 15000, Yangon");
      expect(result.phone).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // Item extraction
  // -------------------------------------------------------------------------
  describe("items", () => {
    it("extracts a single item with @ syntax", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 2 shirts @ 15000"
      );
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(2);
      expect(result.items[0].name).toBe("shirts");
      expect(result.items[0].price).toBe(15000);
    });

    it("extracts multiple items", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 2 shirts @ 15000, 3 bags @ 100000, Yangon"
      );
      expect(result.items).toHaveLength(2);
    });

    it("correctly sets item id as a non-empty string (UUID)", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 1 hat @ 5000"
      );
      expect(result.items[0].id).toBeTruthy();
      expect(typeof result.items[0].id).toBe("string");
    });

    it("handles prices formatted with commas (e.g. 15,000)", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 1 shirt @ 15,000"
      );
      expect(result.items[0].price).toBe(15000);
    });

    it("returns empty items array when no items are found", () => {
      const result = extractInvoiceData("Mg Mg, 09123456789, Yangon");
      expect(result.items).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Total price calculation
  // -------------------------------------------------------------------------
  describe("totalPrice", () => {
    it("calculates the correct total for a single item", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 2 shirts @ 15000"
      );
      // 2 * 15000 = 30000
      expect(result.totalPrice).toBe(30000);
    });

    it("calculates the correct total for multiple items", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 2 shirts @ 15000, 3 bags @ 10000"
      );
      // (2 * 15000) + (3 * 10000) = 30000 + 30000 = 60000
      expect(result.totalPrice).toBe(60000);
    });

    it("returns 0 total when no items are parsed", () => {
      const result = extractInvoiceData("Mg Mg, 09123456789");
      expect(result.totalPrice).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // Address extraction
  // -------------------------------------------------------------------------
  describe("address", () => {
    it("extracts a Myanmar city name", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 2 shirts @ 15000, Yangon"
      );
      expect(result.address).toBe("Yangon");
    });

    it("is case-insensitive for city matching", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 1 shirt @ 15000, yangon"
      );
      // Should still match even if lowercase
      expect(result.address.toLowerCase()).toBe("yangon");
    });

    it("returns empty string when no address is recognised", () => {
      const result = extractInvoiceData(
        "Mg Mg, 09123456789, 2 shirts @ 15000"
      );
      expect(result.address).toBe("");
    });
  });

  // -------------------------------------------------------------------------
  // Full real-world style input
  // -------------------------------------------------------------------------
  describe("real-world input", () => {
    it("parses a complete, typical order message correctly", () => {
      const input =
        "Ko Zin, 09987654321, 2 shirts @ 15000, 1 trouser @ 35000, Mandalay";
      const result = extractInvoiceData(input);

      expect(result.customerName).toBe("Ko Zin");
      expect(result.phone).toBe("09987654321");
      expect(result.items).toHaveLength(2);
      expect(result.totalPrice).toBe(2 * 15000 + 1 * 35000); // 65000
      expect(result.address).toBe("Mandalay");
    });

    it("handles leading and trailing whitespace gracefully", () => {
      const input =
        "  Ma May  ,  09111222333  ,  3 bags @ 20000  ,  Naypyidaw  ";
      const result = extractInvoiceData(input);
      expect(result.phone).toBe("09111222333");
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(3);
      expect(result.items[0].price).toBe(20000);
    });
  });
});
