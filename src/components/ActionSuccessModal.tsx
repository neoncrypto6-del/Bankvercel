import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from './ui/Button';
interface ActionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}
export function ActionSuccessModal({
  isOpen,
  onClose,
  title,
  message
}: ActionSuccessModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in duration-200">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-400 mb-8">{message}</p>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>);

}