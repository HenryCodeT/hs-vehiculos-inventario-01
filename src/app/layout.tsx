import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "../styles/globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HS Vehículos — Inventario",
  description: "Sistema de inventario vehicular HS Vehículos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={montserrat.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
