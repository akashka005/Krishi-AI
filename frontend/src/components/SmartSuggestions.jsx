import { motion } from 'framer-motion';

export default function SmartSuggestions({ onSelect }) {
  const suggestions = [
    "My crop leaves are turning yellow",
    "Best fertilizer for wheat",
    "Weather impact today"
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((text, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(text)}
          className="text-sm px-4 py-2 bg-white border border-earth-200 text-earth-600 rounded-full hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition shadow-sm whitespace-nowrap"
        >
          {text}
        </motion.button>
      ))}
    </div>
  );
}