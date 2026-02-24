import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ActionSuccessModal } from '../components/ActionSuccessModal';
import { PinModal } from '../components/PinModal';
import { supabase } from '../lib/supabase';
import {
  Bitcoin,
  TrendingUp,
  BarChart2,
  Globe,
  ShieldCheck,
  Zap,
  CheckCircle,
  ArrowRight } from
'lucide-react';
interface InvestmentCryptoPageProps {
  onNavigate: (page: string) => void;
}
export function InvestmentCryptoPage({
  onNavigate
}: InvestmentCryptoPageProps) {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);
  const services = [
  {
    icon: TrendingUp,
    title: 'Wealth Management',
    desc: 'Personalized investment strategies crafted by our expert advisors to grow and protect your wealth.',
    features: [
    'Personalized portfolios',
    'Tax optimization',
    'Rebalancing',
    'Dedicated advisor']

  },
  {
    icon: BarChart2,
    title: 'Equity & Bonds',
    desc: 'Access global equity markets and fixed income instruments with competitive pricing and research.',
    features: [
    'Global equities',
    'Corporate bonds',
    'Government securities',
    'ETFs & mutual funds']

  },
  {
    icon: Bitcoin,
    title: 'Crypto Management',
    desc: 'Buy, sell, hold, and earn on digital assets with institutional-grade security and custody.',
    features: [
    '10+ cryptocurrencies',
    'Cold storage custody',
    'Staking rewards',
    'DeFi access']

  },
  {
    icon: Globe,
    title: 'International Investing',
    desc: 'Diversify globally with access to international markets, ADRs, and foreign currency accounts.',
    features: [
    '150+ markets',
    'Multi-currency accounts',
    'ADR trading',
    'Emerging markets']

  },
  {
    icon: ShieldCheck,
    title: 'Retirement Planning',
    desc: 'Secure your future with IRA accounts, 401(k) rollovers, and long-term investment planning.',
    features: [
    'Traditional & Roth IRA',
    '401(k) rollover',
    'Pension planning',
    'Social Security optimization']

  },
  {
    icon: Zap,
    title: 'Corporate Investment Banking',
    desc: 'Capital markets, M&A advisory, and structured finance solutions for corporations.',
    features: [
    'IPO underwriting',
    'M&A advisory',
    'Debt capital markets',
    'Structured products']

  }];

  const cryptos = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$64,231.45',
    color: 'text-yellow-400'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,452.12',
    color: 'text-blue-400'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$145.67',
    color: 'text-purple-400'
  },
  {
    name: 'BNB',
    symbol: 'BNB',
    price: '$589.30',
    color: 'text-yellow-300'
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    price: '$1.00',
    color: 'text-green-400'
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    price: '$0.62',
    color: 'text-blue-300'
  }];

  const handleInvest = () => {
    if (!amount || !selectedCoin) return;
    setShowPin(true);
  };
  const handlePinSuccess = () => {
    setShowSuccess(true);
  };
  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-magenta/20 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="mb-4 pl-0">

              ← Back to Dashboard
            </Button>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300 mb-6">
              Investment & Cryptocurrency
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Invest in the{' '}
              <span className="text-gradient">Future of Finance</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From traditional equities to cutting-edge digital assets, Bank
              Vercel offers a unified platform for all your investment needs.
            </p>
          </div>
        </div>
      </section>

      {/* Crypto Tickers & Investment */}
      <section className="py-8 bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">Live Market</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cryptos.map((c) =>
                <button
                  key={c.symbol}
                  onClick={() => setSelectedCoin(c.symbol)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedCoin === c.symbol ? 'bg-white/10 border-brand-orange' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>

                    <div className="flex items-center gap-3">
                      <Bitcoin className={`h-8 w-8 ${c.color}`} />
                      <div className="text-left">
                        <p className="text-white font-bold">{c.symbol}</p>
                        <p className="text-gray-400 text-xs">{c.name}</p>
                      </div>
                    </div>
                    <span className="text-white font-mono">{c.price}</span>
                  </button>
                )}
              </div>
            </div>

            <Card title="Quick Invest">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Selected Asset
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white">
                    {selectedCoin ?
                    `${selectedCoin} - ${cryptos.find((c) => c.symbol === selectedCoin)?.name}` :
                    'Select a coin from the list'}
                  </div>
                </div>

                <Input
                  label="Investment Amount ($)"
                  type="number"
                  placeholder="0.00"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!selectedCoin} />


                <Button
                  className="w-full"
                  onClick={handleInvest}
                  disabled={!selectedCoin || !amount}>

                  Invest Now
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Minimum investment amount is $10.00
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              Investment & Crypto Services
            </h2>
            <p className="text-gray-400">
              Traditional and digital asset management under one roof.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) =>
            <Card key={i} className="flex flex-col">
                <div className="h-11 w-11 rounded-lg bg-gradient-brand flex items-center justify-center mb-5">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f, fi) =>
                <li
                  key={fi}
                  className="flex items-center gap-2 text-sm text-gray-300">

                      <CheckCircle className="h-4 w-4 text-brand-orange flex-shrink-0" />
                      {f}
                    </li>
                )}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </section>

      <PinModal
        isOpen={showPin}
        onClose={() => setShowPin(false)}
        onSuccess={handlePinSuccess}
        userId={userId || ''} />


      <ActionSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setAmount('');
          setSelectedCoin(null);
        }}
        title="Investment Pending"
        message={`Your investment of $${amount} in ${selectedCoin} is currently pending processing. You will be notified once completed.`} />

    </div>);

}