import { MapPin, ThermometerSun, CloudRain } from 'lucide-react';

export default function ContextCard({ className = "" }) {
  return (
    <div className={`glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between ${className}`}>
      <div className="flex flex-wrap gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-earth-600">
          <MapPin className="w-5 h-5 text-earth-400" />
          <span className="font-medium">Punjab, India</span>
        </div>

        <div className="flex items-center gap-2 text-earth-600">
          <ThermometerSun className="w-5 h-5 text-gold-500" />
          <span className="font-medium">28°C</span>
        </div>

        <div className="flex items-center gap-2 text-earth-600">
          <CloudRain className="w-5 h-5 text-blue-500" />
          <span className="font-medium">20% Rain</span>
        </div>
      </div>

      <div className="h-px w-full sm:w-px sm:h-8 bg-earth-200"></div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-earth-500">Best crops now:</span>
        <span className="text-sm font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
          Bajra, Moong
        </span>
      </div>
    </div>
  );
}