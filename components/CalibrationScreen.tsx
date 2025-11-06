import React, { useEffect, useState } from 'react';

interface CalibrationScreenProps {
  onComplete: () => void;
}

const CalibrationScreen: React.FC<CalibrationScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Test muhiti tayyorlanmoqda...");

  useEffect(() => {
    const messages = [
      "Qayta ishlash tezligi tahlil qilinmoqda...",
      "Mantiqiy matritsa kalibrlanmoqda...",
      "Kognitiv noxolisliklar sozlanmoqda...",
      "Adaptiv algoritm yakunlanmoqda...",
      "Test tayyor."
    ];
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100 / (messages.length * 20);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if(messageIndex < messages.length) {
        setMessage(messages[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 800);

    return () => {
        clearInterval(interval);
        clearInterval(messageInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700 min-h-[400px]">
      <h1 className="text-3xl font-bold text-white mb-4">Mahoratni Kalibrlash</h1>
      <p className="text-slate-300 mb-8 max-w-sm">Iltimos, kuting, biz test qiyinligini sizning kognitiv darajangizga moslashtirmoqdamiz.</p>

      <div className="w-full max-w-md bg-slate-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-lg text-blue-400 font-mono tracking-wider">{message}</p>
    </div>
  );
};

export default CalibrationScreen;