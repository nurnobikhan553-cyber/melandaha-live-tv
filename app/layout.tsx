import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Melandaha Live TV",
  description: "Melandaha Live TV - বাংলাদেশের লাইভ টিভি, খবর ও বিনোদন।",
  applicationName: "Melandaha Live TV",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/melandaha-logo.png",
    shortcut: "/melandaha-logo.png",
    apple: "/melandaha-logo.png",
  },
  appleWebApp: {
    capable: true,
    title: "Melandaha Live TV",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#080d18",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="bn"><body>{children}</body></html>;
}
