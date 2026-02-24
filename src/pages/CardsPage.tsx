import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Wifi, Copy, Eye, EyeOff } from 'lucide-react';
interface CardsPageProps {
  onNavigate: (page: string) => void;
  userProfile: any;
}
export function CardsPage({ onNavigate, userProfile }: CardsPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  // Generate deterministic random-looking numbers based on user ID or just random for demo
  const cardNumber = '4532 1234 5678 9012';
  const expiry = '12/28';
  const cvv = '345';
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
          <h1 className="text-3xl font-serif font-bold text-white">My Cards</h1>
          <p className="text-gray-400 mt-2">
            Manage your virtual and physical cards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Visual */}
          <div className="relative group perspective-1000">
            <div className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-magenta/20 rounded-full blur-3xl -ml-16 -mb-16"></div>

              {/* Card Content */}
              <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <img
                    src="/vbank.png"
                    alt="Bank Vercel"
                    className="h-8 w-auto opacity-80" />

                  <Wifi className="h-8 w-8 text-white/50 rotate-90" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-9 bg-yellow-500/20 rounded-md border border-yellow-500/30 flex items-center justify-center">
                      <div className="w-8 h-6 border border-yellow-500/50 rounded-sm"></div>
                    </div>
                    <Wifi className="h-6 w-6 text-white/50 rotate-90" />
                  </div>

                  <div className="font-mono text-xl md:text-2xl tracking-widest text-white text-shadow">
                    {showDetails ?
                    cardNumber :
                    '**** **** **** ' + cardNumber.slice(-4)}
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Card Holder
                      </p>
                      <p className="font-medium text-white tracking-wide uppercase">
                        {userProfile?.full_name || 'VALUED CUSTOMER'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Expires
                      </p>
                      <p className="font-mono text-white">{expiry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2">

                {showDetails ?
                <EyeOff className="h-4 w-4" /> :

                <Eye className="h-4 w-4" />
                }
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
          </div>

          {/* Card Actions */}
          <div className="space-y-6">
            <Card title="Card Details">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 bg-green-500/10 px-2 py-1 rounded text-xs font-bold uppercase">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white">Virtual Debit</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">CVV</span>
                  <span className="font-mono text-white">
                    {showDetails ? cvv : '***'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Daily Limit</span>
                  <span className="text-white">$5,000.00</span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Freeze Card
              </Button>
              <Button variant="outline" className="w-full">
                Replace Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}