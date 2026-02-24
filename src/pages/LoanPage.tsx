import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ActionSuccessModal } from '../components/ActionSuccessModal';
import { PinModal } from '../components/PinModal';
import { DollarSign, Clock, Percent, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
interface LoanPageProps {
  onNavigate: (page: string) => void;
}
export function LoanPage({ onNavigate }: LoanPageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'personal',
    amount: '',
    duration: '12'
  });
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);
  const loanTypes = [
  {
    value: 'personal',
    label: 'Personal Loan (APR 5.99%)'
  },
  {
    value: 'business',
    label: 'Business Loan (APR 4.50%)'
  },
  {
    value: 'mortgage',
    label: 'Mortgage (APR 3.25%)'
  },
  {
    value: 'auto',
    label: 'Auto Loan (APR 4.00%)'
  }];

  const durations = [
  {
    value: '6',
    label: '6 Months'
  },
  {
    value: '12',
    label: '12 Months'
  },
  {
    value: '24',
    label: '24 Months'
  },
  {
    value: '36',
    label: '36 Months'
  },
  {
    value: '48',
    label: '48 Months'
  },
  {
    value: '60',
    label: '60 Months'
  }];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPin(true);
  };
  const handlePinSuccess = () => {
    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="mb-4 pl-0">

            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-serif font-bold text-white">
            Apply for a Loan
          </h1>
          <p className="text-gray-400 mt-2">
            Fast approval, competitive rates, and flexible repayment terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
          {
            icon: DollarSign,
            label: 'Up to $50k',
            sub: 'Instant Approval'
          },
          {
            icon: Percent,
            label: 'Low Rates',
            sub: 'From 3.25% APR'
          },
          {
            icon: Clock,
            label: 'Fast Funding',
            sub: 'Within 24 hours'
          }].
          map((item, i) =>
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">

              <div className="p-3 bg-brand-orange/10 rounded-full text-brand-orange">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-white">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            </div>
          )}
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Loan Type"
              name="type"
              options={loanTypes}
              value={formData.type}
              onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value
              })
              } />


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Loan Amount ($)"
                type="number"
                placeholder="5000"
                min="100"
                required
                value={formData.amount}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value
                })
                } />

              <Select
                label="Repayment Duration"
                name="duration"
                options={durations}
                value={formData.duration}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: e.target.value
                })
                } />

            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-200">
                By clicking submit, you agree to a soft credit check which will
                not affect your credit score.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Application
            </Button>
          </form>
        </Card>
      </div>

      <PinModal
        isOpen={showPin}
        onClose={() => setShowPin(false)}
        onSuccess={handlePinSuccess}
        userId={userId || ''} />


      <ActionSuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onNavigate('dashboard');
        }}
        title="Loan Under Review"
        message="Your loan application has been received and is currently under review. We will notify you once a decision has been made." />

    </div>);

}