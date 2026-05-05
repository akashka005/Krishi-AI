import { TrendingUp, FileQuestion } from 'lucide-react';

export default function UserInsights({ totalQueries = 0, mostAsked = "None" }) {
  return (
    <div className="bg-white border border-earth-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-earth-500" />
        <h3 className="font-semibold text-earth-900">Your Insights</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-earth-50 rounded-xl p-3">
          <div className="text-xs text-earth-500 mb-1 flex items-center gap-1">
            <FileQuestion className="w-3.5 h-3.5" /> Total Queries
          </div>
          <div className="text-xl font-bold text-earth-900">{totalQueries}</div>
        </div>

        <div className="bg-primary-50 rounded-xl p-3 border border-primary-100/50">
          <div className="text-xs text-primary-600 mb-1 flex items-center gap-1">
            <span>🌾</span> Most Asked
          </div>
          <div className="text-xl font-bold text-primary-900 truncate">{mostAsked}</div>
        </div>
      </div>

      {mostAsked !== "None" && (
        <div className="bg-gold-50/50 border border-gold-200/50 rounded-xl p-3">
          <p className="text-xs text-earth-700 leading-relaxed">
            You frequently ask about {mostAsked.toLowerCase()}—<button className="text-gold-600 font-bold hover:underline">enable {mostAsked.toLowerCase()} alerts?</button>
          </p>
        </div>
      )}
    </div>
  );
}