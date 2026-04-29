import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hulunem Tenders — Ethiopian Government Procurement",
  description: "Browse active tenders, bids, and procurement opportunities from the Ethiopian eGP portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-gray-200 antialiased">{children}</body>
    </html>
  );
}
