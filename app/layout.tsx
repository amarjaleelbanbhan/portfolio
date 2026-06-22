import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Orbitron, JetBrains_Mono, Inter } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/universe.css";

// The three voices of the universe (doc 5 §3.1)
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-orbitron",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amarjaleel.dev"),
  title: {
    default: "CODEX INFINITUM — Amar Jaleel · AI Product Engineer",
    template: "%s · CODEX INFINITUM",
  },
  description:
    "Not a portfolio — a living Computer Science Universe. Explore the realms of an AI Product Engineer: hardware, theory, software, AI, security, data, and creativity.",
  keywords: [
    "AI Product Engineer",
    "Amar Jaleel",
    "Computer Science",
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Data Analytics",
    "interactive portfolio",
  ],
  authors: [{ name: "Amar Jaleel" }],
  openGraph: {
    title: "CODEX INFINITUM — A Computer Science Universe",
    description:
      "Enter the living universe of an AI Product Engineer. Boot the machine. Explore the realms.",
    type: "website",
    siteName: "CODEX INFINITUM",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050508",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Amar Jaleel",
  url: "https://amarjaleel.dev",
  jobTitle: "AI Product Engineer",
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Data Analytics",
    "Software Engineering",
    "Theory of Computation",
  ],
  sameAs: ["https://github.com/amarjaleelbanbhan"],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      data-realm="architect-core"
      className={`${orbitron.variable} ${jetbrains.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
