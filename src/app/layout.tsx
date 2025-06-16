import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/components/UserProvider";

const font = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustPaws",
  description:
    "Find trusted local pet sitters and caretakers for your furry friends.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <UserProvider>
          <Navbar />
          <div>{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
