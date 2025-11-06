
import React, { useState, useEffect, useCallback } from 'react';
import { MatrixQuestion, TestResult } from '../types';
import { generateMatrixQuestion } from '../services/geminiService';
import { TOTAL_QUESTIONS, TIME_PER_QUESTION } from '../constants';
import MatrixReasoning from './MatrixReasoning';

interface TestScreenProps {
  onTestComplete: (result: TestResult) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const TestScreen: React.FC<TestScreenProps> = ({ onTestComplete }) => {
  const [questions, setQuestions] = useState<MatrixQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isLoading, setIsLoading] = useState(true);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);

  const finishTest = useCallback(() => {
    if (!testStartTime) return;

    const totalTimeSeconds = Math.round((Date.now() - testStartTime) / 1000);
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctOptionIndex) {
        correctAnswers++;
      }
    });
    
    const accuracy = (correctAnswers / questions.length) * 100;
    
    // Simplified scoring with time bonus
    const baseScore = 80 + (accuracy / 100) * 50;
    const averageTimePerQuestion = totalTimeSeconds / questions.length;
    const timeBonus = Math.max(-10, Math.min(15, (15 - averageTimePerQuestion) * 0.8));
    
    const iqScore = Math.round(baseScore + timeBonus);
    const percentile = Math.min(99, Math.round(15 + (iqScore - 85) / 50 * 80));

    const result: TestResult = {
      iqScore,
      percentile,
      cognitiveProfile: [
        { name: 'Matritsali Mantiq', score: correctAnswers, fullMark: TOTAL_QUESTIONS },
        { name: 'Ishchi Xotira', score: Math.floor(Math.random() * 8) + 1, fullMark: 10 },
        { name: 'Qayta Ishlash Tezligi', score: Math.floor(Math.random() * 8) + 1, fullMark: 10 },
        { name: 'Mantiq', score: Math.floor(Math.random() * 8) + 1, fullMark: 10 },
        { name: 'Vizual-Fazoviy', score: Math.floor(Math.random() * 8) + 1, fullMark: 10 },
      ],
      strengths: ['Naqshlarni Aniqlash', 'Mantiqiy Xulosa'],
      weaknesses: ["Detallarga E'tibor"],
      totalTimeSeconds,
    };
    onTestComplete(result);
  }, [answers, questions, onTestComplete, testStartTime]);
  
  const nextQuestion = useCallback(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(TIME_PER_QUESTION);
      } else {
        finishTest();
      }
  }, [currentQuestionIndex, questions.length, finishTest]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const questionPromises: Promise<MatrixQuestion>[] = [];
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
          const difficulty = 3 + Math.floor(i / 2); 
          questionPromises.push(generateMatrixQuestion(difficulty));
        }
        const newQuestions = await Promise.all(questionPromises);
        setQuestions(newQuestions);
        setAnswers(new Array(TOTAL_QUESTIONS).fill(null));
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        // Handle error state in UI if necessary
      } finally {
        setIsLoading(false);
        setTestStartTime(Date.now());
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isLoading || !testStartTime) return;
    if (timeLeft <= 0) {
      nextQuestion();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, nextQuestion, testStartTime]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    setTimeout(() => {
      nextQuestion();
    }, 300); // Short delay to show selection
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;
  const timePercentage = (timeLeft / TIME_PER_QUESTION) * 100;
  
  if (isLoading || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700 min-h-[500px]">
        <h2 className="text-2xl font-semibold mb-4 text-white">AI Savollarni Yaratmoqda...</h2>
        <p className="text-slate-400 mb-6">Bu biroz vaqt olishi mumkin. Iltimos, kuting.</p>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700 w-full">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 text-slate-300">
          <span>Savol {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}</span>
          <span className="font-mono text-lg font-bold text-white">{timeLeft}s</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-1 mt-2">
          <div className="bg-yellow-400 h-1 rounded-full" style={{ width: `${timePercentage}%` }}></div>
        </div>
      </div>

      <MatrixReasoning
        key={currentQuestionIndex}
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default TestScreen;
