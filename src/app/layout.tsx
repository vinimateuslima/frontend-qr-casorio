import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema de Senhas - Casamento",
  description: "Sistema de gerenciamento de senhas para casamento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
