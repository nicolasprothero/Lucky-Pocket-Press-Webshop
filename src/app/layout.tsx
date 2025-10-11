import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

import HomeBannerWrapper from '@/components/HomeBannerWrapper';

export const metadata: Metadata = {
  title: "Lucky Pocket Press",
  description: "Lucky Pocket Press's official online website!",
  icons: {
    icon: "/favicon/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HomeBannerWrapper />
        <div id="main-site-container">
          <CartProvider>
            <ScrollToTop />
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
