import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuickChef - AI-Powered Indian Recipe Generator",
  description: "Upload ingredients from your pantry and get personalized Indian recipes powered by AI. Discover authentic flavors with ingredients you already have.",
  keywords: "Indian recipes, AI cooking, ingredient detection, recipe generator, Indian cuisine",
  authors: [{ name: "QuickChef Team" }],
  openGraph: {
    title: "QuickChef - AI-Powered Indian Recipe Generator",
    description: "Upload ingredients from your pantry and get personalized Indian recipes powered by AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickChef - AI-Powered Indian Recipe Generator",
    description: "Upload ingredients from your pantry and get personalized Indian recipes powered by AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--card)',
              color: 'var(--card-foreground)',
              border: '1px solid var(--border)',
            },
          }}
        />
      </body>
    </html>
  );
}