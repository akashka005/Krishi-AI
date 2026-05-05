import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Scan, CheckCircle, Sparkles } from 'lucide-react';

export default function DiseaseDetection({ tier = "Free", onUpgrade }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const isLocked = tier !== "Pro+";

  const handleSimulateScan = () => {
    if (isLocked) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        name: "Leaf Blight",
        confidence: 94,
        treatment: "Apply Mancozeb fungicide and ensure proper spacing for aeration."
      });
    }, 2500);
  };

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
      {isLocked && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 border border-earth-100">
            <Sparkles className="w-6 h-6 text-primary-500" />
          </div>
          <h4 className="text-sm font-black text-earth-800 mb-1 uppercase tracking-tight text-shimmer">Neural Vision Engine</h4>
          <p className="text-[10px] font-bold text-earth-400 mb-4 uppercase tracking-tighter">Under Development • Coming Soon</p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <Scan className="w-5 h-5 text-primary-600" />
        <h3 className="text-xs font-black text-earth-800 uppercase tracking-widest">Disease Analysis</h3>
      </div>

      {!result ? (
        <div
          onClick={handleSimulateScan}
          className="border-2 border-dashed border-earth-100 rounded-2xl bg-earth-50/30 h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-primary-200 transition-all relative overflow-hidden group"
        >
          {analyzing ? (
            <div className="flex flex-col items-center">
              <motion.div
                className="w-20 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mb-4 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                animate={{ y: [-30, 30] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              />
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">Neural Scanning...</span>
            </div>
          ) : (
            <div className="text-center group-hover:scale-110 transition-transform duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 border border-earth-50">
                <span className="text-2xl">📸</span>
              </div>
              <span className="text-[10px] font-black text-earth-400 uppercase tracking-widest">Upload Sample</span>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-black text-emerald-900 text-lg tracking-tight">{result.name}</h4>
              <div className="flex items-center gap-1 bg-white/60 px-2 py-1 rounded-full border border-white">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-700">{result.confidence}%</span>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-3 border border-emerald-100/50 shadow-sm">
              <span className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Protocol</span>
              <p className="text-xs text-earth-800 leading-relaxed font-medium">{result.treatment}</p>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full py-3 text-[10px] font-black text-earth-400 hover:text-earth-800 uppercase tracking-widest transition-colors"
          >
            Scan New Sample
          </button>
        </motion.div>
      )}
    </div>
  );
}