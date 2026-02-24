import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ActionSuccessModal } from '../components/ActionSuccessModal';
import { PinModal } from '../components/PinModal';
import { Zap, Droplets, Wifi, Phone, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
interface BillsPageProps {
  onNavigate: (page: string) => void;
}
export function BillsPage({ onNavigate }: BillsPageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    biller: 'electricity',
    billNumber: '',
    amount: ''
  });
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);
  const billers = [
  {
    value: 'electricity',
    label: 'Electricity (PowerCo)'
  },
  {
    value: 'water',
    label: 'Water Utility'
  },
  {
    value: 'internet',
    label: 'Internet Service (FiberNet)'
  },
  {
    value: 'phone',
    label: 'Mobile Phone (CellularOne)'
  },
  {
    value: 'cable',
    label: 'Cable TV'
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
            Pay Bills
          </h1>
          <p className="text-gray-400 mt-2">
            Securely pay your utilities and services instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
          {
            icon: Zap,
            label: 'Electricity',
            color: 'text-yellow-400'
          },
          {
            icon: Droplets,
            label: 'Water',
            color: 'text-blue-400'
          },
          {
            icon: Wifi,
            label: 'Internet',
            color: 'text-purple-400'
          },
          {
            icon: Phone,
            label: 'Phone',
            color: 'text-green-400'
          }].
          map((item, i) =>
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">

              <item.icon className={`h-8 w-8 ${item.color}`} />
              <span className="text-sm font-medium text-gray-300">
                {item.label}
              </span>
            </div>
          )}
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Select Biller"
              name="biller"
              options={billers}
              value={formData.biller}
              onChange={(e) =>
              setFormData({
                ...formData,
                biller: e.target.value
              })
              } />


            <Input
              label="Bill / Account Number"
              placeholder="1234567890"
              required
              value={formData.billNumber}
              onChange={(e) =>
              setFormData({
                ...formData,
                billNumber: e.target.value
              })
              } />


            <Input
              label="Amount ($)"
              type="number"
              placeholder="0.00"
              min="1"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value
              })
              } />


            <Button type="submit" size="lg" className="w-full">
              <CreditCard className="mr-2 h-5 w-5" /> Pay Bill
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
        title="Bill Paid Successfully"
        message={`Your payment of $${formData.amount} to ${billers.find((b) => b.value === formData.biller)?.label} has been processed.`} />

    </div>);

}