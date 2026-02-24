import React, { useEffect, useState, useRef } from 'react';
import { X, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/Button';
interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  title?: string;
}
export function PinModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
  title = 'Enter Transaction PIN'
}: PinModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
  index: number,
  e: React.KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.
      from('profiles').
      select('pin').
      eq('user_id', userId).
      single();
      if (error) throw error;
      if (data?.pin === enteredPin) {
        onSuccess();
        onClose();
      } else {
        setError('Incorrect PIN');
        setPin(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('PIN verification error:', err);
      setError('Failed to verify PIN');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand-orange" />
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, idx) =>
            <input
              key={idx}
              ref={(el) => inputRefs.current[idx] = el}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all text-white" />

            )}
          </div>

          {error &&
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          }

          <Button type="submit" className="w-full" isLoading={loading}>
            Verify PIN
          </Button>
        </form>
      </div>
    </div>);

}