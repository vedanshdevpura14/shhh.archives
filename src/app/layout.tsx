import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "shhh.archive",
  description:
    "A personal photography archive — frames collected quietly, in passing. No services, no bookings. Just light, held still.",
  keywords: [
    "photography",
    "archive",
    "personal",
    "visual",
    "frames",
    "shhh",
  ],
  authors: [{ name: "shhh" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "shhh.archive",
    description: "A personal photography archive. Quiet frames, held still.",
    siteName: "shhh.archive",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "shhh.archive",
    description: "A personal photography archive.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
