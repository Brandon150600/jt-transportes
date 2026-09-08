import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JT Transportes",
    template: "%s | JT Transportes",
  },
  description: "Transporte de mercancías con camiones Kenworth — soluciones logísticas, carga pesada y entrega puntual.",
  openGraph: {
    title: "JT Transportes",
    description: "Transporte de mercancías con camiones Kenworth — soluciones logísticas confiables.",
    url: "https://example.com",
    siteName: "JT Transportes",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "JT Transportes logo",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "JT Transportes",
    description: "Transporte de mercancías con camiones Kenworth — soluciones logísticas confiables.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
