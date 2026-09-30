import type { Metadata, Viewport } from "next";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capacity Connect — National Capacity Building & Accreditation Portal",
  description:
    "National digital capacity building and learning management platform for civil servants and government institutions (SIH26075).",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#12355B",
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
      <body className="min-h-full flex flex-col bg-[#F7F9FC] text-[#172B4D] font-sans antialiased selection:bg-[#DFF5F3] selection:text-[#12355B]">
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
