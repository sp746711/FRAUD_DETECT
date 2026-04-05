"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, CheckCircle, ArrowRight, Activity } from "lucide-react";
import toast from "react-hot-toast";

type PredictionResponse = {
  fraud: boolean;
  prediction: number;
  score: number;
};

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amt: "",
    city_pop: "",
    trans_hour: "",
    trans_day_of_week: "",
    time_diff: "",
    distance_km: "",
    category: "grocery_pos",
    gender: "M",
    state: "NY",
  });

  const categories = [
    "grocery_pos", "kids_pets", "shopping_net", "entertainment", 
    "food_dining", "personal_care", "shopping_pos", "gas_transport",
    "home", "grocery_net", "misc_net", "health_fitness", "misc_pos", "travel"
  ];
  
  const states = [
    "NY", "CA", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveToHistory = (data: any, res: PredictionResponse) => {
    const historyUrl = 'transaction_history';
    let history: any[] = [];
    try {
      const stored = localStorage.getItem(historyUrl);
      if (stored) history = JSON.parse(stored);
    } catch (e) {
      console.error("Could not parse history", e);
    }

    const newRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      amount: Number(data.amt),
      category: data.category,
      isFraud: res.fraud,
      riskScore: res.score,
    };

    history.unshift(newRecord);
    localStorage.setItem(historyUrl, JSON.stringify(history.slice(0, 100)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const payload = {
      amt: Number(formData.amt),
      city_pop: Number(formData.city_pop),
      trans_hour: Number(formData.trans_hour),
      trans_day_of_week: Number(formData.trans_day_of_week),
      time_diff: Number(formData.time_diff),
      distance_km: Number(formData.distance_km),
      category: formData.category,
      gender: formData.gender,
      state: formData.state,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      
      setResult(data);
      saveToHistory(payload, data);
      
      if (data.fraud) {
        toast.error("Fraudulent transaction detected!", { icon: '🚨' });
      } else {
        toast.success("Transaction is safe.", { icon: '✅' });
      }

    } catch (error: any) {
      console.error("Prediction API Error:", error);
      setError(error.message || "Failed to reach the backend service.");
      toast.error("Error connecting to backend API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="eyebrow text-indigo-400 font-semibold tracking-wider uppercase text-sm mb-2">Analysis Module</p>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Transaction Prediction</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM PANEL */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-8 glass-panel bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Amount ($)</label>
                <input required type="number" step="0.01" name="amt" value={formData.amt} onChange={handleChange} 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-white placeholder-slate-500" placeholder="150.00" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">City Population</label>
                <input required type="number" name="city_pop" value={formData.city_pop} onChange={handleChange} 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-white placeholder-slate-500" placeholder="500000" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Transaction Hour (0-23)</label>
                <input required type="number" min="0" max="23" name="trans_hour" value={formData.trans_hour} onChange={handleChange} 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-white placeholder-slate-500" placeholder="14" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Day of Week (0-6)</label>
                <select required name="trans_day_of_week" value={formData.trans_day_of_week} onChange={handleChange} 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white">
                  <option value="">Select day</option>
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Time Diff (secs since last)</label>
                <input required type="number" step="0.1" name="time_diff" value={formData.time_diff} onChange={handleChange} 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-white placeholder-slate-500" placeholder="240.5" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Distance (km)</label>
                <input required type="number" step="0.1" name="distance_km" value={formData.distance_km} onChange={handleChange} 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-white placeholder-slate-500" placeholder="15.2" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} 
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white">
                  {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} 
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white">
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">State</label>
                  <select name="state" value={formData.state} onChange={handleChange} 
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white">
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit" 
              className="mt-8 w-full group relative flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Request...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Run Analysis Engine</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* RESULTS PANEL */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="glass-panel bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 h-full flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden transition-colors duration-500">
            <AnimatePresence mode="wait">
              
              {!loading && !result && !error && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center text-slate-500"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-6 border border-slate-700/50 rotate-3 shadow-inner">
                    <Activity className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-400 font-medium">Awaiting input data...</p>
                  <p className="text-sm mt-2 max-w-[200px] mx-auto opacity-70">Submit a transaction to run the AI prediction model.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="text-center"
                >
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-indigo-500 animate-[spin_1s_linear_infinite]"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-blue-400 animate-[spin_2s_linear_infinite] direction-reverse"></div>
                    <div className="absolute inset-4 rounded-full border-t-2 border-r-2 border-purple-400 animate-[spin_3s_linear_infinite]"></div>
                    <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400 animate-pulse" />
                  </div>
                  <p className="text-indigo-300 font-medium tracking-wide">Executing Neural Net...</p>
                </motion.div>
              )}

              {error && !loading && (
                 <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center w-full"
                 >
                    <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                      <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">Connection Failed</h3>
                    <p className="text-sm text-slate-400">{error}</p>
                 </motion.div>
              )}

              {result && !loading && !error && (
                <motion.div 
                  key="result"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full text-center"
                >
                  <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center relative transition-colors duration-500 ${result.fraud ? 'bg-red-500/10 border border-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                    {result.fraud ? (
                      <>
                        <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" />
                        <AlertTriangle className="w-14 h-14 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] relative z-10" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-pulse" />
                        <CheckCircle className="w-14 h-14 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] relative z-10" />
                      </>
                    )}
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 ${result.fraud ? 'text-red-400' : 'text-emerald-400'}`}>
                    {result.fraud ? "Fraudulent Match" : "Transaction Safe"}
                  </h3>
                  
                  <p className="text-sm mb-8 text-slate-400">
                    {result.fraud ? "High probability of anomalous activity." : "Patterns conform to standard behavior."}
                  </p>

                  <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800">
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                       Risk Assessment Score
                    </p>
                    <div className="flex items-end justify-center gap-1 mb-4">
                      <span className={`text-5xl font-mono font-bold ${result.fraud ? 'text-red-500' : 'text-emerald-500'}`}>
                        {result.score.toFixed(1)}
                      </span>
                      <span className="text-slate-500 text-lg mb-1">%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className={`h-full rounded-full ${result.fraud ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-teal-500 to-emerald-500'}`}
                        style={{ boxShadow: result.fraud ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 10px rgba(16, 185, 129, 0.5)' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
