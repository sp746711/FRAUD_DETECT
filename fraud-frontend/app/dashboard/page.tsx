"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('transaction_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const fraudCount = history.filter(h => h.isFraud).length;
  const safeCount = history.length - fraudCount;
  
  // Recent 20 transactions for the line chart (reverse to chronological)
  const recentHistory = [...history].slice(0, 20).reverse();

  const doughnutData = {
    labels: ['Safe Transactions', 'Fraudulent'],
    datasets: [
      {
        data: history.length > 0 ? [safeCount, fraudCount] : [1, 0], // fallback if empty
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)', // emerald
          'rgba(239, 68, 68, 0.6)',  // red
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: recentHistory.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Risk Score (%)',
        data: recentHistory.map(h => h.riskScore),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false, text: 'Recent Transaction Risk Scores' },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#cbd5e1' }
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="eyebrow">Analytics Overview</p>
        <h1 className="text-4xl font-bold mt-2">Intelligence Dashboard</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <p className="text-sm text-slate-400 mb-2">Total Scanned</p>
          <h3 className="text-3xl font-bold">{history.length}</h3>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-6 border-l-4 border-l-emerald-500"
        >
          <p className="text-sm text-slate-400 mb-2">Safe Transactions</p>
          <h3 className="text-3xl font-bold text-emerald-400">{safeCount}</h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 border-l-4 border-l-red-500"
        >
          <p className="text-sm text-slate-400 mb-2">Fraudulent Detected</p>
          <h3 className="text-3xl font-bold text-red-400">{fraudCount}</h3>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6">Detection Distribution</h3>
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            {history.length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <p className="text-slate-500">No data available</p>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 lg:col-span-2 flex flex-col"
        >
          <h3 className="text-lg font-semibold mb-6">Recent Risk Scores</h3>
          <div className="flex-1 min-h-[300px]">
             {history.length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-500">No data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
