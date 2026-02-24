import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteSavy | Code. Map. Innovate.",
  description: "ByteSavy is a technology-driven GIS and AI company delivering custom geospatial software, AI analytics, remote sensing solutions, and scalable web & mobile applications worldwide.",
  keywords: ["GIS software development Pakistan", "AI geospatial analytics", "Remote sensing solutions", "Custom mapping software", "Spatial intelligence company"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="touch-pan-y">
      <body className="antialiased min-w-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
