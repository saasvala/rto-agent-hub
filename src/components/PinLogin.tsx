import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Car, FileText, Shield, AlertCircle, Users } from 'lucide-react';

export default function PinLogin() {
  const { login } = useApp();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('');
      handleSubmit(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (pinValue: string) => {
    if (pinValue.length !== 4) return;
    
    const success = login(pinValue);
    if (success) {
      setSuccessAnim(true);
    } else {
      setError('Invalid PIN');
      setIsShaking(true);
      setPin(['', '', '', '']);
      setTimeout(() => {
        setIsShaking(false);
        inputRefs.current[0]?.focus();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="govt-header px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center animate-scale-in">
            <Car className="w-7 h-7" />
          </div>
          <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center animate-scale-in" style={{ animationDelay: '100ms' }}>
            <FileText className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-xl font-bold">RTO Agent</h1>
        <p className="text-sm opacity-80">Vehicle & License Services</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${successAnim ? 'bg-success checkmark-animate' : 'bg-secondary'}`}>
              <Shield className={`w-8 h-8 ${successAnim ? 'text-success-foreground' : 'text-primary'}`} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Enter PIN</h2>
            <p className="text-sm text-muted-foreground">Enter your 4-digit PIN to login</p>
          </div>

          {/* PIN Input */}
          <div 
            className={`flex justify-center gap-3 mb-6`}
            style={{
              animation: isShaking ? 'shake 0.5s ease-in-out' : 'none'
            }}
          >
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="pin-input"
                autoComplete="off"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center gap-2 text-destructive text-sm mb-4 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Demo Hints */}
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground"><span className="font-medium text-foreground">Owner PIN:</span> 1234</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground"><span className="font-medium text-foreground">Assistant PIN:</span> 5678</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Licensed RTO Agent Software • Offline Ready
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
