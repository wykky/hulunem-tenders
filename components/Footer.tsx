export function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-6 text-center text-xs text-muted px-4">
      © {new Date().getFullYear()} Hulunem Tenders · Part of <a href="https://hulunem.com" className="text-accent hover:underline">hulunem.com</a> · Source: Ethiopian eGP Portal
    </footer>
  );
}
