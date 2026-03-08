import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { z } from "zod";
import { logger } from "@/lib/logger";

const InvoiceItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
});

const ExtractedDataSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
  totalPrice: z.number().nonnegative(),
  deliveryType: z
    .enum(["Cash on Delivery", "Prepaid", "Self Pickup", "Free Delivery"])
    .optional(),
  deliveryFee: z.number().nonnegative().optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const parsed = ExtractedDataSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    await new Promise<void>((resolve, reject) => {
      doc.on("end", () => resolve());
      doc.on("error", reject);

      doc.fontSize(24).text("INVOICE", { align: "center" });
      doc.moveDown();
      doc
        .fontSize(10)
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
      doc.moveDown(2);

      doc.fontSize(14).text("Bill To:", { underline: true });
      doc.fontSize(12).text(data.customerName);
      doc.text(data.phone);
      doc.text(data.address);
      doc.moveDown(2);

      doc.fontSize(14).text("Items:", { underline: true });
      doc.moveDown(0.5);

      data.items.forEach((item) => {
        doc
          .fontSize(11)
          .text(
            `${item.quantity} x ${item.name} - ${item.price} Ks = ${
              item.quantity * item.price
            } Ks`
          );
      });

      doc.moveDown(2);
      doc.fontSize(16).text(`Total: ${data.totalPrice} Ks`, { align: "right" });

      doc.end();
    });

    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${Date.now()}.pdf`,
      },
    });
  } catch (error) {
    logger.error("PDF generation error", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
