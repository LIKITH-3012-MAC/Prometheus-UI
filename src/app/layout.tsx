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

// ✅ Correct Single Professional Metadata
export const metadata: Metadata = {
  title: "Prometheus AI | Likith Naidu Anumakonda",
  description: "Official AI Digital Twin of Likith Naidu Anumakonda. CSE-AI Student at PBR VITS & IIT-Patna Certified AI-ML Specialist. Explorer of Neural Networks and the Prometheus Protocol.",
  keywords: [
    "Likith Naidu Anumakonda", 
    "Likith Anumakonda", 
    "Prometheus AI", 
    "PBR VITS Kavali", 
    "IIT Patna AI ML Likith", 
    "AI Engineer", 
    "Full Stack Developer", 
    "SIH Winner 2025"
  ],
  authors: [{ name: "Likith Naidu Anumakonda" }],
  openGraph: {
    title: "Prometheus AI | Likith Naidu Anumakonda",
    description: "AI-ML Specialist from IIT-Patna & CSE-AI Student at PBR VITS. Creator of the Prometheus Protocol.",
    url: "https://prometheuslikiths-ai.online",
    siteName: "Prometheus Neural Interface",
    images: [
      {
        url: "https://likith-portfolio.online/profile-pic.jpg", 
        width: 1200,
        height: 630,
        alt: "Likith Naidu Anumakonda - AI Architect",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prometheus AI | Likith Naidu Anumakonda",
    description: "Digital Twin of an AI Engineer specializing in Neural Networks.",
  },
  verification: {
    google: "nX2F4vf5MwZ1htSi_CwccnNz0iGi4Kq-nZ5qwBbG62A",
  },
  alternates: {
    canonical: "https://prometheuslikiths-ai.online",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}