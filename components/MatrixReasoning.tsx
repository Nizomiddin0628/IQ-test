import React, { useState } from 'react';
import { MatrixQuestion } from '../types';

interface MatrixReasoningProps {
  question: MatrixQuestion;
  onAnswer: (optionIndex: number) => void;
}

const MatrixReasoning: React.FC<MatrixReasoningProps> = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedOption(index);
    onAnswer(index);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl md:text-2xl font-semibold text-center text-white mb-4">Naqshni to'ldiring</h2>
      
      <div className="w-full max-w-sm aspect-square bg-slate-900/50 p-3 rounded-lg grid grid-cols-3 gap-2 md:gap-3 shadow-inner">
        {question.grid.map((item, index) => (
          <div key={index} className={`aspect-square flex items-center justify-center rounded-md text-4xl md:text-5xl ${index === 8 ? 'bg-slate-700/50 border-2 border-dashed border-slate-500' : 'bg-slate-700'}`}>
            {item !== '?' && <span>{item}</span>}
          </div>
        ))}
      </div>

      <p className="text-center text-slate-400 italic mt-4 mb-6">Quyidagi to'g'ri variantni tanlang:</p>
      
      <div className="w-full max-w-md grid grid-cols-3 gap-3 md:gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`aspect-square flex items-center justify-center rounded-lg text-4xl md:text-5xl transition-all duration-200 transform hover:scale-105
              ${selectedOption === index 
                ? 'bg-blue-600 ring-4 ring-blue-400 scale-105 shadow-lg' 
                : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MatrixReasoning;