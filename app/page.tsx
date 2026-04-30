import { getTenders } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TendersList } from "@/components/TendersList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tenders = await getTenders();
  const cats = Array.from(new Set(tenders.map((t) => t.category).filter(Boolean))).sort();
  const entities = new Set(tenders.map((t) => t.entity).filter(Boolean)).size;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Active Ethiopian Tenders",
    numberOfItems: tenders.length,
    itemListElement: tenders.slice(0, 50).map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://tenders.hulunem.com/tenders/${t.slug}`,
      name: t.title,
    })),
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Hero count={tenders.length} cats={cats.length} entities={entities} />
        <TendersList tenders={tenders} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </div>
  );
}

function Hero({ count, cats, entities }: { count: number; cats: number; entities: number }) {
  return (
    <section className="border border-border bg-panel rounded-lg p-4 sm:p-6">
      <div className="text-xs uppercase tracking-widest text-accent mb-2">Hulunem Tenders</div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-2">Ethiopian tenders, bids & procurement</h1>
      <p className="text-muted text-sm leading-relaxed">
        <span className="num">{count}</span> active opportunities across <span className="num">{cats}</span> categories from <span className="num">{entities}</span> procuring entities — federal, regional, and state enterprises. Updated daily from the Ethiopian eGP portal.
      </p>
    </section>
  );
}
