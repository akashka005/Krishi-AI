import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function NeuralAvatar() {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      <motion.div
        className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center border border-emerald-100/50">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="w-5 h-5 text-emerald-600 fill-emerald-50" />
        </motion.div>
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ y: [0, -5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <span className="text-[8px]">✨</span>
        </motion.div>
      </div>
      <motion.div
        className="absolute inset-0 border border-emerald-200/30 rounded-full"
        animate={{ scale: [1, 1.4], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
}