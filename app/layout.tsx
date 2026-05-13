import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pague Já — Gestão de Pagamentos",
  description: "Micro-SaaS de cobrança recorrente via PIX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
