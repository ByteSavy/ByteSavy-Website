import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteSavy | Code. Map. Innovate.",
  description: "ByteSavy is a technology-driven GIS and AI company delivering custom geospatial software, AI analytics, remote sensing solutions, and scalable web & mobile applications worldwide.",
  keywords: ["GIS software development Pakistan", "AI geospatial analytics", "Remote sensing solutions", "Custom mapping software", "Spatial intelligence company"],
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
