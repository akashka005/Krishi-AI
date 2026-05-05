import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Sparkles, X, Camera } from 'lucide-react';
import VoiceWaveform from './VoiceWaveform';

export default function SmartInput({ onSend, disabled }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSend(query);
      setQuery('');
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto px-4 pb-6 transition-all duration-500 ${disabled ? 'opacity-50 grayscale' : ''}`}>
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{
            y: isFocused ? -4 : 0,
            scale: isFocused ? 1.01 : 1
          }}
          className={`relative flex items-center glass-card rounded-3xl p-2 transition-all duration-300 ${isFocused ? 'shadow-2xl border-primary-300/50' : 'border-white/40'}`}
        >
          <div className="absolute -top-10 left-4 flex items-center gap-2">
            <AnimatePresence>
              {isFocused && !isListening && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/40 backdrop-blur-md rounded-full border border-white/40 shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    KRISHI Neural Engine Active
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1 flex items-center">
            {isListening ? (
              <div className="flex-1 flex items-center justify-between px-4 py-3">
                <span className="text-[10px] font-black text-primary-600 animate-pulse uppercase tracking-widest">Listening...</span>
                <VoiceWaveform />
                <button
                  type="button"
                  onClick={() => setIsListening(false)}
                  className="p-1.5 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  disabled={disabled}
                  className="p-3.5 text-earth-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed group"
                  title="Vision Analysis (Coming Soon)"
                >
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <input
                  type="text"
                  value={query}
                  disabled={disabled}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={disabled ? "Limit reached..." : "What's on your mind, farmer?"}
                  className="flex-1 bg-transparent border-none focus:outline-none px-4 text-earth-800 font-medium placeholder:text-earth-300 disabled:cursor-not-allowed"
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-2 pr-1">
            {!isListening && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setIsListening(true)}
                className={`p-3.5 rounded-2xl transition-all duration-300 relative group text-earth-400 hover:text-primary-600 hover:bg-primary-50 disabled:cursor-not-allowed`}
              >
                <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!query.trim() || disabled || isListening}
              className="p-3.5 bg-earth-800 text-white rounded-2xl hover:bg-earth-900 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-earth-200"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}