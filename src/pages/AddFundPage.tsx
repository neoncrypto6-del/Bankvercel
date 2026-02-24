import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { supabase } from '../lib/supabase';
import { PinModal } from '../components/PinModal';
import {
  ArrowLeft,
  Copy,
  Check,
  Landmark,
  Bitcoin,
  Gift,
  Upload,
  Loader2,
  AlertTriangle } from
'lucide-react';
interface AddFundPageProps {
  onNavigate: (page: string) => void;
  userProfile: any;
}
export function AddFundPage({ onNavigate, userProfile }: AddFundPageProps) {
  const [activeTab, setActiveTab] = useState<'bank' | 'crypto' | 'gift'>('bank');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [giftForm, setGiftForm] = useState({
    type: 'amazon',
    amount: '',
    details: ''
  });
  const [giftFile, setGiftFile] = useState<File | null>(null);
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftSuccess, setGiftSuccess] = useState(false);
  const [giftError, setGiftError] = useState<string | null>(null);
  const giftFileRef = useRef<HTMLInputElement | null>(null);
  const cryptoWallets = [
  {
    name: 'Bitcoin (BTC)',
    address: 'bc1qedjgpmpa69922x2pzqgyfp0nxf20wxvwzl2qvk'
  },
  {
    name: 'Ethereum (ETH)',
    address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  {
    name: 'Solana (SOL)',
    address: 'DEHwbFtyBkKN6fR67xDjsVXTp51LuBSxeHBtUqCBMvjR'
  },
  {
    name: 'BNB Smart Chain',
    address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  {
    name: 'USDT (ERC20)',
    address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  {
    name: 'USDC (ERC20)',
    address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  {
    name: 'Dogecoin (DOGE)',
    address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4'
  },
  {
    name: 'Tron (TRX)',
    address: 'TXHFMFSryaVDhPkTmawzqNxdpKimd2wwp6'
  },
  {
    name: 'XRP',
    address: 'rUsdW7rnoR1uGwYw79U7YT1PRZL6Etk45'
  },
  {
    name: 'Litecoin (LTC)',
    address: 'ltc1qufqrwwqcu04xn974w7vechjvqd08xd7e78yvhm'
  }];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };
  const initiateGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGiftError(null);
    if (!giftForm.amount || parseFloat(giftForm.amount) <= 0)
    return setGiftError('Please enter a valid amount.');
    setShowPin(true);
  };
  const handlePinSuccess = async () => {
    setGiftLoading(true);
    try {
      let fileUrl = '';
      if (giftFile && userProfile?.user_id) {
        const ext = giftFile.name.split('.').pop() || 'bin';
        const path = `${userProfile.user_id}/giftcard/${Date.now()}.${ext}`;
        const { error: storageError } = await supabase.storage.
        from('documents').
        upload(path, giftFile, {
          upsert: true,
          contentType: giftFile.type || 'image/jpeg'
        });
        if (storageError)
        throw new Error(`Image upload failed: ${storageError.message}`);
        const { data: urlData } = supabase.storage.
        from('documents').
        getPublicUrl(path);
        fileUrl = urlData.publicUrl;
        const { error: docError } = await supabase.from('documents').insert([
        {
          user_id: userProfile.user_id,
          doc_type: 'giftcard',
          file_url: fileUrl
        }]
        );
        if (docError) console.error('Doc record error:', docError.message);
      }
      if (userProfile?.user_id) {
        const { error: txError } = await supabase.from('transactions').insert([
        {
          user_id: userProfile.user_id,
          type: 'received',
          amount: parseFloat(giftForm.amount),
          description: `Gift Card Redemption (${giftForm.type}) — Pending Review`,
          created_at: new Date().toISOString()
        }]
        );
        if (txError)
        throw new Error(`Transaction record failed: ${txError.message}`);
      }
      setGiftSuccess(true);
      setGiftForm({
        type: 'amazon',
        amount: '',
        details: ''
      });
      setGiftFile(null);
      setTimeout(() => setGiftSuccess(false), 4000);
    } catch (err: any) {
      console.error('Gift card submission error:', err);
      setGiftError(err.message || 'Submission failed. Please try again.');
    } finally {
      setGiftLoading(false);
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
          Add Funds
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
          {
            key: 'bank',
            icon: Landmark,
            label: 'Bank Transfer'
          },
          {
            key: 'crypto',
            icon: Bitcoin,
            label: 'Crypto Deposit'
          },
          {
            key: 'gift',
            icon: Gift,
            label: 'Gift Card'
          }].
          map(({ key, icon: Icon, label }) =>
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-3 ${activeTab === key ? 'bg-gradient-brand border-transparent text-white shadow-lg' : 'glass-card hover:bg-white/10 text-gray-300'}`}>

              <Icon className="h-8 w-8" />
              <span className="font-medium">{label}</span>
            </button>
          )}
        </div>

        <Card className="min-h-[400px]">
          {/* BANK TRANSFER */}
          {activeTab === 'bank' &&
          <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-2">
                Receive via Bank Transfer
              </h2>
              <p className="text-gray-400 text-sm">
                Share these details to receive money from another bank account.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Account Name
                  </p>
                  <p className="text-white font-medium">
                    {userProfile?.full_name || '—'}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Bank Name
                  </p>
                  <p className="text-white font-medium">Bank Vercel</p>
                </div>
                {[
              {
                label: 'Account Number',
                value: userProfile?.account_number,
                key: 'acc'
              },
              {
                label: 'Routing Number',
                value: userProfile?.routing_number,
                key: 'rout'
              }].
              map(({ label, value, key }) =>
              <div
                key={key}
                className="bg-white/5 p-4 rounded-lg border border-white/10">

                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-mono font-medium">
                        {value || '—'}
                      </p>
                      <button
                    onClick={() => copyToClipboard(value || '', key)}
                    className="text-gray-400 hover:text-brand-orange transition-colors ml-2">

                        {copiedKey === key ?
                    <Check className="h-4 w-4 text-green-400" /> :

                    <Copy className="h-4 w-4" />
                    }
                      </button>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* CRYPTO */}
          {activeTab === 'crypto' &&
          <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-2">
                Deposit Cryptocurrency
              </h2>
              <p className="text-gray-400 text-sm">
                Send crypto to the addresses below. Only send the matching coin
                to each address.
              </p>
              <div className="space-y-3">
                {cryptoWallets.map((wallet) =>
              <div
                key={wallet.name}
                className="bg-white/5 p-4 rounded-lg border border-white/10">

                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white text-sm">
                        {wallet.name}
                      </span>
                      <button
                    onClick={() =>
                    copyToClipboard(wallet.address, wallet.name)
                    }
                    className="text-brand-orange hover:text-white text-xs flex items-center gap-1 transition-colors">

                        {copiedKey === wallet.name ?
                    <>
                            <Check className="h-3 w-3" /> Copied
                          </> :

                    <>
                            <Copy className="h-3 w-3" /> Copy
                          </>
                    }
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 break-all font-mono bg-black/30 p-2 rounded">
                      {wallet.address}
                    </p>
                  </div>
              )}
              </div>
            </div>
          }

          {/* GIFT CARD */}
          {activeTab === 'gift' &&
          <div className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-2">
                Redeem Gift Card
              </h2>
              <p className="text-gray-400 text-sm">
                Submit your gift card details for review and credit to your
                account.
              </p>

              {giftSuccess &&
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm flex items-center gap-2">
                  <Check className="h-4 w-4" /> Gift card submitted for review!
                </div>
            }
              {giftError &&
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {giftError}
                </div>
            }

              <form
              onSubmit={initiateGiftSubmit}
              className="space-y-5 max-w-lg">

                <Select
                label="Gift Card Type"
                value={giftForm.type}
                onChange={(e) =>
                setGiftForm({
                  ...giftForm,
                  type: e.target.value
                })
                }
                options={[
                {
                  value: 'amazon',
                  label: 'Amazon'
                },
                {
                  value: 'apple',
                  label: 'Apple / iTunes'
                },
                {
                  value: 'google',
                  label: 'Google Play'
                },
                {
                  value: 'steam',
                  label: 'Steam'
                },
                {
                  value: 'vanilla',
                  label: 'Vanilla Visa'
                },
                {
                  value: 'other',
                  label: 'Other'
                }]
                } />

                <Input
                label="Amount ($)"
                type="number"
                placeholder="100.00"
                min="1"
                step="0.01"
                value={giftForm.amount}
                onChange={(e) =>
                setGiftForm({
                  ...giftForm,
                  amount: e.target.value
                })
                }
                required />

                <Input
                label="Card Code / Additional Details"
                placeholder="Enter card code or details"
                value={giftForm.details}
                onChange={(e) =>
                setGiftForm({
                  ...giftForm,
                  details: e.target.value
                })
                } />


                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Upload Card Image
                  </label>
                  <input
                  type="file"
                  accept="image/*"
                  ref={giftFileRef}
                  className="hidden"
                  onChange={(e) => setGiftFile(e.target.files?.[0] || null)} />

                  <button
                  type="button"
                  onClick={() => giftFileRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors ${giftFile ? 'border-green-500/40 bg-green-500/10' : 'border-white/20 hover:bg-white/5 hover:border-white/30'}`}>

                    {giftFile ?
                  <>
                        <Check className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 text-sm font-medium">
                          {giftFile.name}
                        </p>
                      </> :

                  <>
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">
                          Click to upload front and back of card
                        </p>
                      </>
                  }
                  </button>
                </div>

                <Button
                type="submit"
                className="w-full"
                isLoading={giftLoading}>

                  Submit for Review
                </Button>
              </form>
            </div>
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