import type { Metadata } from "next";
import "./globals.css";

const SITE = "https://tenders.hulunem.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Hulunem Tenders — Ethiopian Tenders, Bids & Procurement Opportunities",
    template: "%s — Hulunem Tenders",
  },
  description: "Browse 500+ active Ethiopian tenders, bids, RFPs, and procurement opportunities. Updated daily from the Ethiopian eGP portal. Federal, regional, and state enterprises.",
  keywords: ["Ethiopian tenders", "tenders Ethiopia", "Ethiopian bids", "RFP Ethiopia", "Ethiopian procurement", "eGP Ethiopia", "Ethiopian government tenders", "public procurement Ethiopia", "Addis Ababa tenders", "Ethiopian contracts", "construction tenders Ethiopia", "consultancy tenders Ethiopia"],
  authors: [{ name: "Hulunem", url: "https://hulunem.com" }],
  creator: "Hulunem",
  publisher: "Hulunem",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE,
    title: "Hulunem Tenders — Ethiopian Tenders & Procurement",
    description: "500+ active Ethiopian tenders updated daily. Search by entity, category, deadline. Federal, regional, and state enterprises.",
    siteName: "Hulunem Tenders",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hulunem Tenders — Ethiopian Tenders & Procurement",
    description: "500+ active Ethiopian tenders updated daily.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
  icons: { icon: "/icon.svg" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hulunem Tenders",
  url: SITE,
  description: "Active Ethiopian tenders, bids, and procurement opportunities.",
  inLanguage: "en",
  publisher: { "@type": "Organization", name: "Hulunem", url: "https://hulunem.com" },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className="bg-bg text-gray-200 antialiased">{children}</body>
    </html>
  );
}
