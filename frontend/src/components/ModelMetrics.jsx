import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Heart, Shield } from 'lucide-react';

export default function ModelMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/metrics/`)
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Error fetching metrics:", err));
  }, []);

  if (!metrics) return null;

  const categories = [
    { title: 'NLP Accuracy', icon: Target, data: metrics.nlp, color: 'from-emerald-400 to-teal-500' },
    { title: 'Interaction', icon: Activity, data: metrics.conversation, color: 'from-blue-400 to-indigo-500' },
    { title: 'User Satisfaction', icon: Heart, data: metrics.satisfaction, color: 'from-rose-400 to-orange-500' },
    { title: 'System Health', icon: Shield, data: metrics.system, color: 'from-amber-400 to-harvest-600' }
  ];

  return (
    <div className="space-y-4">
      {categories.map((cat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-card rounded-2xl p-4 overflow-hidden relative group"
        >
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${cat.color}`} />

          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm`}>
              <cat.icon className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-800">{cat.title}</h4>
          </div>

          <div className="space-y-3">
            {Object.entries(cat.data).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-[10px] font-bold text-earth-500 mb-1 uppercase tracking-tight">
                  <span>{key.replace(/_/g, ' ')}</span>
                  <span className="text-earth-800">{value}{key.includes('latency') ? 'ms' : '%'}</span>
                </div>
                <div className="h-1.5 bg-earth-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, typeof value === 'number' ? (key.includes('latency') ? (value / 10) : value) : 0)}%` }}
                    className={`h-full bg-gradient-to-r ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}