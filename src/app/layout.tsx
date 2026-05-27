import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArkivRoom",
  description:
    "Wallet-owned private data rooms on Arkiv Braga for confidential documents and time-bound access grants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--color-ink)] text-[var(--color-sand)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
