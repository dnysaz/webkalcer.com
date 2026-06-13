import React from "react";
import { Font, Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammT.ttf", fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Roboto", fontSize: 10, color: "#1a1a2e", position: "relative" },
  watermark: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center",
    opacity: 0.06,
    transform: "rotate(-30deg)",
  },
  watermarkText: { fontSize: 60, fontWeight: 900, color: "#1a1a2e", letterSpacing: 4 },
  header: { flexDirection: "row", justifyContent: "space-between", borderBottom: "3 solid #ff3366", paddingBottom: 16, marginBottom: 24 },
  headerLeft: { gap: 4 },
  companyName: { fontSize: 18, fontWeight: 900 },
  companyDetail: { fontSize: 9, color: "#666", marginTop: 2 },
  proposalTitle: { fontSize: 22, fontWeight: 900, textAlign: "right" },
  proposalNumber: { fontSize: 9, color: "#666", marginTop: 2, textAlign: "right" },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  infoBlock: { gap: 2 },
  infoLabel: { fontSize: 8, color: "#999", textTransform: "uppercase", letterSpacing: 1 },
  infoValue: { fontSize: 11, fontWeight: 700 },
  infoSecondary: { fontSize: 10, color: "#666" },
  bodySection: { marginBottom: 24 },
  bodyText: { fontSize: 10, lineHeight: 1.6, color: "#333", marginBottom: 10 },
  greeting: { fontSize: 11, fontWeight: 700, marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: 900, color: "#ff3366", marginBottom: 12, textTransform: "uppercase" },
  table: { marginBottom: 24 },
  tableHeader: { flexDirection: "row", backgroundColor: "#fff0f3", padding: "8 12" },
  tableHeaderCell: { fontSize: 8, color: "#666", textTransform: "uppercase", letterSpacing: 1 },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #eee", padding: "8 12" },
  tableCell: { fontSize: 10 },
  badge: { backgroundColor: "#ccfbf1", color: "#0d9488", fontSize: 7, fontWeight: 700, padding: "1 6", borderRadius: 4, marginRight: 4 },
  totals: { width: "60%", alignSelf: "flex-end" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, fontSize: 10 },
  totalBorder: { borderTop: "2 solid #1a1a2e", paddingTop: 8, marginTop: 4, fontSize: 14, fontWeight: 900 },
  termsBox: {
    border: "1.5 solid #eee",
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
    backgroundColor: "#fafafa",
  },
  termsTitle: { fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" },
  termsText: { fontSize: 9, color: "#555", lineHeight: 1.5, marginBottom: 4 },
  signBox: { marginTop: 32, flexDirection: "row", justifyContent: "space-between" },
  signCol: { alignItems: "center", width: "40%" },
  signLine: { width: "100%", borderTop: "1 solid #333", marginTop: 40, marginBottom: 4 },
  signLabel: { fontSize: 9, color: "#666" },
  footerDisclaimer: { borderTop: "1 solid #eee", paddingTop: 16, marginTop: "auto", textAlign: "center", fontSize: 8, color: "#999" },
  pageNum: { textAlign: "center", fontSize: 8, color: "#aaa", marginTop: 20 },
});

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

interface Translation {
  companyDetail: string;
  proposalTitle: string;
  preparedFor: string;
  proposalDate: string;
  greeting: (n: string) => string;
  intro1: string;
  intro2: string;
  scopeTitle: string;
  serviceHeader: string;
  priceHeader: string;
  badge: string;
  packageDesc: string;
  investment: string;
  subtotal: string;
  discount: string;
  tax: string;
  grandTotal: string;
  notesTitle: string;
  termsTitle: string;
  terms: string[];
  approval: string;
  approvalText: string;
  acceptedBy: string;
  client: string;
  preparedBy: string;
}

const id: Translation = {
  companyDetail: "",
  proposalTitle: "PROPOSAL",
  preparedFor: "Dipersiapkan Untuk",
  proposalDate: "Tanggal Proposal",
  greeting: (n: string) => `Kepada Yth. ${n},`,
  intro1: "",
  intro2: "",
  scopeTitle: "Ruang Lingkup Pekerjaan",
  serviceHeader: "Layanan / Item",
  priceHeader: "Harga",
  badge: "PAKET",
  packageDesc: "",
  investment: "Investasi",
  subtotal: "Subtotal",
  discount: "Diskon",
  tax: "Pajak",
  grandTotal: "Total",
  notesTitle: "Catatan Tambahan",
  termsTitle: "Syarat & Ketentuan",
  terms: [],
  approval: "Persetujuan",
  approvalText: "",
  acceptedBy: "Diterima & Disetujui Oleh",
  client: "Klien",
  preparedBy: "Dipersiapkan Oleh",
};

const en: Translation = {
  companyDetail: "",
  proposalTitle: "PROPOSAL",
  preparedFor: "Prepared For",
  proposalDate: "Proposal Date",
  greeting: (n: string) => `Dear ${n},`,
  intro1: "",
  intro2: "",
  scopeTitle: "Scope of Work",
  serviceHeader: "Service / Item",
  priceHeader: "Price",
  badge: "PACKAGE",
  packageDesc: "",
  investment: "Investment",
  subtotal: "Subtotal",
  discount: "Discount",
  tax: "Tax",
  grandTotal: "Grand Total",
  notesTitle: "Additional Notes",
  termsTitle: "Terms & Conditions",
  terms: [],
  approval: "Approval",
  approvalText: "",
  acceptedBy: "Accepted & Approved By",
  client: "Client",
  preparedBy: "Prepared By",
};

interface ProposalData {
  proposal_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  created_at: string;
  subtotal: number;
  discount: number;
  tax_percentage: number;
  tax: number;
  grand_total: number;
  notes?: string;
  signature_name?: string;
  language?: string;
  items: { description: string; price: number; package_id?: number | null }[];
}

interface SeoData {
  proposal_company_name?: string;
  proposal_title?: string;
  proposal_terms_id?: string;
  proposal_terms_en?: string;
  proposal_opening_id?: string;
  proposal_opening_en?: string;
  proposal_intro2_id?: string;
  proposal_intro2_en?: string;
  proposal_package_desc_id?: string;
  proposal_package_desc_en?: string;
  proposal_slogan_id?: string;
  proposal_slogan_en?: string;
  proposal_closing_id?: string;
  proposal_closing_en?: string;
  logo_url?: string;
  proposal_logo_url?: string;
  phone?: string;
  email?: string;
}

function Page1({ t, proposal, logoUrl, companyName, contactEmail, contactPhone }: { t: Translation; proposal: ProposalData; logoUrl?: string; companyName: string; contactEmail?: string; contactPhone?: string }) {
  const pn = (n: number) => `— ${t.proposalTitle.toLowerCase()} ${proposal.proposal_number} | Page ${n} —`;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>webkalcer.com</Text>
      </View>

      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center", flex: 1 }}>
          {logoUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logoUrl} style={{ width: 40, height: 40, objectFit: "contain" }} />
          )}
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>{companyName}</Text>
            <View style={styles.companyDetail}>
              <Text>{t.companyDetail}</Text>
              <Text>Email: {contactEmail || "halo@webkalcer.com"} | Phone: {contactPhone || "0857-9272-1649"}</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.proposalTitle}>{t.proposalTitle}</Text>
          <Text style={styles.proposalNumber}>{proposal.proposal_number}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>{t.preparedFor}</Text>
          <Text style={styles.infoValue}>{proposal.customer_name}</Text>
          {proposal.customer_email && <Text style={styles.infoSecondary}>{proposal.customer_email}</Text>}
          {proposal.customer_phone && <Text style={styles.infoSecondary}>{proposal.customer_phone}</Text>}
        </View>
        <View style={[styles.infoBlock, { alignItems: "flex-end" }]}>
          <Text style={styles.infoLabel}>{t.proposalDate}</Text>
          <Text style={styles.infoValue}>{formatDate(proposal.created_at)}</Text>
        </View>
      </View>

      <View style={styles.bodySection}>
        <Text style={styles.greeting}>{t.greeting(proposal.customer_name)}</Text>
        <Text style={styles.bodyText}>{t.intro1}</Text>
        <Text style={styles.bodyText}>{t.intro2}</Text>
      </View>

      <View style={styles.bodySection}>
        <Text style={styles.sectionTitle}>{t.scopeTitle}</Text>
        {proposal.items?.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "70%" }]}>{t.serviceHeader}</Text>
              <Text style={[styles.tableHeaderCell, { width: "30%", textAlign: "right" }]}>{t.priceHeader}</Text>
            </View>
            {proposal.items.map((item: { description: string; price: number; package_id?: number | null }, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "70%", flexDirection: "row", alignItems: "center" }]}>
                  {item.package_id && <Text style={styles.badge}>{t.badge} </Text>}
                  <Text>{item.description}</Text>
                </Text>
                <Text style={[styles.tableCell, { width: "30%", textAlign: "right" }]}>{formatPrice(item.price)}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.bodyText}>{t.packageDesc}</Text>
      </View>

      <View style={styles.bodySection}>
        <Text style={styles.sectionTitle}>{t.investment}</Text>
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>{t.subtotal}</Text>
            <Text>{formatPrice(proposal.subtotal)}</Text>
          </View>
          {Number(proposal.discount) > 0 && (
            <View style={[styles.totalRow, { color: "#e63946" }]}>
              <Text>{t.discount}</Text>
              <Text>-{formatPrice(proposal.discount)}</Text>
            </View>
          )}
          {Number(proposal.tax) > 0 && (
            <View style={styles.totalRow}>
              <Text>{t.tax} {Number(proposal.tax_percentage) > 0 ? `(${proposal.tax_percentage}%)` : ""}</Text>
              <Text>{formatPrice(proposal.tax)}</Text>
            </View>
          )}
          <View style={[styles.totalRow, styles.totalBorder]}>
            <Text>{t.grandTotal}</Text>
            <Text>{formatPrice(proposal.grand_total)}</Text>
          </View>
        </View>
      </View>

      {proposal.notes && (
        <View style={styles.bodySection}>
          <Text style={styles.sectionTitle}>{t.notesTitle}</Text>
          <Text style={styles.bodyText}>{proposal.notes}</Text>
        </View>
      )}

      <Text style={styles.pageNum}>{pn(1)}</Text>
    </Page>
  );
}

function Page2({ t, proposal, companyName, contactEmail, contactPhone }: { t: Translation; proposal: ProposalData; companyName: string; contactEmail?: string; contactPhone?: string }) {
  const pn = (n: number) => `— ${t.proposalTitle.toLowerCase()} ${proposal.proposal_number} | Page ${n} —`;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>webkalcer.com</Text>
      </View>

      <View style={styles.termsBox}>
        <Text style={styles.termsTitle}>{t.termsTitle}</Text>
        {t.terms.map((term, i) => (
          <Text key={i} style={styles.termsText}>{i + 1}. {term}</Text>
        ))}
      </View>

      {proposal.signature_name && (
        <View>
          <Text style={styles.sectionTitle}>{t.approval}</Text>
          <Text style={[styles.bodyText, { marginBottom: 20 }]}>
            {t.approvalText}
          </Text>
          <View style={styles.signBox}>
            <View style={styles.signCol}>
              <Text style={styles.signLabel}>{t.acceptedBy}</Text>
              <View style={styles.signLine} />
              <Text style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>{proposal.customer_name}</Text>
              <Text style={{ fontSize: 9, color: "#666" }}>{t.client}</Text>
            </View>
            <View style={styles.signCol}>
              <Text style={styles.signLabel}>{t.preparedBy}</Text>
              <View style={styles.signLine} />
              <Text style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>{proposal.signature_name}</Text>
              <Text style={{ fontSize: 9, color: "#666" }}>{companyName}</Text>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.footerDisclaimer}>
        {companyName} — {t.companyDetail}{'\n'}
        Email: {contactEmail || "halo@webkalcer.com"} | WhatsApp: {contactPhone || "0857-9272-1649"} | www.webkalcer.com
      </Text>

      <Text style={styles.pageNum}>{pn(2)}</Text>
    </Page>
  );
}

export default function ProposalPDF({ proposal, seo }: { proposal: ProposalData; seo?: SeoData }) {
  const isEn = proposal.language === "en";
  const base = isEn ? en : id;
  const companyName = seo?.proposal_company_name || "";

  const seoTerms = isEn ? seo?.proposal_terms_en : seo?.proposal_terms_id;

  const t: Translation = {
    ...base,
    proposalTitle: seo?.proposal_title || base.proposalTitle,
    companyDetail: seo ? (isEn ? seo.proposal_slogan_en : seo.proposal_slogan_id) || "" : "",
    intro1: seo ? (isEn ? seo.proposal_opening_en : seo.proposal_opening_id) || "" : "",
    intro2: seo ? (isEn ? seo.proposal_intro2_en : seo.proposal_intro2_id) || "" : "",
    packageDesc: seo ? (isEn ? seo.proposal_package_desc_en : seo.proposal_package_desc_id) || "" : "",
    approvalText: seo ? (isEn ? seo.proposal_closing_en : seo.proposal_closing_id) || "" : "",
    terms: seoTerms ? seoTerms.split("\n").filter(Boolean) : [],
  };

  const logoUrl = seo?.proposal_logo_url;
  const contactEmail = seo?.email || "";
  const contactPhone = seo?.phone || "";

  return (
    <Document>
      <Page1 t={t} proposal={proposal} logoUrl={logoUrl} companyName={companyName} contactEmail={contactEmail} contactPhone={contactPhone} />
      <Page2 t={t} proposal={proposal} companyName={companyName} contactEmail={contactEmail} contactPhone={contactPhone} />
    </Document>
  );
}
