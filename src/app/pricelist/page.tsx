import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Tag, ArrowDown, Package, Check, Sparkles, MessageCircle, ClipboardList, Palette, CheckCircle } from "lucide-react";

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function badgeColor() {
  return "bg-yellow text-dark";
}

async function getPackages() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      },
    );

    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    return data ?? [];
  } catch {
    return [];
  }
}

export default async function PricelistPage() {
  const packages = await getPackages();

  return (
    <>
      <Navbar />

      {/* === HERO === */}
      <section className="relative overflow-hidden bg-cream px-4 pt-32 pb-16 sm:px-6 sm:pt-40">
        <div className="pointer-events-none absolute top-10 -left-40 h-96 w-96 rounded-full bg-yellow/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-pink/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="animate-fade-in">
            <div className="mb-4 inline-flex animate-float items-center gap-2 rounded-full bg-pink px-6 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-lg">
              <Tag className="h-4 w-4" />
              PILIH PAKET SESUAI KEBUTUHAN
            </div>
            <h1 className="text-5xl font-black leading-none tracking-tighter sm:text-6xl lg:text-7xl">
              PAKET LENGKAP
              <br />
              <span className="inline-block -rotate-1 rounded-3xl bg-yellow px-6 py-2 text-dark">
                BUAT WEBSITE
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base font-bold leading-relaxed text-dark/60">
              Dari landing page simple sampai toko online full fitur — semua udah include domain, hosting, & SSL.
              Tinggal pilih, chat, dan website kakak online!
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wide text-pink">
              <ArrowDown className="h-4 w-4" />
              tinggal geser-geser aja kak
            </p>
          </div>
        </div>
      </section>

      {/* === PACKAGES GRID === */}
      <section className="relative px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {packages.length === 0 && (
            <p className="text-center text-sm font-bold text-zinc-400">Belum ada paket tersedia. Cek lagi nanti ya kak!</p>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="group relative flex flex-col rounded-3xl border-2 border-yellow/40 bg-white p-6 shadow-md transition-all duration-300 hover:border-yellow hover:shadow-2xl"
              >
                {pkg.badge && (
                  <div className={`absolute -top-3 right-4 rounded-full px-4 py-1 text-xs font-black uppercase tracking-wide shadow-lg ${badgeColor()}`}>
                    {pkg.badge}
                  </div>
                )}

                {pkg.thumbnail_url && (
                  <div className="relative -mx-6 -mt-6 mb-4 h-44 overflow-hidden rounded-t-3xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pkg.thumbnail_url} alt={pkg.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow/20 text-yellow-dark transition-transform group-hover:scale-110 group-hover:-rotate-6">
                    <Package className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-dark">{pkg.name}</h3>
                    {pkg.tagline && <p className="text-xs font-bold text-zinc-500">{pkg.tagline}</p>}
                    {pkg.description && <p className="mt-1 text-xs font-bold leading-relaxed text-zinc-400">{pkg.description}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  {Number(pkg.promo) > 0 ? (
                    <>
                      <span className="text-lg font-black tracking-tight text-zinc-400 line-through">
                        {formatPrice(pkg.price)}
                      </span>
                      {pkg.price_note && (
                        <p className="text-xs font-bold text-zinc-500">{pkg.price_note}</p>
                      )}
                      <div className="mt-0.5 text-3xl font-black tracking-tight text-pink">
                        Promo {formatPrice(pkg.promo)}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-black tracking-tight text-pink">
                        {formatPrice(pkg.price)}
                      </span>
                      {pkg.price_note && (
                        <p className="text-xs font-bold text-zinc-400">{pkg.price_note}</p>
                      )}
                    </>
                  )}
                </div>

                {Array.isArray(pkg.features) && pkg.features.length > 0 && (
                  <ul className="mb-6 flex-1 space-y-2.5">
                    {pkg.features.map((f: string, fi: number) => (
                      <li key={fi} className="flex items-start gap-2 text-sm font-bold leading-snug text-dark">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow/30">
                          <Check className="h-3 w-3 text-dark" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {pkg.note && (
                  <p className="mb-4 text-center text-xs font-black uppercase tracking-wide text-pink">{pkg.note}</p>
                )}

                <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER || "6285792721649"}?text=${encodeURIComponent(`Halo kak, saya tertarik dengan paket ${pkg.name} di webkalcer.com`)}`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-pink hover:shadow-xl active:scale-95"
                >
                  Pilih {pkg.name}
                  <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="relative bg-dark px-4 py-20 sm:px-6">
        <div className="pointer-events-none absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-pink/5 blur-3xl" />
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">
            BINGUNG MILIH PAKET?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-relaxed text-zinc-400">
            Tenang aja, kakak bisa konsultasi gratis dulu. Kami bantu tentuin paket yang paling cocok
            sama kebutuhan & budget kakak. Santai aja, ga ada paksaan!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER || "6285792721649"}?text=${encodeURIComponent(process.env.NEXT_PUBLIC_WA_MESSAGE || "Halo kak, saya mau buat website di webkalcer.com, bisa dibantu?")}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-pink px-10 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-pink-dark hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Konsultasi Gratis
              <Sparkles className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE_NUMBER || "6285792721649"}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-600 bg-transparent px-10 py-4 text-base font-bold text-white shadow-lg transition-all hover:border-pink hover:scale-105 active:scale-95"
            >
              Chat WhatsApp
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* === CARA PEMESANAN === */}
      <section className="relative bg-cream px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex animate-float items-center gap-2 rounded-full bg-pink px-6 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-lg">
            <ClipboardList className="h-4 w-4" />
            GAMPANG BANGET
          </div>
          <h2 className="text-4xl font-black leading-none tracking-tighter text-dark sm:text-5xl">
            CARA PESAN
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-relaxed text-dark/60">
            Tinggal chat, kami yang urus sisanya. Melayani seluruh Indonesia!
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MessageCircle, label: "Konsultasi", desc: "Chat via WA atau Zoom, sampaikan kebutuhan kakak" },
              { icon: ClipboardList, label: "Konfirmasi", desc: "Kami buatkan proposal & RAB, kakak tinggal setuju" },
              { icon: Palette, label: "Pengerjaan", desc: "Tim kami garap website sesuai kesepakatan" },
              { icon: CheckCircle, label: "Revisi & Launch", desc: "Kakak review, kami revisi, lalu website online!" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group rounded-2xl border-2 border-yellow/20 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow/60 hover:shadow-xl"
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow/20 text-yellow-dark transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-black tracking-tight text-dark">{item.label}</div>
                  <div className="text-xs font-bold text-zinc-500">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
