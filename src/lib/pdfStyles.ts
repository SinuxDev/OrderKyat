import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  // Page Layout
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 10,
  },

  // ==================== HEADER SECTION ====================
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "3px solid #2563eb", // Blue brand color
  },
  headerLeft: {
    flexDirection: "column",
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563eb", // Blue
    marginBottom: 4,
    letterSpacing: 1,
  },
  brandName: {
    fontSize: 12,
    color: "#6b7280", // Gray
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937", // Dark gray
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 10,
    color: "#6b7280",
  },

  // ==================== INFO SECTION ====================
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 15,
  },
  infoBox: {
    width: "48%",
    padding: 16,
    backgroundColor: "#f9fafb", // Light gray background
    borderRadius: 6,
    borderLeft: "3px solid #4f46e5", // Indigo accent
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#4f46e5", // Indigo
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  infoNamePrimary: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 3,
    lineHeight: 1.4,
  },

  // ==================== TABLE SECTION ====================
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4f46e5", // Indigo
    padding: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    padding: 12,
    backgroundColor: "#ffffff",
  },

  // TABLE HEADER COLUMNS (White text on indigo background)
  col1: {
    width: "45%",
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff", // White for header
  },
  col2: {
    width: "15%",
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  col3: {
    width: "20%",
    textAlign: "right",
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  col4: {
    width: "20%",
    textAlign: "right",
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },

  // TABLE ROW COLUMNS (Dark text on white background) - NEW!
  rowCol1: {
    width: "45%",
    fontSize: 10,
    color: "#374151", // Dark gray for rows
  },
  rowCol2: {
    width: "15%",
    textAlign: "center",
    fontSize: 10,
    color: "#374151",
  },
  rowCol3: {
    width: "20%",
    textAlign: "right",
    fontSize: 10,
    color: "#374151",
  },
  rowCol4: {
    width: "20%",
    textAlign: "right",
    fontSize: 10,
    color: "#374151",
    fontWeight: "bold", // Make total bold
  },

  // ==================== DELIVERY BADGE ====================
  deliveryBadgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 15,
    paddingRight: 5,
  },
  deliveryBadgeLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginRight: 8,
  },
  deliveryBadgeValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4f46e5", // Indigo
    backgroundColor: "#eef2ff", // Light indigo
    padding: "5 12",
    borderRadius: 4,
  },

  // ==================== SUMMARY SECTION ====================
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  summaryBox: {
    width: "45%",
    minWidth: 200,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottom: "1px solid #e5e7eb",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 11,
    color: "#1f2937",
    fontWeight: "bold",
  },
  freeDeliveryText: {
    fontSize: 11,
    color: "#10b981", // Green
    fontWeight: "bold",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 5,
  },

  // Grand Total - Highlighted
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2563eb", // Blue
    padding: 14,
    borderRadius: 6,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },

  // ==================== FOOTER ====================
  footer: {
    position: "absolute",
    bottom: 35,
    left: 40,
    right: 40,
    textAlign: "center",
    paddingTop: 15,
    borderTop: "1px solid #e5e7eb",
  },
  footerThankYou: {
    fontSize: 11,
    color: "#4b5563",
    marginBottom: 5,
  },
  footerBrand: {
    fontSize: 9,
    color: "#9ca3af",
  },
});
