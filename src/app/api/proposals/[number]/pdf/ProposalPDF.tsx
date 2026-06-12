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

const id = {
  companyDetail: "Jasa Website Murah untuk UMKM & Personal Branding",
  proposalTitle: "PROPOSAL",
  preparedFor: "Dipersiapkan Untuk",
  proposalDate: "Tanggal Proposal",
  greeting: (n: string) => `Kepada Yth. ${n},`,
  intro1: "Terima kasih atas ketertarikan Anda terhadap layanan pembuatan website kami. Bersama ini kami sampaikan proposal penawaran yang telah disesuaikan dengan kebutuhan Anda.",
  intro2: "Webkalcer.com adalah penyedia jasa website profesional, responsif, dan terjangkau untuk UMKM, personal branding, dan profil bisnis. Berikut adalah rincian ruang lingkup pekerjaan dan harga untuk proyek Anda.",
  scopeTitle: "Ruang Lingkup Pekerjaan",
  serviceHeader: "Layanan / Item",
  priceHeader: "Harga",
  badge: "PAKET",
  packageDesc: "Paket sudah termasuk desain responsif yang dioptimalkan untuk desktop dan mobile. Website akan siap digunakan setelah selesai dikerjakan.",
  investment: "Investasi",
  subtotal: "Subtotal",
  discount: "Diskon",
  tax: "Pajak",
  grandTotal: "Total",
  notesTitle: "Catatan Tambahan",
  termsTitle: "Syarat & Ketentuan",
  terms: [
    "Pembayaran dilakukan setelah persetujuan proposal ini.",
    "Waktu pengerjaan website: 3×24 jam (khusus untuk paket Kalcer) dan menyesuaikan sesuai prosedur untuk paket lainnya.",
    "Revisi: maksimal 3 kali revisi. Lebih dari 3 kali akan ada konfirmasi biaya tambahan.",
    "Biaya perpanjangan domain & hosting berlaku setelah tahun pertama.",
    "Proposal ini berlaku selama 14 hari sejak tanggal di atas.",
  ],
  approval: "Persetujuan",
  approvalText: "Silakan konfirmasi penerimaan proposal ini dengan menandatangani di bawah. Setelah disetujui, kami akan segera memulai proses pengembangan. Jangan ragu untuk menghubungi kami jika ada pertanyaan.",
  acceptedBy: "Diterima & Disetujui Oleh",
  client: "Klien",
  preparedBy: "Dipersiapkan Oleh",
};

const en = {
  companyDetail: "Affordable Website Services for UMKM & Personal Branding",
  proposalTitle: "PROPOSAL",
  preparedFor: "Prepared For",
  proposalDate: "Proposal Date",
  greeting: (n: string) => `Dear ${n},`,
  intro1: "Thank you for your interest in our website development services. We are pleased to submit this proposal outlining our recommended solution tailored to your needs.",
  intro2: "At Webkalcer.com, we specialize in creating professional, responsive, and affordable websites for UMKM, personal branding, and business profiles. Below is the detailed scope of work and pricing for your project.",
  scopeTitle: "Scope of Work",
  serviceHeader: "Service / Item",
  priceHeader: "Price",
  badge: "PACKAGE",
  packageDesc: "Packages include responsive design optimized for both desktop and mobile devices. The website will be fully deployed and ready to use.",
  investment: "Investment",
  subtotal: "Subtotal",
  discount: "Discount",
  tax: "Tax",
  grandTotal: "Grand Total",
  notesTitle: "Additional Notes",
  termsTitle: "Terms & Conditions",
  terms: [
    "Payment is due upon agreement of this proposal.",
    "Website delivery time: 3×24 hours (for Kalcer package) and adjusted according to procedure for other packages.",
    "Revision: maximum 3 rounds of revisions. Additional revisions beyond 3 will require a cost confirmation.",
    "Domain & hosting renewal fees apply after the first year.",
    "This proposal is valid for 14 days from the date above.",
  ],
  approval: "Approval",
  approvalText: "Please confirm your acceptance of this proposal by signing below. Once approved, we will begin the development process immediately. Feel free to reach out if you have any questions.",
  acceptedBy: "Accepted & Approved By",
  client: "Client",
  preparedBy: "Prepared By",
};

function Page1({ t, proposal, logoUrl, companyName }: { t: typeof id; proposal: any; logoUrl?: string; companyName: string }) {
  const pn = (n: number) => `— ${t.proposalTitle.toLowerCase()} ${proposal.proposal_number} | Page ${n} —`;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>webkalcer.com</Text>
      </View>

      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center", flex: 1 }}>
          {logoUrl && (
            <Image src={logoUrl} style={{ width: 40, height: 40, objectFit: "contain" }} />
          )}
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>{companyName}</Text>
            <View style={styles.companyDetail}>
              <Text>{t.companyDetail}</Text>
              <Text>Email: halo@webkalcer.com | Phone: 0857-9272-1649</Text>
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
            {proposal.items.map((item: any, i: number) => (
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

function Page2({ t, proposal, companyName }: { t: typeof id; proposal: any; companyName: string }) {
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
        Email: halo@webkalcer.com | WhatsApp: 0857-9272-1649 | www.webkalcer.com
      </Text>

      <Text style={styles.pageNum}>{pn(2)}</Text>
    </Page>
  );
}

export default function ProposalPDF({ proposal, seo }: { proposal: any; seo?: any }) {
  const isEn = proposal.language === "en";
  const base = isEn ? en : id;
  const companyName = seo?.proposal_company_name || "Webkalcer.com";

  const seoTerms = isEn ? seo?.proposal_terms_en : seo?.proposal_terms_id;

  const t = {
    ...base,
    proposalTitle: seo?.proposal_title || base.proposalTitle,
    companyDetail: seo ? (isEn ? seo.proposal_slogan_en : seo.proposal_slogan_id) || base.companyDetail : base.companyDetail,
    intro1: seo ? (isEn ? seo.proposal_opening_en : seo.proposal_opening_id) || base.intro1 : base.intro1,
    approvalText: seo ? (isEn ? seo.proposal_closing_en : seo.proposal_closing_id) || base.approvalText : base.approvalText,
    terms: seoTerms ? seoTerms.split("\n").filter(Boolean) : base.terms,
  };

  const logoUrl = seo?.proposal_logo_url;

  return (
    <Document>
      <Page1 t={t} proposal={proposal} logoUrl={logoUrl} companyName={companyName} />
      <Page2 t={t} proposal={proposal} companyName={companyName} />
    </Document>
  );
}
