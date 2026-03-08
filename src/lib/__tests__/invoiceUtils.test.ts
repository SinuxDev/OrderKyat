import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getInitials,
  formatDate,
  generateFileName,
  generateSequentialInvoiceNumber,
} from "../invoiceUtils";

// ---------------------------------------------------------------------------
// invoiceUtils — integration tests
// Covers the pure utility functions used when generating invoice metadata:
// initials, date formatting, file name construction, and sequential numbering.
// ---------------------------------------------------------------------------

describe("getInitials", () => {
  it("returns the first letter of a single word, uppercased", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("returns initials for a multi-word name", () => {
    expect(getInitials("Ko Aung Naing")).toBe("KAN");
  });

  it("upper-cases each initial regardless of input case", () => {
    expect(getInitials("ma may")).toBe("MM");
  });

  it("handles extra whitespace between words", () => {
    expect(getInitials("  Su   Su  ")).toBe("SS");
  });

  it("returns empty string for an empty input", () => {
    expect(getInitials("")).toBe("");
  });
});

// ---------------------------------------------------------------------------

describe("formatDate", () => {
  it("formats a timestamp into YYMMDD", () => {
    // 2024-03-05 UTC → 240305
    const ts = new Date("2024-03-05T00:00:00Z").getTime();
    // Use local date components to avoid TZ issues in assertions
    const d = new Date(ts);
    const expected = `${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    expect(formatDate(ts)).toBe(expected);
  });

  it("zero-pads single-digit month and day", () => {
    // 2025-01-07
    const ts = new Date("2025-01-07T12:00:00").getTime();
    const result = formatDate(ts);
    // Month segment is chars 2-3, day segment is chars 4-5
    expect(result.charAt(2)).toBe("0"); // month 01
    expect(result.charAt(4)).toBe("0"); // day 07
  });

  it("returns a 6-character string", () => {
    const ts = new Date("2026-12-31T00:00:00").getTime();
    expect(formatDate(ts)).toHaveLength(6);
  });
});

// ---------------------------------------------------------------------------

describe("generateFileName", () => {
  it("produces the expected INV-<store>-<customer>-<date>.pdf format", () => {
    const ts = new Date("2024-06-15T00:00:00").getTime();
    const result = generateFileName("Order Kyat", "Ko Zin", ts);
    const dateStr = formatDate(ts);
    expect(result).toBe(`INV-OK-KZ-${dateStr}.pdf`);
  });

  it("uses 'OrderKyat' initials when storeName is empty", () => {
    const ts = new Date("2024-06-15T00:00:00").getTime();
    const result = generateFileName("", "Su Su", ts);
    expect(result.startsWith("INV-O-")).toBe(true);
  });

  it("uses 'Customer' initials when customerName is empty", () => {
    const ts = new Date("2024-06-15T00:00:00").getTime();
    const result = generateFileName("My Shop", "", ts);
    expect(result).toContain("-C-");
  });

  it("always ends with .pdf", () => {
    const ts = Date.now();
    expect(generateFileName("Shop", "Name", ts).endsWith(".pdf")).toBe(true);
  });

  it("always starts with INV-", () => {
    expect(generateFileName("Shop", "Name", Date.now()).startsWith("INV-")).toBe(true);
  });
});

// ---------------------------------------------------------------------------

describe("generateSequentialInvoiceNumber", () => {
  // localStorage is not available in the test (jsdom) environment unless
  // we stub it. Vitest runs in node by default, so we provide a minimal mock.
  const store: Record<string, string> = {};

  beforeEach(() => {
    // Reset in-memory store between tests
    for (const k of Object.keys(store)) delete store[k];

    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    });
  });

  it("returns a string starting with INV-<year>-", () => {
    const result = generateSequentialInvoiceNumber();
    const year = new Date().getFullYear();
    expect(result).toMatch(new RegExp(`^INV-${year}-\\d{4}$`));
  });

  it("starts counting from 0001 when localStorage is empty", () => {
    const result = generateSequentialInvoiceNumber();
    expect(result.endsWith("-0001")).toBe(true);
  });

  it("increments by 1 on each successive call", () => {
    const first = generateSequentialInvoiceNumber();
    const second = generateSequentialInvoiceNumber();
    const third = generateSequentialInvoiceNumber();

    const num = (s: string) => parseInt(s.split("-").pop()!);
    expect(num(second)).toBe(num(first) + 1);
    expect(num(third)).toBe(num(first) + 2);
  });

  it("zero-pads the counter to 4 digits", () => {
    // Simulate counter already at 9
    const year = new Date().getFullYear();
    store[`orderkyat_invoice_counter_${year}`] = "9";
    const result = generateSequentialInvoiceNumber();
    expect(result.endsWith("-0010")).toBe(true);
  });
});
