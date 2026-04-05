"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";

type HistoryRecord = {
  id: string;
  timestamp: string;
  amount: number;
  category: string;
  isFraud: boolean;
  riskScore: number;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('transaction_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('transaction_history');
    setHistory([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="eyebrow">Database</p>
          <h1 className="text-4xl font-bold mt-2">Prediction History</h1>
        </div>

        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </button>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel history-panel"
      >
        {history.length === 0 ? (
          <div className="history-empty flex flex-col items-center justify-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700">
              <History className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Records Found</h3>
            <p>Run your first prediction to see history logs here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-semibold px-4">Date & Time</th>
                  <th className="font-semibold px-4">Category</th>
                  <th className="font-semibold px-4 text-right">Amount</th>
                  <th className="font-semibold px-4 text-center">Score</th>
                  <th className="font-semibold px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, idx) => (
                  <motion.tr 
                    key={row.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-slate-300">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm uppercase tracking-wider text-slate-400">
                      {row.category.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-4 font-mono text-right text-indigo-200">
                      ${row.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-mono text-sm px-2 py-1 bg-slate-900 rounded border border-slate-700">
                        {row.riskScore.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {row.isFraud ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wide">
                          <ShieldAlert className="w-3 h-3" />
                          Fraud
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wide">
                          <ShieldCheck className="w-3 h-3" />
                          Safe
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
