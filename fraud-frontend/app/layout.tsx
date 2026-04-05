import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Fraud Detection System",
  description: "Hackathon-level real-time credit card fraud detection system leveraging machine learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen bg-[#050816] text-white selection:bg-indigo-500/30 overflow-x-hidden`}>
        <div className="gradient-overlay fixed inset-0 pointer-events-none z-[-2] h-screen w-screen" />
        <CustomCursor />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <footer className="site-footer mx-auto max-w-7xl px-6 mt-12 py-8 text-center text-slate-400">
          <p className="text-sm">© {new Date().getFullYear()} AI Fraud Detection System. HawkEye Team.</p>
        </footer>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            },
          }}
        />
      </body>
    </html>
  );
}
