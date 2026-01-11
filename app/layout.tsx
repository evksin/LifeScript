import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "LifeScript - Next.js + Prisma + NeonDB",
  description: "Минимальный проект на Next.js с Prisma и NeonDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <SessionProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
