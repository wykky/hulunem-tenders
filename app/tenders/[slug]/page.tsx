import { getTenderBySlug, getTenders } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building2, Calendar, Tag, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTenderBySlug(slug);
  if (!t) return { title: "Tender not found" };
  const desc = `${t.entity} — ${t.category} tender (${t.method}, ${t.market}). Reference ${t.ref_no}. Closes ${t.deadline?.slice(0, 10)}. ${t.summary}`.slice(0, 200);
  return {
    title: `${t.title} — ${t.entity}`,
    description: desc,
    alternates: { canonical: `/tenders/${t.slug}` },
    openGraph: {
      type: "article",
      url: `https://tenders.hulunem.com/tenders/${t.slug}`,
      title: `${t.title} — ${t.entity}`,
      description: desc,
      publishedTime: t.invitation_date,
    },
  };
}

function fmt(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

export default async function TenderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTenderBySlug(slug);
  if (!t) notFound();

  const jobJsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: t.title,
    provider: { "@type": "Organization", name: t.entity },
    serviceType: t.category,
    areaServed: { "@type": "Country", name: "Ethiopia" },
    url: `https://tenders.hulunem.com/tenders/${t.slug}`,
    description: t.summary,
    identifier: t.ref_no,
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <a href="/" className="text-xs text-muted hover:text-accent">← All tenders</a>
        <article className="mt-4 border border-border bg-panel rounded-lg p-6">
          <div className="text-[10px] uppercase tracking-widest text-accent">{t.category} · {t.method} · {t.market}</div>
          <h1 className="text-2xl font-semibold mt-1 mb-3 break-words">{t.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted mb-4">
            <span className="flex items-center gap-1"><Building2 size={14} />{t.entity}</span>
            {t.ref_no && <span className="flex items-center gap-1 num"><Tag size={14} />{t.ref_no}</span>}
            {t.deadline && <span className="flex items-center gap-1 num"><Calendar size={14} />closes {fmt(t.deadline)}</span>}
          </div>
          {t.summary && <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{t.summary}</p>}
          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            {t.source_url && (
              <a href={t.source_url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-black rounded text-sm font-medium hover:bg-accent/90">
                View on eGP portal <ExternalLink size={14} />
              </a>
            )}
            <span className="text-xs text-muted num">Posted {t.invitation_date?.slice(0, 10)} · {t.origin}</span>
          </div>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }} />
    </div>
  );
}
