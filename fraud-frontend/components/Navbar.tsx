import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function Navbar() {
  return (
    <header className="site-header site-container mt-4 mx-auto max-w-7xl px-6 relative z-50">
      <div className="brand-panel">
        <div className="brand-mark flex items-center justify-center relative overflow-hidden group">
          <ShieldAlert className="text-white relative z-10 w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl blur-md" />
        </div>
        <div>
          <p className="eyebrow !mb-0 !text-xs !text-indigo-300">HawkEye</p>
          <h1 className="brand-title !text-xl !mt-0 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Fraud AI
          </h1>
        </div>
      </div>
      
      <nav className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/predict">Predict</Link>
        <Link href="/history">History</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
}
