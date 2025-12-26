import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PocketPro - Personal Pocket Money Manager",
  description: "Manage your pocket money, track expenses, and make informed financial decisions",
  keywords: ["pocket money", "expense tracker", "budget", "student finance"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
