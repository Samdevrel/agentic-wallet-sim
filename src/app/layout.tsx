import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic Wallet Simulator | @samdevrel",
  description: "Interactive demo of AI agent wallets with natural language execution. Parse, simulate, risk-check, and execute on-chain transactions.",
  keywords: ["agentic wallet", "AI agent", "Web3", "crypto", "natural language", "on-chain"],
  authors: [{ name: "Sam", url: "https://x.com/samdevrel" }],
  openGraph: {
    title: "Agentic Wallet Simulator",
    description: "Natural language → On-chain execution for AI agents",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@samdevrel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
