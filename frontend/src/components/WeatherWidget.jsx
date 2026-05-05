import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind, Droplets, MapPin, Loader2 } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const query = lat && lon ? `${lat},${lon}` : '';
        const res = await fetch(`https://wttr.in/${query}?format=j1`);
        const data = await res.json();

        const current = data.current_condition[0];
        const area = data.nearest_area[0];

        setWeather({
          temp: current.temp_C,
          condition: current.weatherDesc[0].value,
          humidity: current.humidity,
          wind: current.windspeedKmph,
          rainChance: data.weather[0].hourly[0].chanceofrain,
          location: `${area.areaName[0].value}, ${area.region[0].value}`
        });
      } catch (err) {
        console.error("Weather fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather()
      );
    } else {
      fetchWeather();
    }
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center border border-white/50">
        <Loader2 className="w-6 h-6 text-primary-500 animate-spin mb-2" />
        <span className="text-[10px] font-black text-earth-400 uppercase tracking-widest">Locating Farmer...</span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-white/50"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-harvest-400/20 rounded-full blur-2xl" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-primary-600" />
            <h4 className="text-[10px] font-black text-earth-400 uppercase tracking-widest">Live Forecast</h4>
          </div>
          <p className="text-xs font-bold text-earth-800 truncate max-w-[150px]">{weather.location}</p>
        </div>
        <div className="p-2 bg-harvest-100 rounded-xl text-harvest-600">
          <Sun className="w-5 h-5 animate-spin-slow" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl font-black text-earth-800 tracking-tighter">{weather.temp}°C</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-earth-800 leading-tight">{weather.condition}</span>
          <span className="text-[10px] font-medium text-earth-400 uppercase tracking-tighter">Real-time Data</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2 bg-white/40 rounded-xl border border-white/60">
          <Droplets className="w-3 h-3 text-blue-500 mb-1" />
          <span className="text-[10px] font-black text-earth-800">{weather.humidity}%</span>
          <span className="text-[8px] font-bold text-earth-400 uppercase">Humid</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-white/40 rounded-xl border border-white/60">
          <Wind className="w-3 h-3 text-emerald-500 mb-1" />
          <span className="text-[10px] font-black text-earth-800">{weather.wind}km</span>
          <span className="text-[8px] font-bold text-earth-400 uppercase">Wind</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-white/40 rounded-xl border border-white/60">
          <CloudRain className="w-3 h-3 text-indigo-500 mb-1" />
          <span className="text-[10px] font-black text-earth-800">{weather.rainChance}%</span>
          <span className="text-[8px] font-bold text-earth-400 uppercase">Rain</span>
        </div>
      </div>
    </motion.div>
  );
}