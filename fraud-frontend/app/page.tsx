"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, Database } from "lucide-react";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-100px)] flex flex-col items-center justify-center overflow-hidden">
      <ThreeBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Live Fraud Detection Engine
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-slate-400"
        >
          Secure Transactions with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            AI Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Detect anomalous patterns and stop credit card fraud in real-time. Protect your users and business with our advanced predictive machine learning models.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/predict"
            className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-950 font-semibold rounded-full hover:bg-indigo-50 transition-colors w-full sm:w-auto overflow-hidden"
          >
            <span>Start Detection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/40 group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12 -translate-x-[150%]" />
          </Link>
          
          <Link
            href="/history"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800/50 text-white font-semibold rounded-full transition-colors w-full sm:w-auto backdrop-blur-sm"
          >
            View History
          </Link>
        </motion.div>
      </div>

      {/* Feature grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20 relative z-10"
      >
        {[
          {
            icon: ShieldCheck,
            title: "Real-time Verification",
            desc: "Transactions are analyzed instantly ensuring zero delay in process.",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
          },
          {
            icon: Activity,
            title: "High Accuracy",
            desc: "Trained on millions of transactions to provide >99% accuracy.",
            color: "text-blue-400",
            bg: "bg-blue-500/10"
          },
          {
            icon: Database,
            title: "Local Data Store",
            desc: "Keep track of all checked predictions easily in your dashboard.",
            color: "text-purple-400",
            bg: "bg-purple-500/10"
          }
        ].map((feat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl group hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-4`}>
              <feat.icon className={`w-6 h-6 ${feat.color}`} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-200">{feat.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
