import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Sprout, Save, Loader2 } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [crop, setCrop] = useState(user?.crop || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedUser = { ...user, name, location, crop };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onUpdate(updatedUser);
    onClose();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-earth-900/60 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-earth-900">Farmer Profile</h2>
            <button onClick={onClose} className="p-2 hover:bg-earth-100 rounded-full transition">
              <X className="w-5 h-5 text-earth-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-300 w-5 h-5" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-earth-50 border border-earth-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  placeholder="e.g. Akash Sharma"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-400 uppercase tracking-widest ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-300 w-5 h-5" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-earth-50 border border-earth-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  placeholder="e.g. Jaipur, Rajasthan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-earth-400 uppercase tracking-widest ml-1">Primary Crop</label>
              <div className="relative">
                <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-300 w-5 h-5" />
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-earth-50 border border-earth-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none transition-all"
                >
                  <option value="">Select a crop</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Bajra">Bajra</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !name}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}