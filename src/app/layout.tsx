import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "OrderKyat - Myanmar Invoice Generator 🇲🇲",
    template: "%s | OrderKyat",
  },
  description:
    "Transform chat messages into professional PDF invoices instantly. Fast, free, and easy to use invoice generator for Myanmar businesses.",
  keywords: [
    "invoice generator",
    "Myanmar invoice",
    "PDF invoice",
    "OrderKyat",
    "business invoice",
    "free invoice",
    "chat to invoice",
    "Myanmar business",
  ],
  authors: [{ name: "Future Wave", url: baseUrl }],
  creator: "Future Wave",
  publisher: "OrderKyat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "OrderKyat",
    title: "OrderKyat - Myanmar Invoice Generator 🇲🇲",
    description:
      "Transform chat messages into professional PDF invoices instantly. Fast, free, and easy to use for Myanmar businesses.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "OrderKyat - Invoice Generator for Myanmar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OrderKyat - Myanmar Invoice Generator 🇲🇲",
    description:
      "Transform chat messages into professional PDF invoices instantly",
    images: [`${baseUrl}/og-image.png`],
    creator: "@orderkyat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/orderKyatIcon.ico",
    shortcut: "/orderKyatIcon.ico",
  },
  manifest: "/manifest.json",
  verification: {},
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OrderKyat" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
