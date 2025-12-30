import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Best Unisex Gym in Bolpur | As FitnessZone",
  description:
    "As FitnessZone is the best unisex gym in Bolpur offering modern equipment, personal training, weight loss and muscle gain programs for men and women.",
  keywords: [
    "best gym in bolpur",
    "unisex gym in bolpur",
    "gym in bolpur",
    "fitness gym bolpur",
    "best fitness center in bolpur",
  ],
  metadataBase: new URL("https://asfitnesszone.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Unisex Gym in Bolpur | As FitnessZone",
    description:
      "Join As FitnessZone – a modern unisex gym in Bolpur with certified trainers and personalized fitness programs.",
    url: "https://asfitnesszone.vercel.app",
    siteName: "As FitnessZone",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "As FitnessZone – Best Gym in Bolpur",
    description:
      "Modern unisex gym in Bolpur for weight loss, muscle gain and fitness training.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* ✅ Local Business / Gym Schema */}
        <Script
          id="as-fitnesszone-gym-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Gym",
              name: "As FitnessZone",
              url: "https://asfitnesszone.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bolpur",
                addressRegion: "West Bengal",
                addressCountry: "IN",
              },
              areaServed: "Bolpur",
              description:
                "As FitnessZone is a modern unisex gym in Bolpur offering fitness training for men and women.",
              priceRange: "₹₹",
            }),
          }}
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
