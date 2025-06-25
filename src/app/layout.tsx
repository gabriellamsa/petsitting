import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { UserProvider } from "@/components/shared/UserProvider";

const font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustPaws",
  description: "Encontre cuidadores de pets de confiança próximos a você.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body className={`${font.className} antialiased`}>
        <UserProvider>
          <Navbar />
          <div>{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
