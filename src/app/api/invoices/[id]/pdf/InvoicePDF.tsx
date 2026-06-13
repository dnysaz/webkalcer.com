import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a2e", position: "relative" },
  watermark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.08,
    transform: "rotate(-30deg)",
  },
  watermarkImg: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  watermarkText: {
    fontSize: 60,
    fontWeight: 900,
    color: "#1a1a2e",
    letterSpacing: 4,
  },
  header: { flexDirection: "row", justifyContent: "space-between", borderBottom: "3 solid #ff3366", paddingBottom: 16, marginBottom: 24 },
  headerLeft: { flexDirection: "row", gap: 12, alignItems: "center" },
  logo: { width: "auto", height: 40 },
  companyName: { fontSize: 16, fontWeight: 900 },
  companyDetail: { fontSize: 9, color: "#666", marginTop: 2 },
  invoiceTitle: { fontSize: 22, fontWeight: 900 },
  invoiceNumber: { fontSize: 9, color: "#666", marginTop: 2, textAlign: "right" },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  infoBlock: { gap: 2 },
  infoLabel: { fontSize: 8, color: "#999", textTransform: "uppercase", letterSpacing: 1 },
  infoValue: { fontSize: 11, fontWeight: 700 },
  infoSecondary: { fontSize: 10, color: "#666" },
  table: { marginBottom: 24 },
  tableHeader: { flexDirection: "row", backgroundColor: "#fff0f3", padding: "8 12" },
  tableHeaderCell: { fontSize: 8, color: "#666", textTransform: "uppercase", letterSpacing: 1 },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #eee", padding: "8 12" },
  tableCell: { fontSize: 10 },
  badge: { backgroundColor: "#ccfbf1", color: "#0d9488", fontSize: 7, fontWeight: 700, padding: "1 6", borderRadius: 4, marginRight: 4 },
  totals: { width: "60%", alignSelf: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, fontSize: 10 },
  totalBorder: { borderTop: "2 solid #1a1a2e", paddingTop: 8, marginTop: 4, fontSize: 14, fontWeight: 900 },
  vaBox: { border: "1.5 solid #ff3366", borderRadius: 4, padding: "8 12", marginBottom: 20, alignSelf: "flex-start" },
  vaLabel: { fontSize: 7, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  vaValue: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  vaNumber: { fontSize: 14, fontWeight: 900, color: "#ff3366", letterSpacing: 1 },
  vaHelp: { fontSize: 8, color: "#999", marginTop: 4 },
  paidBox: { backgroundColor: "#ecfdf5", borderRadius: 4, padding: "12 16", marginBottom: 20, alignSelf: "flex-start", width: "100%" },
  paidRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  paidIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#bbf7d0", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#166534" },
  paidTitle: { fontSize: 14, fontWeight: 900, color: "#166534", marginBottom: 2 },
  paidDetail: { fontSize: 9, color: "#15803d" },
  footerDisclaimer: {
    borderTop: "1 solid #eee",
    paddingTop: 16,
    marginTop: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999",
  },
  footerDisclaimerEm: {
    fontSize: 9,
    fontWeight: 700,
    color: "#666",
    marginBottom: 2,
  },
});

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
function formatDateTime(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

interface InvoiceData {
  invoice: {
    invoice_number: string;
    customer_name: string;
    customer_email?: string | null;
    customer_phone?: string | null;
    created_at: string;
    paid_at?: string | null;
    status: string;
    subtotal: number;
    discount: number;
    tax: number;
    tax_percentage: number;
    grand_total: number;
    va_bank?: string | null;
    va_number?: string | null;
    notes?: string | null;
  };
  items: Array<{
    description: string;
    price: number;
    package_id?: number | null;
  }>;
  seo: {
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    favicon_url?: string | null;
  };
  emojiSrc: string;
}

export default function InvoicePDF({ invoice, items, seo, emojiSrc }: InvoiceData) {
  const statusLabel: Record<string, string> = {
    draft: "Draft", pending: "Pending", paid: "Paid", cancelled: "Cancelled",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <View style={styles.watermark}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {emojiSrc && <Image style={styles.watermarkImg} src={emojiSrc} />}
          <Text style={styles.watermarkText}>webkalcer.com</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {seo?.favicon_url && <Image style={styles.logo} src={seo.favicon_url} />}
            <View>
              <Text style={styles.companyName}>{seo?.title || "Webkalcer"}</Text>
              <View style={styles.companyDetail}>
                {seo?.email && <Text>Email: {seo.email}</Text>}
                {seo?.phone && <Text>Phone: {seo.phone}</Text>}
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoValue}>{invoice.customer_name}</Text>
            {invoice.customer_email && <Text style={styles.infoSecondary}>{invoice.customer_email}</Text>}
            {invoice.customer_phone && <Text style={styles.infoSecondary}>{invoice.customer_phone}</Text>}
          </View>
          <View style={[styles.infoBlock, { alignItems: "flex-end" }]}>
            <Text style={styles.infoLabel}>Invoice Date</Text>
            <Text style={styles.infoValue}>{formatDate(invoice.created_at)}</Text>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{statusLabel[invoice.status] || invoice.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "70%" }]}>Description</Text>
            <Text style={[styles.tableHeaderCell, { width: "30%", textAlign: "right" }]}>Amount</Text>
          </View>
          {items.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { color: "#999", textAlign: "center", width: "100%" }]}>No items</Text>
            </View>
          ) : items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "70%", flexDirection: "row", alignItems: "center" }]}>
                {item.package_id && <Text style={styles.badge}>PACKAGE </Text>}
                <Text>{item.description}</Text>
              </Text>
              <Text style={[styles.tableCell, { width: "30%", textAlign: "right" }]}>{formatPrice(item.price)}</Text>
            </View>
          ))}
        </View>

        {invoice.va_bank && invoice.va_number && invoice.status === "paid" ? (
          <View style={styles.paidBox}>
            <View style={styles.paidRow}>
              <View style={styles.paidIcon}>
                <Text>✓</Text>
              </View>
              <View>
                <Text style={styles.paidTitle}>Paid</Text>
                <Text style={styles.paidDetail}>via {invoice.va_bank} — {invoice.va_number}</Text>
                {invoice.paid_at && (
                  <Text style={styles.paidDetail}>{formatDateTime(invoice.paid_at)}</Text>
                )}
              </View>
            </View>
          </View>
        ) : invoice.va_bank && invoice.va_number ? (
          <View style={styles.vaBox}>
            <Text style={styles.vaLabel}>Bank</Text>
            <Text style={styles.vaValue}>{invoice.va_bank}</Text>
            <Text style={styles.vaLabel}>Virtual Account Number</Text>
            <Text style={styles.vaNumber}>{invoice.va_number}</Text>
            <Text style={styles.vaHelp}>
              If you have any issues with payment, please contact WhatsApp {seo?.phone || ""} or email {seo?.email || ""}.
            </Text>
          </View>
        ) : null}

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{formatPrice(invoice.subtotal)}</Text>
          </View>
          {Number(invoice.discount) > 0 && (
            <View style={[styles.totalRow, { color: "#e63946" }]}>
              <Text>Discount</Text>
              <Text>-{formatPrice(invoice.discount)}</Text>
            </View>
          )}
          {Number(invoice.tax) > 0 && (
            <View style={styles.totalRow}>
              <Text>Tax {Number(invoice.tax_percentage) > 0 ? `(${invoice.tax_percentage}%)` : ""}</Text>
              <Text>{formatPrice(invoice.tax)}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.totalBorder]}>
            <Text>Grand Total</Text>
            <Text>{formatPrice(invoice.grand_total)}</Text>
          </View>
        </View>

        <Text style={styles.footerDisclaimer}>
          <Text style={styles.footerDisclaimerEm}>This payment receipt is legally valid.</Text>{'\n'}
          {seo?.title || "Webkalcer"} — Thank you for your business!
        </Text>
      </Page>
    </Document>
  );
}
