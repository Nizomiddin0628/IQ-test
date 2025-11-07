import React, { useState, useCallback } from 'react';
import { Screen, TestResult } from './types';
import HomeScreen from './components/HomeScreen';
import CalibrationScreen from './components/CalibrationScreen';
import TestScreen from './components/TestScreen';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Home);
  const [results, setResults] = useState<TestResult | null>(null);

  const handleStart = useCallback(() => {
    setScreen(Screen.Calibration);
  }, []);

  const handleCalibrationComplete = useCallback(() => {
    setScreen(Screen.Test);
  }, []);

  const handleTestComplete = useCallback((testResult: TestResult) => {
    setResults(testResult);
    setScreen(Screen.Results);
  }, []);
  
  const handleTryAgain = useCallback(() => {
    setResults(null);
    setScreen(Screen.Home);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case Screen.Home:
        return <HomeScreen onStart={handleStart} />;
      case Screen.Calibration:
        return <CalibrationScreen onComplete={handleCalibrationComplete} />;
      case Screen.Test:
        return <TestScreen onTestComplete={handleTestComplete} />;
      case Screen.Results:
        return results ? <ResultsScreen results={results} onTryAgain={handleTryAgain} /> : <HomeScreen onStart={handleStart} />;
      default:
        return <HomeScreen onStart={handleStart} />;
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900 font-sans relative">
      <div className="absolute top-4 left-4 text-lg font-bold text-slate-500 select-none tracking-wider">
        Khalilov
      </div>
      <div key={screen} className="w-full max-w-2xl mx-auto animate-fade-in">
        {renderScreen()}
      </div>
      <footer className="absolute bottom-4 text-center text-slate-600 text-sm">
        © 2024 Khalilov Labs. Barcha huquqlar himoyalangan.
      </footer>
    </main>
  );
};

export default App;