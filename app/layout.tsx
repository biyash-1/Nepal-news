import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import "react-datepicker/dist/react-datepicker.css";
import {Toaster} from "react-hot-toast";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "नेपाल समाचार - Nepal News Portal",
  description: "नेपालको प्रमुख समाचार पोर्टल",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne" className={poppins.variable}>
      <body className={`antialiased ${poppins.className}`}>
      <Toaster />
        <Header />
        <main className="min-h-screen bg-gray-50 mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
          <Footer/>
      </body>
    </html>
  );
}