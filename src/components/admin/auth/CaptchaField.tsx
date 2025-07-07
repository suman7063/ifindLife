import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CaptchaFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

const CaptchaField: React.FC<CaptchaFieldProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);

  // Generate a new CAPTCHA question
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer: number;
    let questionText: string;
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
        break;
      case '-':
        // Ensure positive result
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        answer = larger - smaller;
        questionText = `${larger} - ${smaller}`;
        break;
      case '*':
        // Use smaller numbers for multiplication
        const smallNum1 = Math.floor(Math.random() * 10) + 1;
        const smallNum2 = Math.floor(Math.random() * 10) + 1;
        answer = smallNum1 * smallNum2;
        questionText = `${smallNum1} × ${smallNum2}`;
        break;
      default:
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
    }
    
    setQuestion(questionText);
    setCorrectAnswer(answer);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value) || 0;
    onChange(inputValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="captcha">Security Verification *</Label>
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="bg-gray-100 border rounded-md p-3 text-center font-mono text-lg mb-2">
            {question} = ?
          </div>
          <Input
            id="captcha"
            type="number"
            placeholder="Enter the answer"
            value={value || ''}
            onChange={handleInputChange}
            disabled={disabled}
            className={error ? 'border-red-500' : ''}
          />
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          disabled={disabled}
          className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors disabled:opacity-50"
          title="Generate new question"
        >
          ↻
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {/* Hidden field to store correct answer for validation */}
      <input type="hidden" value={correctAnswer} data-testid="captcha-answer" />
    </div>
  );
};

export default CaptchaField;