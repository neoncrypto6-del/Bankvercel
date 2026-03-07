import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  DollarSign,
  X,
} from 'lucide-react';

interface AddFundPageProps {
  onNavigate: (page: string) => void;
  userProfile: any;
}

export function AddFundPage({ onNavigate, userProfile }: AddFundPageProps) {
  const [activeTab, setActiveTab] = useState<'bank' | 'crypto' | 'gift' | 'cashapp'>('bank');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  // Gift card states
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

  // Cash App states
  const [cashappTag, setCashappTag] = useState<string>('$BankVercel');
  const [loadingTag, setLoadingTag] = useState(true);
  const [cashappError, setCashappError] = useState<string | null>(null);
  const [cashappAmount, setCashappAmount] = useState('');
  const [cashappProofFile, setCashappProofFile] = useState<File | null>(null);
  const [cashappSubmitting, setCashappSubmitting] = useState(false);
  const [cashappMessage, setCashappMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const cashappFileInputRef = useRef<HTMLInputElement | null>(null);

  // Crypto states
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [cryptoProofFile, setCryptoProofFile] = useState<File | null>(null);
  const [cryptoSubmitting, setCryptoSubmitting] = useState(false);
  const [cryptoMessage, setCryptoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const cryptoFileInputRef = useRef<HTMLInputElement | null>(null);

  const cryptoWallets = [
    { name: 'Bitcoin (BTC)', address: 'bc1qedjgpmpa69922x2pzqgyfp0nxf20wxvwzl2qvk' },
    { name: 'Ethereum (ETH)', address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4' },
    { name: 'Solana (SOL)', address: 'DEHwbFtyBkKN6fR67xDjsVXTp51LuBSxeHBtUqCBMvjR' },
    { name: 'BNB Smart Chain', address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4' },
    { name: 'USDT (ERC20)', address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4' },
    { name: 'USDC (ERC20)', address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4' },
    { name: 'Dogecoin (DOGE)', address: '0xdf708b40Eb7b6f252caf99Dfd7BfE031d00593D4' },
    { name: 'Tron (TRX)', address: 'TXHFMFSryaVDhPkTmawzqNxdpKimd2wwp6' },
    { name: 'XRP', address: 'rUsdW7rnoR1uGwYw79U7YT1PRZL6Etk45' },
    { name: 'Litecoin (LTC)', address: 'ltc1qufqrwwqcu04xn974w7vechjvqd08xd7e78yvhm' }
  ];

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    if (!userProfile?.user_id) {
      setLoadingTag(false);
      setCashappError("No user profile found");
      return;
    }

    const fetchCashAppTag = async () => {
      try {
        setLoadingTag(true);
        setCashappError(null);
        const { data, error } = await supabase
          .from('profiles')
          .select('cashapp_tag')
          .eq('user_id', userProfile.user_id)
          .maybeSingle();
        if (error) throw error;
        if (data?.cashapp_tag) {
          const tag = data.cashapp_tag.trim();
          setCashappTag(tag.startsWith('$') ? tag : `$${tag}`);
        } else {
          setCashappError("Cash App tag not set in your profile");
        }
      } catch (err: any) {
        console.error('Failed to load Cash App tag:', err);
        setCashappError("Could not load Cash App tag");
      } finally {
        setLoadingTag(false);
      }
    };

    fetchCashAppTag();

    const channel = supabase
      .channel(`profiles-cashapp:${userProfile.user_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userProfile.user_id}`
        },
        (payload) => {
          const newTag = payload.new?.cashapp_tag;
          if (newTag !== undefined) {
            const tag = (newTag || '').trim();
            setCashappTag(tag ? (tag.startsWith('$') ? tag : `$${tag}`) : '$BankVercel');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userProfile?.user_id]);

  const initiateGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGiftError(null);
    if (!giftForm.amount || parseFloat(giftForm.amount) <= 0) {
      return setGiftError('Please enter a valid amount.');
    }
    setShowPin(true);
  };

  const handlePinSuccess = async () => {
    setGiftLoading(true);
    try {
      let fileUrl = '';
      if (giftFile && userProfile?.user_id) {
        const ext = giftFile.name.split('.').pop() || 'bin';
        const path = `${userProfile.user_id}/giftcard/${Date.now()}.${ext}`;
        const { error: storageError } = await supabase.storage
          .from('documents')
          .upload(path, giftFile, {
            upsert: true,
            contentType: giftFile.type || 'image/jpeg'
          });
        if (storageError) throw new Error(`Image upload failed: ${storageError.message}`);
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
        fileUrl = urlData.publicUrl;
        const { error: docError } = await supabase.from('documents').insert([
          {
            user_id: userProfile.user_id,
            doc_type: 'giftcard',
            file_url: fileUrl
          }
        ]);
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
          }
        ]);
        if (txError) throw new Error(`Transaction record failed: ${txError.message}`);
      }
      setGiftSuccess(true);
      setGiftForm({ type: 'amazon', amount: '', details: '' });
      setGiftFile(null);
      setTimeout(() => setGiftSuccess(false), 4000);
    } catch (err: any) {
      console.error('Gift card submission error:', err);
      setGiftError(err.message || 'Submission failed. Please try again.');
    } finally {
      setGiftLoading(false);
    }
  };

  const handleCashAppProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCashappMessage(null);
    const amount = parseFloat(cashappAmount);
    if (!cashappAmount || isNaN(amount) || amount <= 0) {
      setCashappMessage({ type: 'error', text: 'Please enter a valid amount greater than 0.' });
      return;
    }
    if (!cashappProofFile) {
      setCashappMessage({ type: 'error', text: 'Please upload proof of payment.' });
      return;
    }
    setCashappSubmitting(true);
    try {
      const ext = cashappProofFile.name.split('.').pop() || 'jpg';
      const path = `${userProfile?.user_id}/cashapp_proof/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, cashappProofFile, {
          upsert: true,
          contentType: cashappProofFile.type || 'image/jpeg'
        });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      await supabase.from('documents').insert({
        user_id: userProfile?.user_id,
        doc_type: 'cashapp_proof',
        file_url: publicUrl
      });
      await supabase.from('transactions').insert({
        user_id: userProfile?.user_id,
        type: 'received',
        amount,
        description: 'Cash App deposit – pending review',
        created_at: new Date().toISOString()
      });
      setCashappMessage({ type: 'success', text: 'Proof of payment submitted successfully! It will be reviewed shortly.' });
      setCashappAmount('');
      setCashappProofFile(null);
    } catch (err: any) {
      console.error('CashApp proof submission failed:', err);
      setCashappMessage({ type: 'error', text: err.message || 'Failed to submit proof. Please try again.' });
    } finally {
      setCashappSubmitting(false);
    }
  };

  const handleCryptoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCryptoMessage(null);

    const amount = parseFloat(cryptoAmount);
    if (!cryptoAmount || isNaN(amount) || amount <= 0) {
      setCryptoMessage({ type: 'error', text: 'Please enter a valid amount greater than 0.' });
      return;
    }
    if (!cryptoProofFile) {
      setCryptoMessage({ type: 'error', text: 'Please upload proof of payment (receipt).' });
      return;
    }
    if (!selectedWallet) return;

    setCryptoSubmitting(true);
    try {
      const ext = cryptoProofFile.name.split('.').pop() || 'jpg';
      const path = `${userProfile?.user_id}/crypto_proof/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(path, cryptoProofFile, {
          upsert: true,
          contentType: cryptoProofFile.type || 'image/jpeg'
        });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      await supabase.from('documents').insert({
        user_id: userProfile?.user_id,
        doc_type: 'crypto_proof',
        file_url: publicUrl,
      });

      await supabase.from('transactions').insert({
        user_id: userProfile?.user_id,
        type: 'received',
        amount,
        description: `Crypto Deposit (${selectedWallet.name}) – Pending Review`,
        created_at: new Date().toISOString()
      });

      setCryptoMessage({ 
        type: 'success', 
        text: 'Your crypto deposit is submitted for review. This would take 2-5 minutes.' 
      });
      setCryptoAmount('');
      setCryptoProofFile(null);
      // Do NOT close overlay automatically - let user read the message
    } catch (err: any) {
      console.error('Crypto deposit submission failed:', err);
      setCryptoMessage({ type: 'error', text: err.message || 'Failed to submit. Please try again.' });
    } finally {
      setCryptoSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => onNavigate('dashboard')}
          className="mb-6 pl-0 hover:bg-transparent hover:text-brand-orange"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-serif font-bold text-white mb-8">Add Funds</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { key: 'bank', icon: Landmark, label: 'Bank Transfer' },
            { key: 'crypto', icon: Bitcoin, label: 'Crypto Deposit' },
            { key: 'gift', icon: Gift, label: 'Gift Card' },
            { key: 'cashapp', icon: DollarSign, label: 'Cash App' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`p-6 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                activeTab === key
                  ? 'bg-gradient-brand border-transparent text-white shadow-lg'
                  : 'glass-card hover:bg-white/10 text-gray-300'
              }`}
            >
              <Icon className="h-8 w-8" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <Card className="min-h-[400px] relative">
          {/* BANK TRANSFER */}
          {activeTab === 'bank' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-2">Receive via Bank Transfer</h2>
              <p className="text-gray-400 text-sm">
                Share these details to receive money from another bank account.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Name</p>
                  <p className="text-white font-medium">{userProfile?.full_name || '—'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Name</p>
                  <p className="text-white font-medium">{userProfile?.bank_name || 'Bank Vercel'}</p>
                </div>
                {[
                  { label: 'Account Number', value: userProfile?.account_number, key: 'acc' },
                  { label: 'Routing Number', value: userProfile?.routing_number, key: 'rout' }
                ].map(({ label, value, key }) => (
                  <div key={key} className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-white font-mono font-medium">{value || '—'}</p>
                      <button
                        onClick={() => copyToClipboard(value || '', key)}
                        className="text-gray-400 hover:text-brand-orange transition-colors ml-2"
                      >
                        {copiedKey === key ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CRYPTO */}
          {activeTab === 'crypto' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-2">Deposit Cryptocurrency</h2>
              <p className="text-gray-400 text-sm">
                Select a cryptocurrency, send funds, then submit proof for review.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cryptoWallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => setSelectedWallet(wallet)}
                    className="bg-gradient-brand text-white font-medium rounded-xl py-4 px-6 text-center transition-all hover:brightness-110 hover:scale-[1.03] active:scale-95 shadow-md"
                  >
                    {wallet.name}
                  </button>
                ))}
              </div>

              {selectedWallet && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
                    <button
                      onClick={() => {
                        setSelectedWallet(null);
                        setCryptoMessage(null);
                        setCryptoAmount('');
                        setCryptoProofFile(null);
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                      <X className="h-6 w-6" />
                    </button>

                    <div className="p-6 space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-1">{selectedWallet.name}</h3>
                        <p className="text-gray-400 text-sm">Send funds to this address</p>
                      </div>

                      <div className="bg-black/40 p-4 rounded-xl text-center border border-gray-700">
                        <p className="text-xs text-gray-500 mb-2">Wallet Address</p>
                        <p className="text-sm font-mono break-all text-gray-200 mb-3">
                          {selectedWallet.address}
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(selectedWallet.address, selectedWallet.name)}
                        >
                          {copiedKey === selectedWallet.name ? 'Copied!' : 'Copy Address'}
                        </Button>
                      </div>

                      <div className="flex justify-center">
                        <img
                          src={`/qrcodes/${selectedWallet.name}.JPG`}
                          alt={`QR Code for ${selectedWallet.name}`}
                          className="w-48 h-48 object-contain bg-white p-2 rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/qrcodes/placeholder.jpg';
                          }}
                        />
                      </div>

                      <form onSubmit={handleCryptoSubmit} className="space-y-6">
                        {cryptoMessage ? (
                          <div
                            className={`p-5 rounded-xl text-center border ${
                              cryptoMessage.type === 'success'
                                ? 'bg-green-900/30 border-green-600 text-green-300'
                                : 'bg-red-900/30 border-red-600 text-red-300'
                            }`}
                          >
                            {cryptoMessage.type === 'success' ? (
                              <>
                                <Check className="inline h-5 w-5 mr-2 mb-1" />
                                <p className="font-medium text-lg">{cryptoMessage.text}</p>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="inline h-5 w-5 mr-2 mb-1" />
                                <p className="font-medium">{cryptoMessage.text}</p>
                              </>
                            )}
                          </div>
                        ) : null}

                        {(!cryptoMessage || cryptoMessage.type === 'error') && (
                          <>
                            <Input
                              label="Amount You Sent (USD equivalent)"
                              type="number"
                              placeholder="150.00"
                              min="1"
                              step="0.01"
                              value={cryptoAmount}
                              onChange={(e) => setCryptoAmount(e.target.value)}
                              disabled={cryptoSubmitting}
                            />

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Upload Transaction Receipt / Proof
                              </label>
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                ref={cryptoFileInputRef}
                                className="hidden"
                                onChange={(e) => setCryptoProofFile(e.target.files?.[0] || null)}
                                disabled={cryptoSubmitting}
                              />
                              <button
                                type="button"
                                onClick={() => cryptoFileInputRef.current?.click()}
                                disabled={cryptoSubmitting}
                                className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                  cryptoProofFile
                                    ? 'border-green-600 bg-green-950/30'
                                    : 'border-gray-600 hover:border-gray-400 hover:bg-white/5'
                                }`}
                              >
                                {cryptoProofFile ? (
                                  <div className="space-y-2">
                                    <Check className="mx-auto h-7 w-7 text-green-400" />
                                    <p className="text-sm text-green-300 break-all font-medium">
                                      {cryptoProofFile.name}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <Upload className="mx-auto h-7 w-7 text-gray-400" />
                                    <p className="text-sm text-gray-400">Click to upload screenshot / receipt</p>
                                    <p className="text-xs text-gray-500">(jpg, png, pdf)</p>
                                  </div>
                                )}
                              </button>
                            </div>

                            <Button
                              type="submit"
                              className="w-full bg-gradient-brand hover:brightness-110 hover:scale-[1.02] transition-all"
                              isLoading={cryptoSubmitting}
                              disabled={cryptoSubmitting}
                            >
                              Submit for Review
                            </Button>
                          </>
                        )}

                        {cryptoMessage?.type === 'success' && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              setSelectedWallet(null);
                              setCryptoMessage(null);
                              setCryptoAmount('');
                              setCryptoProofFile(null);
                            }}
                          >
                            Close
                          </Button>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GIFT CARD */}
          {activeTab === 'gift' && (
            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Redeem Gift Card</h2>
                <p className="text-gray-400 text-sm">
                  Submit your gift card details for review and credit to your account.
                </p>
              </div>
              {giftSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Gift card submitted for review!
                </div>
              )}
              {giftError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {giftError}
                </div>
              )}
              <form onSubmit={initiateGiftSubmit} className="space-y-6">
                <Select
                  label="Gift Card Type"
                  value={giftForm.type}
                  onChange={(e) => setGiftForm({ ...giftForm, type: e.target.value })}
                  options={[
                    { value: 'amazon', label: 'Amazon' },
                    { value: 'apple', label: 'Apple / iTunes' },
                    { value: 'google', label: 'Google Play' },
                    { value: 'steam', label: 'Steam' },
                    { value: 'vanilla', label: 'Vanilla Visa' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
                <Input
                  label="Amount ($)"
                  type="number"
                  placeholder="100.00"
                  min="1"
                  step="0.01"
                  value={giftForm.amount}
                  onChange={(e) => setGiftForm({ ...giftForm, amount: e.target.value })}
                  required
                />
                <Input
                  label="Card Code / Additional Details"
                  placeholder="Enter card code or details"
                  value={giftForm.details}
                  onChange={(e) => setGiftForm({ ...giftForm, details: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5 text-center">
                    Upload Card Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={giftFileRef}
                    className="hidden"
                    onChange={(e) => setGiftFile(e.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    onClick={() => giftFileRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      giftFile
                        ? 'border-green-500/40 bg-green-500/10'
                        : 'border-white/20 hover:bg-white/5 hover:border-white/30'
                    }`}
                  >
                    {giftFile ? (
                      <>
                        <Check className="h-6 w-6 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 text-sm font-medium">{giftFile.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Click to upload front and back of card</p>
                      </>
                    )}
                  </button>
                </div>
                <Button type="submit" className="w-full" isLoading={giftLoading}>
                  Submit for Review
                </Button>
              </form>
            </div>
          )}

          {/* CASH APP */}
          {activeTab === 'cashapp' && (
            <div className="space-y-8 max-w-md mx-auto">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">Deposit via Cash App</h2>
                <p className="text-gray-400 text-sm mt-2">
                  Send funds to the cashtag below, then upload proof of payment.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1 text-center">Cashtag</p>
                  {loadingTag ? (
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading...
                    </div>
                  ) : cashappError ? (
                    <p className="text-red-400 text-lg">{cashappError}</p>
                  ) : (
                    <p className="text-2xl font-bold text-cashapp-green break-all text-center">
                      {cashappTag}
                    </p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => copyToClipboard(cashappTag, 'cashapp')}
                  disabled={loadingTag || !!cashappError || !cashappTag}
                >
                  {copiedKey === 'cashapp' ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Cashtag
                    </>
                  )}
                </Button>
                <div className="text-xs text-gray-500 text-center">
                  Seamless, real-time processing Cash App payment.
                </div>
              </div>
              <form onSubmit={handleCashAppProofSubmit} className="space-y-6">
                {cashappMessage && (
                  <div
                    className={`p-4 rounded-lg text-sm text-center ${
                      cashappMessage.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}
                  >
                    {cashappMessage.type === 'success' ? (
                      <Check className="inline h-4 w-4 mr-2" />
                    ) : (
                      <AlertTriangle className="inline h-4 w-4 mr-2" />
                    )}
                    {cashappMessage.text}
                  </div>
                )}
                <Input
                  label="Amount Sent ($)"
                  type="number"
                  placeholder="50.00"
                  min="1"
                  step="0.01"
                  value={cashappAmount}
                  onChange={(e) => setCashappAmount(e.target.value)}
                  disabled={cashappSubmitting}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Proof of Payment
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    ref={cashappFileInputRef}
                    className="hidden"
                    onChange={(e) => setCashappProofFile(e.target.files?.[0] || null)}
                    disabled={cashappSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => cashappFileInputRef.current?.click()}
                    disabled={cashappSubmitting}
                    className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      cashappProofFile
                        ? 'border-green-500/50 bg-green-900/10'
                        : 'border-gray-600 hover:border-gray-400 hover:bg-white/5'
                    }`}
                  >
                    {cashappProofFile ? (
                      <div className="space-y-3">
                        <Check className="mx-auto h-7 w-7 text-green-400" />
                        <p className="text-sm text-green-300 break-all font-medium">
                          {cashappProofFile.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="mx-auto h-7 w-7 text-gray-400" />
                        <p className="text-sm text-gray-400">
                          Click to upload screenshot or receipt
                        </p>
                        <p className="text-xs text-gray-500">(jpg, png, pdf)</p>
                      </div>
                    )}
                  </button>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={cashappSubmitting}
                  disabled={cashappSubmitting}
                >
                  Submit Proof
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>

      <PinModal
        isOpen={showPin}
        onClose={() => setShowPin(false)}
        onSuccess={handlePinSuccess}
        userId={userProfile?.user_id}
      />
    </div>
  );
}
