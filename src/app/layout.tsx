import type { Metadata } from "next";
import { Marcellus, Assistant, Parisienne } from "next/font/google";
import "./globals.css";

const display = Marcellus({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Assistant({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const script = Parisienne({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Canopy",
  description:
    "A fast, minimal field companion for comparing flora and fauna photos using the iNaturalist API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${script.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
