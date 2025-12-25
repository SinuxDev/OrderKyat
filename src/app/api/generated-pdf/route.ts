import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { ExtractedData } from "@/types/invoice";

export async function POST(request: NextRequest) {
  try {
    const data: ExtractedData = await request.json();

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
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
