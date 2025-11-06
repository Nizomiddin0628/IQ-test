import React from 'react';
import Button from './Button';
import { Logo, ProfileIcon } from './Icons';
import { APP_NAME } from '../constants';

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700">
      <button className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
        <ProfileIcon className="w-8 h-8" />
      </button>

      <Logo className="w-24 h-24 text-blue-500 mb-4" />

      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
        <span className="text-blue-500">{APP_NAME}</span> ga Xush Kelibsiz
      </h1>
      <p className="mt-4 text-lg text-slate-300 max-w-md">
        Sizning umumiy intellektual koeffitsientingizni o'lchash uchun adaptiv sun'iy intellektga asoslangan test.
      </p>

      <div className="my-8 w-full max-w-sm">
        <Button onClick={onStart} className="w-full text-xl py-4">
          Testni Boshlash
        </Button>
      </div>

      <div className="w-full max-w-lg text-left p-6 bg-slate-900/70 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-3">Qanday Ishlaydi</h2>
        <ol className="list-decimal list-inside space-y-2 text-slate-400">
          <li><span className="font-semibold text-slate-300">Kalibrlash:</span> Sizning boshlang'ich mahoratingizni baholash uchun bir nechta tezkor vazifalar.</li>
          <li><span className="font-semibold text-slate-300">Adaptiv Test:</span> Sun'iy intellekt sizning natijalaringizga moslashtirilgan savollar yaratadi.</li>
          <li><span className="font-semibold text-slate-300">Batafsil Natijalar:</span> O'z ballingizni va kognitiv profilingiz tahlilini oling.</li>
        </ol>
      </div>
    </div>
  );
};

export default HomeScreen;