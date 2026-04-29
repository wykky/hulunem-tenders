export function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-accent font-bold">▤</span>
          <span className="font-semibold text-sm sm:text-base">
            <span className="hover:text-accent transition-colors">Hulunem</span>{" "}
            <span className="text-muted hidden sm:inline">Tenders</span>
          </span>
        </a>
        <nav className="flex gap-4 sm:gap-6 text-sm text-muted items-center overflow-x-auto no-scrollbar flex-1 min-w-0">
          <a href="/" className="shrink-0 hover:text-accent">Tenders</a>
          <a href="https://markets.hulunem.com" className="shrink-0 hover:text-accent">Markets ↗</a>
          <a href="https://jobs.hulunem.com" className="shrink-0 hover:text-accent">Jobs ↗</a>
          <a href="https://hulunem.com" className="shrink-0 px-2 py-1 border border-border rounded hover:border-accent hover:text-accent text-xs">hulunem.com ↗</a>
        </nav>
      </div>
    </header>
  );
}
