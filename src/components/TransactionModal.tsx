import React from 'react';
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileText,
  DollarSign } from
'lucide-react';
import { Button } from './ui/Button';
interface Transaction {
  id: string;
  type: 'received' | 'sent';
  amount: number;
  description: string;
  created_at: string;
  status?: string;
  sender?: string;
  recipient?: string;
}
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}
export function TransactionModal({
  isOpen,
  onClose,
  transaction
}: TransactionModalProps) {
  if (!isOpen || !transaction) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Transaction Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div
              className={`inline-flex p-4 rounded-full mb-4 ${transaction.type === 'received' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>

              {transaction.type === 'received' ?
              <ArrowDownLeft className="h-8 w-8" /> :

              <ArrowUpRight className="h-8 w-8" />
              }
            </div>
            <h2
              className={`text-3xl font-bold ${transaction.type === 'received' ? 'text-green-500' : 'text-red-500'}`}>

              {transaction.type === 'received' ? '+' : '-'}$
              {Math.abs(transaction.amount).toFixed(2)}
            </h2>
            <p className="text-gray-400 mt-1">{transaction.description}</p>
          </div>

          <div className="space-y-4 bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="h-4 w-4" /> Date
              </div>
              <span className="text-white text-sm">
                {new Date(transaction.created_at).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FileText className="h-4 w-4" /> Status
              </div>
              <span className="text-white text-sm capitalize bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                {transaction.status || 'Completed'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <DollarSign className="h-4 w-4" /> Reference ID
              </div>
              <span className="text-white text-sm font-mono text-xs">
                {transaction.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full" variant="secondary">
            Close
          </Button>
        </div>
      </div>
    </div>);

}