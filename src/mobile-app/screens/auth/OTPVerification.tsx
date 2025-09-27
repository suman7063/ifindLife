import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail } from 'lucide-react';

export const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // In real app, verify OTP
      navigate('/mobile-app/app/');
    }
  };

  const handleResend = () => {
    setTimeLeft(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="flex flex-col h-screen bg-background p-6">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2 p-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ifind-aqua/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-ifind-aqua" />
          </div>
          
          <h1 className="text-3xl font-poppins font-bold text-ifind-charcoal mb-2">
            Verify Your Account
          </h1>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to your email
          </p>
          <p className="text-sm text-ifind-aqua font-medium mt-1">
            user@example.com
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold"
                maxLength={1}
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={otp.join('').length !== 6}
            className="w-full bg-gradient-to-r from-ifind-aqua to-ifind-teal hover:opacity-90 text-white py-6 disabled:opacity-50"
          >
            Verify Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground mb-2">
            Didn't receive the code?
          </p>
          {canResend ? (
            <Button
              variant="ghost"
              onClick={handleResend}
              className="text-ifind-aqua p-0 h-auto font-normal"
            >
              Resend Code
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend in {timeLeft}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
};