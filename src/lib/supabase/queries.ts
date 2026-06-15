import "server-only";
import { createClient } from "./server";

export async function getHero() {
  const supabase = await createClient();
  const { data } = await supabase.from("hero_content").select("*").limit(1).single();
  return data;
}

export async function getTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAllTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getTestimonial(id: number) {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).single();
  return data;
}

export async function getPortfolios() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAllPortfolios() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPortfolio(id: number) {
  const supabase = await createClient();
  const { data } = await supabase.from("portfolios").select("*").eq("id", id).single();
  return data;
}

export async function getSeo() {
  const supabase = await createClient();
  const { data } = await supabase.from("seo_settings").select("*").eq("page", "home").single();
  return data;
}

export async function getVisitCount() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("page_visits")
    .select("*", { count: "exact", head: true })
    .eq("page", "home");
  return count ?? 0;
}

export async function getRecentVisits(limit = 50) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_visits")
    .select("*")
    .eq("page", "home")
    .order("visited_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getDailyVisits(days = 14) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data } = await supabase
    .from("page_visits")
    .select("visited_at")
    .eq("page", "home")
    .gte("visited_at", since.toISOString())
    .order("visited_at", { ascending: true });
  return data ?? [];
}

export async function getClickCounts() {
  const supabase = await createClient();
  const { count: waCount } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "wa_click");
  const { count: emailCount } = await supabase
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "email_click");
  return { waClicks: waCount ?? 0, emailClicks: emailCount ?? 0 };
}

export async function getDailyClicks(days = 14) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data } = await supabase
    .from("analytics_events")
    .select("event_type, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });
  return data ?? [];
}

// ─── INVOICES ────────────────────────────────────────────────────────────

export async function getAllInvoices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getInvoice(id: number) {
  const supabase = await createClient();
  const { data } = await supabase.from("invoices").select("*").eq("id", id).single();
  return data;
}

export async function getInvoiceItems(invoiceId: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("id", { ascending: true });
  return data ?? [];
}

export async function getInvoiceWithItems(id: number) {
  const invoice = await getInvoice(id);
  if (!invoice) return null;
  const items = await getInvoiceItems(id);
  return { ...invoice, items };
}

export async function getInvoiceByNumber(invoiceNumber: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invoices")
    .select("*")
    .eq("invoice_number", invoiceNumber)
    .single();
  return data;
}

export async function getInvoiceWithItemsByNumber(invoiceNumber: string) {
  const invoice = await getInvoiceByNumber(invoiceNumber);
  if (!invoice) return null;
  const items = await getInvoiceItems(invoice.id);
  return { ...invoice, items };
}

export function buildInvoiceSlug(invoiceNumber: string, customerName: string): string {
  const nameSlug = customerName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${invoiceNumber}-${nameSlug}`;
}

export function parseInvoiceSlug(slug: string): string | null {
  const match = slug.match(/^(INV-\d{8}-\d{4})/);
  return match ? match[1] : null;
}

// ─── PACKAGES ───────────────────────────────────────────────────────────

export async function getAllPackages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPackage(id: number) {
  const supabase = await createClient();
  const { data } = await supabase.from("packages").select("*").eq("id", id).single();
  return data;
}

// ─── PROPOSALS ────────────────────────────────────────────────────────────

export async function getAllProposals() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProposal(id: number) {
  const supabase = await createClient();
  const { data } = await supabase.from("proposals").select("*").eq("id", id).single();
  return data;
}

export async function getProposalItems(proposalId: number) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("proposal_items")
    .select("*")
    .eq("proposal_id", proposalId)
    .order("id", { ascending: true });
  return data ?? [];
}

export async function getProposalWithItems(id: number) {
  const proposal = await getProposal(id);
  if (!proposal) return null;
  const items = await getProposalItems(id);
  return { ...proposal, items };
}

export async function getProposalByNumber(proposalNumber: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("proposals")
    .select("*")
    .eq("proposal_number", proposalNumber)
    .single();
  return data;
}

export async function getProposalWithItemsByNumber(proposalNumber: string) {
  const proposal = await getProposalByNumber(proposalNumber);
  if (!proposal) return null;
  const items = await getProposalItems(proposal.id);
  return { ...proposal, items };
}

export function buildProposalSlug(proposalNumber: string, customerName: string): string {
  const nameSlug = customerName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${proposalNumber}-${nameSlug}`;
}

export function parseProposalSlug(slug: string): string | null {
  const match = slug.match(/^(PRO-\d{8}-\d{4})/);
  return match ? match[1] : null;
}

// ─── PROJECTS ───────────────────────────────────────────────────────────

export async function getAllProjects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, tasks(count)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProject(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  return data;
}

export async function getTasks(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getProjectColumns(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_columns")
    .select("name")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });
  return (data ?? []).map((c) => c.name);
}

export async function getProjectWithTasks(id: string) {
  const project = await getProject(id);
  if (!project) return null;
  const tasks = await getTasks(id);
  const columns = await getProjectColumns(id);
  return { ...project, tasks, columns };
}
