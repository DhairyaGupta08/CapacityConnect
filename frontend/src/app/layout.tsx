import type { Metadata, Viewport } from "next";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capacity Connect — Digital Capacity Building & Accreditation Portal",
  description:
    "National platform for civil servant capacity building, competency matching, learning management, and verified certifications (SIH26075).",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B192C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-gov-slate-50 text-gov-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
        <SkipLink />
        <QueryProvider>
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
