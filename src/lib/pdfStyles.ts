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
  total: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 15,
    borderTop: "2px solid #10b981",
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
