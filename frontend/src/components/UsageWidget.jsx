import { motion } from 'framer-motion';
import { Zap, Activity } from 'lucide-react';

export default function UsageWidget({ queriesRemaining = 7, tier = "Free" }) {
  const maxQueries = tier === "Free" ? 100 : tier === "Pro" ? 500 : 1000;
  const percentage = (queriesRemaining / maxQueries) * 100;

  const tierStyles = {
    "Free": "from-emerald-400 to-teal-500",
    "Pro": "from-blue-400 to-indigo-500",
    "Pro+": "from-purple-400 to-fuchsia-500"
  };

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary-600" />
          <span className="text-[10px] font-black text-earth-400 uppercase tracking-widest">Usage Limit</span>
        </div>
        <div className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${tierStyles[tier]} shadow-sm`}>
          {tier}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-3xl font-black text-earth-800 tracking-tight">{queriesRemaining}</span>
        <span className="text-xs font-bold text-earth-400">/ {maxQueries} queries</span>
      </div>

      <div className="h-2 w-full bg-earth-100/50 rounded-full overflow-hidden mb-2">
        <motion.div
          className={`h-full bg-gradient-to-r ${tierStyles[tier]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
        />
      </div>

    </div>
  );
}