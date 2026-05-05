import { motion } from 'framer-motion';

export default function VoiceWaveform() {
  const bars = Array.from({ length: 12 });

  return (
    <div className="flex items-center gap-1 h-6 px-3">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-primary-400 to-emerald-500 rounded-full"
          animate={{
            height: [
              Math.random() * 10 + 5,
              Math.random() * 20 + 10,
              Math.random() * 10 + 5
            ]
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}