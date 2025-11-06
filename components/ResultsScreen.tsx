
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { TestResult } from '../types';
import Button from './Button';
import { ShareIcon, RetryIcon } from './Icons';
import { PRIMARY_COLOR } from '../constants';

interface ResultsScreenProps {
  results: TestResult;
  onTryAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, onTryAgain }) => {
  const { iqScore, percentile, cognitiveProfile, strengths, weaknesses, totalTimeSeconds } = results;

  return (
    <div className="p-4 md:p-6 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700 w-full animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">Sizning Natijalaringiz</h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-6">
        <div className="flex flex-col items-center justify-center bg-slate-900/50 w-48 h-48 rounded-full border-4 border-blue-600 shadow-lg">
          <span className="text-sm text-slate-400">Sizning IQ Balingiz</span>
          <span className="text-6xl font-bold text-white tracking-tighter">{iqScore}</span>
        </div>
        <div className="text-center md:text-left">
          <p className="text-2xl font-semibold text-slate-200">
            Siz <span className="text-blue-400">{percentile}</span>-foizlikdasiz.
          </p>
          <p className="text-slate-400 max-w-sm mt-2">
            Bu ball sizni ushbu testda umumiy aholining {percentile}%idan yuqoriga qo'yadi.
          </p>
          <p className="text-slate-400 max-w-sm mt-1 text-sm">
            Umumiy vaqt: <span className="font-semibold text-slate-300">{totalTimeSeconds} soniya</span>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">Kognitiv Profil</h2>
          <div className="w-full h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={cognitiveProfile}>
                <PolarGrid stroke="#4A5568" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar name="Sizning Balingiz" dataKey="score" stroke={PRIMARY_COLOR} fill={PRIMARY_COLOR} fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-lg flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-white mb-4">Tahlil</h2>
            <div>
              <h3 className="text-lg font-semibold text-green-400">Kuchli Tomonlar</h3>
              <ul className="list-disc list-inside text-slate-300 mt-1 mb-4">
                {strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
             <div>
              <h3 className="text-lg font-semibold text-yellow-400">Rivojlanish Uchun Yo'nalishlar</h3>
              <ul className="list-disc list-inside text-slate-300 mt-1">
                {weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="secondary">
            <ShareIcon className="w-5 h-5" />
            Natijalarni Ulashish
        </Button>
        <Button onClick={onTryAgain} variant="primary">
            <RetryIcon className="w-5 h-5" />
            Qayta Urinish
        </Button>
      </div>
    </div>
  );
};

export default ResultsScreen;
