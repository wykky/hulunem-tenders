"use client";

import { useState, useMemo, useEffect } from "react";
import { Building2, Calendar, Search, ChevronLeft, ChevronRight, Tag, X } from "lucide-react";
import type { TenderRow } from "@/lib/data";

const PAGE_SIZE = 20;

type SortKey = "newest" | "oldest" | "closing-soon" | "closing-late";
type DeadlineRange = "all" | "today" | "week" | "month";

function fmt(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d.slice(0, 10);
  return dt.toISOString().slice(0, 10);
}

function daysLeft(d: string): number | null {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return null;
  const ms = dt.getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

function norm(s: string): string {
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function TendersList({ tenders }: { tenders: TenderRow[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [market, setMarket] = useState("");
  const [origin, setOrigin] = useState("");
  const [deadline, setDeadline] = useState<DeadlineRange>("all");
  const [entity, setEntity] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(0);

  const cats = useMemo(() => Array.from(new Set(tenders.map((t) => t.category).filter(Boolean))).sort(), [tenders]);
  const markets = useMemo(() => Array.from(new Set(tenders.map((t) => t.market).filter(Boolean))).sort(), [tenders]);
  const origins = useMemo(() => Array.from(new Set(tenders.map((t) => t.origin).filter(Boolean))).sort(), [tenders]);
  const entities = useMemo(() => Array.from(new Set(tenders.map((t) => t.entity).filter(Boolean))).sort(), [tenders]);

  const filtered = useMemo(() => {
    const tokens = norm(q.trim()).split(/\s+/).filter(Boolean);
    const ent = norm(entity.trim());
    const now = Date.now();
    const dayMs = 86400000;

    let list = tenders.filter((t) => {
      if (cat && t.category !== cat) return false;
      if (market && t.market !== market) return false;
      if (origin && t.origin !== origin) return false;
      if (ent && !norm(t.entity).includes(ent)) return false;

      if (deadline !== "all" && t.deadline) {
        const dl = new Date(t.deadline).getTime();
        if (isNaN(dl)) return true;
        const days = (dl - now) / dayMs;
        if (deadline === "today" && days > 1) return false;
        if (deadline === "week" && days > 7) return false;
        if (deadline === "month" && days > 30) return false;
      }

      if (tokens.length) {
        const hay = norm(`${t.title} ${t.entity} ${t.ref_no} ${t.method} ${t.market} ${t.summary} ${t.category} ${t.origin}`);
        if (!tokens.every((tok) => hay.includes(tok))) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sort === "newest") return a.invitation_date < b.invitation_date ? 1 : -1;
      if (sort === "oldest") return a.invitation_date > b.invitation_date ? 1 : -1;
      if (sort === "closing-soon") return (a.deadline || "9999") > (b.deadline || "9999") ? 1 : -1;
      if (sort === "closing-late") return (a.deadline || "0000") < (b.deadline || "0000") ? 1 : -1;
      return 0;
    });

    return list;
  }, [tenders, q, cat, market, origin, entity, deadline, sort]);

  useEffect(() => { setPage(0); }, [q, cat, market, origin, entity, deadline, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const hasFilter = q || cat || market || origin || entity || deadline !== "all" || sort !== "newest";

  return (
    <div className="border border-border bg-panel rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-semibold text-sm">Active Tenders</h2>
        <span className="text-xs text-muted num">{filtered.length} of {tenders.length}</span>
      </div>

      <div className="px-3 sm:px-4 py-3 border-b border-border space-y-3">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search — multiple words all match (title, entity, ref, summary)…"
              className="w-full bg-bg border border-border rounded pl-8 pr-3 py-2 text-sm focus:border-accent outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-bg border border-border rounded px-2 py-2 text-sm focus:border-accent outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="closing-soon">Closing soonest</option>
            <option value="closing-late">Closing latest</option>
          </select>
          {hasFilter && (
            <button
              onClick={() => { setQ(""); setCat(""); setMarket(""); setOrigin(""); setEntity(""); setDeadline("all"); setSort("newest"); }}
              className="flex items-center gap-1 px-3 py-2 text-xs rounded border border-border text-muted hover:border-down hover:text-down"
            >
              <X size={12} /> Reset
            </button>
          )}
        </div>

        <FilterGroup label="Category" value={cat} setValue={setCat} options={cats} />
        <FilterGroup label="Market" value={market} setValue={setMarket} options={markets} />
        <FilterGroup label="Origin" value={origin} setValue={setOrigin} options={origins} />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-widest text-muted shrink-0 w-16">Closing</span>
          <Chip active={deadline === "all"} onClick={() => setDeadline("all")}>All</Chip>
          <Chip active={deadline === "today"} onClick={() => setDeadline("today")}>Today</Chip>
          <Chip active={deadline === "week"} onClick={() => setDeadline("week")}>This week</Chip>
          <Chip active={deadline === "month"} onClick={() => setDeadline("month")}>This month</Chip>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-widest text-muted shrink-0 w-16">Entity</span>
          <input
            list="entities-list"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            placeholder="Type or pick procuring entity…"
            className="flex-1 min-w-[200px] bg-bg border border-border rounded px-3 py-1.5 text-sm focus:border-accent outline-none"
          />
          <datalist id="entities-list">
            {entities.map((e) => <option key={e} value={e} />)}
          </datalist>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-muted">No tenders match.</div>
      ) : (
        <>
          <ul className="divide-y divide-border">
            {visible.map((t) => {
              const dl = daysLeft(t.deadline);
              return (
                <li key={t.slug} className="px-4 py-4 hover:bg-bg/40">
                  <a href={`/tenders/${t.slug}`} className="block">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-sm hover:text-accent break-words">{t.title}</div>
                        <div className="flex items-center gap-3 text-xs text-muted mt-1 flex-wrap">
                          <span className="flex items-center gap-1"><Building2 size={12} />{t.entity}</span>
                          {t.ref_no && <span className="flex items-center gap-1 num"><Tag size={12} />{t.ref_no}</span>}
                          {t.deadline && (
                            <span className="flex items-center gap-1 num"><Calendar size={12} />{fmt(t.deadline)}</span>
                          )}
                          {dl !== null && dl <= 7 && dl >= 0 && (
                            <span className="num text-[10px] px-1.5 py-0.5 rounded bg-down/20 text-down border border-down/30">
                              {dl === 0 ? "closes today" : `${dl}d left`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase tracking-widest text-accent">{t.category}</span>
                        <div className="text-xs text-muted mt-1">{t.method} · {t.market}</div>
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
          {totalPages > 1 && <Pagination page={safePage} total={totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
}

function FilterGroup({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: string[] }) {
  if (options.length === 0) return null;
  return (
    <div className="flex items-start gap-2 flex-wrap">
      <span className="text-[10px] uppercase tracking-widest text-muted shrink-0 w-16 mt-1.5">{label}</span>
      <div className="flex gap-1.5 flex-wrap flex-1">
        <Chip active={value === ""} onClick={() => setValue("")}>All</Chip>
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => setValue(o)}>{o}</Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
        active ? "bg-accent text-black border-accent" : "border-border text-muted hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const pages = pageRange(page, total);
  return (
    <div className="px-3 sm:px-4 py-3 border-t border-border flex items-center justify-between gap-2 text-sm">
      <button
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        className="flex items-center gap-1 px-2 py-1 rounded border border-border text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} /> Prev
      </button>
      <div className="flex gap-1 flex-wrap justify-center">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 py-1 text-muted text-xs">…</span>
          ) : (
            <button
              key={i}
              onClick={() => onChange(p)}
              className={`text-xs num px-2.5 py-1 rounded border transition-colors ${
                p === page ? "bg-accent text-black border-accent" : "border-border text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {p + 1}
            </button>
          )
        )}
      </div>
      <button
        disabled={page === total - 1}
        onClick={() => onChange(page + 1)}
        className="flex items-center gap-1 px-2 py-1 rounded border border-border text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out: (number | "...")[] = [0];
  if (current > 2) out.push("...");
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) out.push(i);
  if (current < total - 3) out.push("...");
  out.push(total - 1);
  return out;
}
