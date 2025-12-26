import { Document, Page, Text, View } from "@react-pdf/renderer";
import { ExtractedData } from "@/types/invoice";
import { StoreInfo } from "@/components/organisms/StoreSettings";
import { pdfStyles } from "@/lib/pdfStyles";

interface InvoicePDFDocumentProps {
  data: ExtractedData;
  storeInfo: StoreInfo;
  invoiceNumber?: string;
}

export default function InvoicePDFDocument({
  data,
  storeInfo,
  invoiceNumber,
}: InvoicePDFDocumentProps) {
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const deliveryFee = data.deliveryFee || 0;
  const grandTotal = subtotal + deliveryFee;

  // Use provided invoice number or static fallback
  const invoiceNo = invoiceNumber || "INV-2025-0000";

  const invoiceDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header Section */}
        <View style={pdfStyles.headerContainer}>
          <View style={pdfStyles.headerLeft}>
            <Text style={pdfStyles.invoiceTitle}>INVOICE</Text>
            <Text style={pdfStyles.brandName}>OrderKyat</Text>
          </View>
          <View style={pdfStyles.headerRight}>
            <Text style={pdfStyles.invoiceNumber}>{invoiceNo}</Text>
            <Text style={pdfStyles.invoiceDate}>{invoiceDate}</Text>
          </View>
        </View>

        {/* Store and Customer Info */}
        <View style={pdfStyles.infoContainer}>
          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.infoLabel}>FROM</Text>
            <Text style={pdfStyles.infoNamePrimary}>
              {storeInfo.name || "OrderKyat"}
            </Text>
            <Text style={pdfStyles.infoText}>
              {storeInfo.phone || "+95 9 123 456 789"}
            </Text>
            <Text style={pdfStyles.infoText}>
              {storeInfo.address || "Yangon, Myanmar"}
            </Text>
          </View>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.infoLabel}>BILL TO</Text>
            <Text style={pdfStyles.infoNamePrimary}>{data.customerName}</Text>
            <Text style={pdfStyles.infoText}>{data.phone}</Text>
            {data.address && (
              <Text style={pdfStyles.infoText}>{data.address}</Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.col1}>ITEM DESCRIPTION</Text>
            <Text style={pdfStyles.col2}>QTY</Text>
            <Text style={pdfStyles.col3}>PRICE</Text>
            <Text style={pdfStyles.col4}>TOTAL</Text>
          </View>

          {data.items.map((item, index) => (
            <View key={index} style={pdfStyles.tableRow}>
              <Text style={pdfStyles.rowCol1}>{item.name}</Text>
              <Text style={pdfStyles.rowCol2}>{item.quantity}</Text>
              <Text style={pdfStyles.rowCol3}>
                {item.price.toLocaleString()} Ks
              </Text>
              <Text style={pdfStyles.rowCol4}>
                {(item.quantity * item.price).toLocaleString()} Ks
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery Badge */}
        {data.deliveryType && (
          <View style={pdfStyles.deliveryBadgeContainer}>
            <Text style={pdfStyles.deliveryBadgeLabel}>Delivery Method:</Text>
            <Text style={pdfStyles.deliveryBadgeValue}>
              {data.deliveryType}
            </Text>
          </View>
        )}

        {/* Summary */}
        <View style={pdfStyles.summaryContainer}>
          <View style={pdfStyles.summaryBox}>
            <View style={pdfStyles.summaryRow}>
              <Text style={pdfStyles.summaryLabel}>Subtotal</Text>
              <Text style={pdfStyles.summaryValue}>
                {subtotal.toLocaleString()} Ks
              </Text>
            </View>

            {deliveryFee > 0 ? (
              <View style={pdfStyles.summaryRow}>
                <Text style={pdfStyles.summaryLabel}>Delivery Fee</Text>
                <Text style={pdfStyles.summaryValue}>
                  {deliveryFee.toLocaleString()} Ks
                </Text>
              </View>
            ) : (
              data.deliveryType && (
                <View style={pdfStyles.summaryRow}>
                  <Text style={pdfStyles.summaryLabel}>Delivery Fee</Text>
                  <Text style={pdfStyles.freeDeliveryText}>FREE</Text>
                </View>
              )
            )}

            <View style={pdfStyles.summaryDivider} />

            <View style={pdfStyles.grandTotalRow}>
              <Text style={pdfStyles.grandTotalLabel}>GRAND TOTAL</Text>
              <Text style={pdfStyles.grandTotalValue}>
                {grandTotal.toLocaleString()} Ks
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerThankYou}>
            Thank you for your business!
          </Text>
          <Text style={pdfStyles.footerBrand}>
            Generated by OrderKyat - Myanmar&apos;s Smart Invoice Generator 🇲🇲
          </Text>
        </View>
      </Page>
    </Document>
  );
}
