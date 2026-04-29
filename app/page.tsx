import { getTenders } from "@/lib/data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TendersList } from "@/components/TendersList";

export const revalidate = 60;

export default async function Home() {
  const tenders = await getTenders();
  const cats = Array.from(new Set(tenders.map((t) => t.category).filter(Boolean))).sort();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        <Hero count={tenders.length} cats={cats.length} />
        <TendersList tenders={tenders} />
      </main>
      <Footer />
    </div>
  );
}

function Hero({ count, cats }: { count: number; cats: number }) {
  return (
    <section className="border border-border bg-panel rounded-lg p-4 sm:p-6">
      <div className="text-xs uppercase tracking-widest text-accent mb-2">Hulunem Tenders</div>
      <h1 className="text-xl sm:text-2xl font-semibold mb-2">Ethiopian government procurement</h1>
      <p className="text-muted text-sm leading-relaxed">
        <span className="num">{count}</span> active tenders across <span className="num">{cats}</span> categories. Sourced daily from the Ethiopian eGP portal.
      </p>
    </section>
  );
}
