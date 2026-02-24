import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Search,
  Filter } from
'lucide-react';
import { TransactionModal } from '../components/TransactionModal';
interface TransactionsPageProps {
  onNavigate: (page: string) => void;
  userProfile: any;
}
export function TransactionsPage({
  onNavigate,
  userProfile
}: TransactionsPageProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (!userProfile?.user_id) return;
    const fetchTransactions = async () => {
      setLoading(true);
      const { data, error } = await supabase.
      from('transactions').
      select('*').
      eq('user_id', userProfile.user_id).
      order('created_at', {
        ascending: false
      });
      if (!error && data) setTransactions(data);
      setLoading(false);
    };
    fetchTransactions();
  }, [userProfile?.user_id]);
  const filteredTransactions = transactions.filter(
    (tx) =>
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.amount?.toString().includes(searchTerm)
  );
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="mb-4 pl-0">

            ← Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-white">
                Transaction History
              </h1>
              <p className="text-gray-400 mt-2">
                View all your incoming and outgoing transactions.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-orange/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />

            </div>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          {loading ?
          <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
            </div> :
          filteredTransactions.length === 0 ?
          <div className="text-center py-20">
              <p className="text-gray-400">No transactions found</p>
            </div> :

          <div className="divide-y divide-white/5">
              {filteredTransactions.map((tx) =>
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">

                  <div className="flex items-center gap-4">
                    <div
                  className={`p-3 rounded-full ${tx.type === 'received' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>

                      {tx.type === 'received' ?
                  <ArrowDownLeft className="h-5 w-5" /> :

                  <ArrowUpRight className="h-5 w-5" />
                  }
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-brand-orange transition-colors">
                        {tx.description || (
                    tx.type === 'received' ? 'Received' : 'Sent')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(tx.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                className={`font-semibold ${tx.type === 'received' ? 'text-green-400' : 'text-red-400'}`}>

                    {tx.type === 'received' ? '+' : '-'}$
                    {Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
            )}
            </div>
          }
        </Card>
      </div>

      <TransactionModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx} />

    </div>);

}