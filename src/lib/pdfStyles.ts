import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #10b981",
    paddingBottom: 15,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 5,
  },
  storeInfo: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 3,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    color: "#1e293b",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#475569",
    textTransform: "uppercase",
  },
  text: {
    fontSize: 11,
    marginBottom: 4,
    color: "#334155",
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
    color: "#475569",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e2e8f0",
    padding: 8,
    fontSize: 10,
  },
  col1: { width: "50%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "15%", textAlign: "right" },

  deliverySection: {
    marginTop: 15,
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#eff6ff",
    borderRadius: 4,
    borderLeft: "3px solid #3b82f6",
  },
  deliveryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 6,
  },
  deliveryText: {
    fontSize: 10,
    color: "#334155",
    marginBottom: 3,
  },
  deliveryBadge: {
    fontSize: 9,
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
    padding: "4px 8px",
    borderRadius: 3,
    marginTop: 4,
  },

  summarySection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: "1px solid #e2e8f0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 11,
    color: "#334155",
    fontWeight: "bold",
  },
  summaryDeliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f8fafc",
    padding: 6,
    borderRadius: 3,
  },
  summaryDeliveryLabel: {
    fontSize: 11,
    color: "#3b82f6",
    flexDirection: "row",
    alignItems: "center",
  },
  summaryDeliveryValue: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "bold",
  },

  total: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingHorizontal: 10,
    borderTop: "2px solid #10b981",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#94a3b8",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
  },
});
