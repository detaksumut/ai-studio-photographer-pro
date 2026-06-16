import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Studio Photographer Pro — Satu Foto, Puluhan Karya",
  description:
    "Transformasi foto Anda dengan AI. Hasilkan foto formal, rekreasi, futuristik, era klasik, romantis, dan ratusan gaya lainnya dari satu foto dalam hitungan detik. Tanpa Photoshop.",
  keywords: [
    "AI foto",
    "edit foto AI",
    "studio foto AI",
    "foto formal AI",
    "transformasi foto",
    "fotografer AI",
    "ganti background foto",
    "pas foto AI",
  ].join(", "),
  openGraph: {
    title: "AI Studio Photographer Pro",
    description: "Satu Foto, Puluhan Karya Profesional.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
