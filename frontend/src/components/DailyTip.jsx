import { Lightbulb } from 'lucide-react';

export default function DailyTip() {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-earth-50 border border-primary-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Lightbulb className="w-16 h-16 text-primary-500" />
      </div>

      <div className="flex items-center gap-2 text-primary-700 font-semibold mb-2">
        <span className="text-lg">🌱</span> Tip of the Day
      </div>

      <p className="text-sm text-earth-700 leading-relaxed relative z-10">
        Water crops early morning to reduce evaporation and prevent fungal diseases on leaves.
      </p>
    </div>
  );
}