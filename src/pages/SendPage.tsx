import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Send, Bitcoin, Check, AlertTriangle } from 'lucide-react';
import { PinModal } from '../components/PinModal';
interface SendPageProps {
  onNavigate: (page: string) => void;
  userProfile: any;
  onProfileUpdate?: () => void;
}
export function SendPage({
  onNavigate,
  userProfile,
  onProfileUpdate
}: SendPageProps) {
  const [activeTab, setActiveTab] = useState<'bank' | 'crypto'>('bank');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [pendingTx, setPendingTx] = useState<'bank' | 'crypto' | null>(null);
  const [bankForm, setBankForm] = useState({
    amount: '',
    bank: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    description: ''
  });
  const [cryptoForm, setCryptoForm] = useState({
    amount: '',
    cryptoType: 'btc',
    walletAddress: ''
  });
  const initiateBankSend = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = parseFloat(bankForm.amount);
    if (!amount || amount <= 0) return setError('Please enter a valid amount.');
    if (amount > (userProfile?.balance ?? 0))
    return setError('Insufficient balance.');
    setPendingTx('bank');
    setShowPin(true);
  };
  const initiateCryptoSend = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = parseFloat(cryptoForm.amount);
    if (!amount || amount <= 0) return setError('Please enter a valid amount.');
    if (!cryptoForm.walletAddress)
    return setError('Please enter a wallet address.');
    setPendingTx('crypto');
    setShowPin(true);
  };
  const handlePinSuccess = async () => {
    setIsLoading(true);
    try {
      if (pendingTx === 'bank') {
        const amount = parseFloat(bankForm.amount);
        const newBalance = (userProfile?.balance ?? 0) - amount;
        const { error: txError } = await supabase.from('transactions').insert([
        {
          user_id: userProfile.user_id,
          type: 'sent',
          amount: amount,
          description: `Sent to ${bankForm.accountName} (${bankForm.bank})`,
          recipient: bankForm.accountName,
          created_at: new Date().toISOString()
        }]
        );
        if (txError) throw txError;
        const { error: balError } = await supabase.
        from('profiles').
        update({
          balance: newBalance
        }).
        eq('user_id', userProfile.user_id);
        if (balError) throw balError;
        onProfileUpdate?.();
        setBankForm({
          amount: '',
          bank: '',
          accountName: '',
          accountNumber: '',
          routingNumber: '',
          description: ''
        });
      } else if (pendingTx === 'crypto') {
        const amount = parseFloat(cryptoForm.amount);
        const { error: txError } = await supabase.from('transactions').insert([
        {
          user_id: userProfile.user_id,
          type: 'sent',
          amount: amount,
          description: `Sent ${cryptoForm.cryptoType.toUpperCase()} to ${cryptoForm.walletAddress.slice(0, 10)}...`,
          recipient: cryptoForm.walletAddress,
          created_at: new Date().toISOString()
        }]
        );
        if (txError) throw txError;
        setCryptoForm({
          amount: '',
          cryptoType: 'btc',
          walletAddress: ''
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
      setPendingTx(null);
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate('dashboard')}
          className="mb-6 pl-0 hover:bg-transparent hover:text-brand-orange">

          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-serif font-bold text-white mb-8">
          Send Money
        </h1>

        {success &&
        <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-3">
            <Check className="h-5 w-5 flex-shrink-0" />
            <span>
              Transaction submitted successfully! It will appear in your
              transaction history.
            </span>
          </div>
        }

        {error &&
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        }

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => {
              setActiveTab('bank');
              setError(null);
              setSuccess(false);
            }}
            className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-3 ${activeTab === 'bank' ? 'bg-gradient-brand border-transparent text-white shadow-lg' : 'glass-card hover:bg-white/10 text-gray-300'}`}>

            <Send className="h-8 w-8" />
            <span className="font-medium">Send to Bank Account</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('crypto');
              setError(null);
              setSuccess(false);
            }}
            className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-3 ${activeTab === 'crypto' ? 'bg-gradient-brand border-transparent text-white shadow-lg' : 'glass-card hover:bg-white/10 text-gray-300'}`}>

            <Bitcoin className="h-8 w-8" />
            <span className="font-medium">Send Crypto</span>
          </button>
        </div>

        <Card className="max-w-2xl mx-auto">
          {activeTab === 'bank' &&
          <form onSubmit={initiateBankSend} className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-4">
                Bank Transfer Details
              </h2>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex justify-between items-center">
                <span className="text-sm text-gray-400">Available Balance</span>
                <span className="text-white font-semibold">
                  $
                  {(userProfile?.balance ?? 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2
                })}
                </span>
              </div>
              <Input
              label="Amount to Send ($)"
              type="number"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={bankForm.amount}
              onChange={(e) =>
              setBankForm({
                ...bankForm,
                amount: e.target.value
              })
              }
              required />

              <Input
              label="Bank Name"
              placeholder="e.g. Chase Bank"
              value={bankForm.bank}
              onChange={(e) =>
              setBankForm({
                ...bankForm,
                bank: e.target.value
              })
              }
              required />

              <Input
              label="Account Name"
              placeholder="Recipient's Full Name"
              value={bankForm.accountName}
              onChange={(e) =>
              setBankForm({
                ...bankForm,
                accountName: e.target.value
              })
              }
              required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                label="Account Number"
                placeholder="0000000000"
                value={bankForm.accountNumber}
                onChange={(e) =>
                setBankForm({
                  ...bankForm,
                  accountNumber: e.target.value
                })
                }
                required />

                <Input
                label="Routing Number"
                placeholder="000000000"
                value={bankForm.routingNumber}
                onChange={(e) =>
                setBankForm({
                  ...bankForm,
                  routingNumber: e.target.value
                })
                }
                required />

              </div>
              <Input
              label="Description (Optional)"
              placeholder="Payment for..."
              value={bankForm.description}
              onChange={(e) =>
              setBankForm({
                ...bankForm,
                description: e.target.value
              })
              } />

              <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}>

                Send Funds
              </Button>
            </form>
          }

          {activeTab === 'crypto' &&
          <form onSubmit={initiateCryptoSend} className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-4">
                Crypto Transfer Details
              </h2>
              <Select
              label="Select Cryptocurrency"
              value={cryptoForm.cryptoType}
              onChange={(e) =>
              setCryptoForm({
                ...cryptoForm,
                cryptoType: e.target.value
              })
              }
              options={[
              {
                value: 'btc',
                label: 'Bitcoin (BTC)'
              },
              {
                value: 'eth',
                label: 'Ethereum (ETH)'
              },
              {
                value: 'sol',
                label: 'Solana (SOL)'
              },
              {
                value: 'bnb',
                label: 'BNB Smart Chain'
              },
              {
                value: 'usdt',
                label: 'Tether (USDT)'
              },
              {
                value: 'usdc',
                label: 'USD Coin (USDC)'
              },
              {
                value: 'doge',
                label: 'Dogecoin (DOGE)'
              },
              {
                value: 'trx',
                label: 'Tron (TRX)'
              },
              {
                value: 'xrp',
                label: 'XRP'
              },
              {
                value: 'ltc',
                label: 'Litecoin (LTC)'
              }]
              } />

              <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              min="0.000001"
              step="any"
              value={cryptoForm.amount}
              onChange={(e) =>
              setCryptoForm({
                ...cryptoForm,
                amount: e.target.value
              })
              }
              required />

              <Input
              label="Recipient Wallet Address"
              placeholder="Enter recipient wallet address"
              value={cryptoForm.walletAddress}
              onChange={(e) =>
              setCryptoForm({
                ...cryptoForm,
                walletAddress: e.target.value
              })
              }
              required />

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  Double-check the wallet address. Crypto transactions are
                  irreversible.
                </p>
              </div>
              <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}>

                Send Crypto
              </Button>
            </form>
          }
        </Card>
      </div>

      <PinModal
        isOpen={showPin}
        onClose={() => setShowPin(false)}
        onSuccess={handlePinSuccess}
        userId={userProfile?.user_id} />

    </div>);

}