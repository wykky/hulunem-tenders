export type TenderRow = {
  invitation_date: string;
  ref_no: string;
  title: string;
  entity: string;
  category: string;
  method: string;
  market: string;
  deadline: string;
  origin: string;
  source_url: string;
  slug: string;
  summary: string;
};

const SHEETS = {
  tenders: process.env.SHEET_TENDERS_URL || "",
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); row = []; cell = ""; }
        if (ch === "\r" && text[i + 1] === "\n") i++;
      } else cell += ch;
    }
  }
  if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

async function fetchCsv(url: string): Promise<string[][]> {
  if (!url) return [];
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return parseCsv((await res.text()).trim());
  } catch { return []; }
}

const today = () => new Date().toISOString().slice(0, 10);

export async function getTenders(): Promise<TenderRow[]> {
  const rows = await fetchCsv(SHEETS.tenders);
  if (!rows.length) return mockTenders;
  const t = today();
  return rows.slice(1)
    .map((r) => ({
      invitation_date: r[0] || "",
      ref_no: r[1] || "",
      title: r[2] || "",
      entity: r[3] || "",
      category: r[4] || "",
      method: r[5] || "",
      market: r[6] || "",
      deadline: r[7] || "",
      origin: r[8] || "",
      source_url: r[9] || "",
      slug: r[10] || "",
      summary: r[11] || "",
    }))
    .filter((tn) => tn.slug && tn.title && (!tn.deadline || tn.deadline.slice(0, 10) >= t))
    .sort((a, b) => (a.invitation_date < b.invitation_date ? 1 : a.invitation_date > b.invitation_date ? -1 : 0));
}

export async function getTenderBySlug(slug: string): Promise<TenderRow | null> {
  const all = await getTenders();
  return all.find((t) => t.slug === slug) || null;
}

const mockTenders: TenderRow[] = [
  {
    invitation_date: "2026-04-29", ref_no: "EFP-NCB-G-0889-2018-PUR",
    title: "Purchasing of office supplies", entity: "Ethiopian Federal Police",
    category: "Goods", method: "Open", market: "National",
    deadline: "2026-04-30T08:30:00", origin: "Federal Government",
    source_url: "https://production.egp.gov.et/egp/bids/all/purchasing/6a8a58bd-8d06-4753-8496-da64e5459663/open",
    slug: "ethiopian-federal-police-office-supplies-2026-04-29",
    summary: "Sample placeholder tender for layout preview.",
  },
];
