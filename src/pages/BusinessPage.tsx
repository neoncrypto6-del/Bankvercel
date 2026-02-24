import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Briefcase,
  CreditCard,
  TrendingUp,
  Users,
  Globe,
  ShieldCheck,
  CheckCircle,
  ArrowRight } from
'lucide-react';
interface BusinessPageProps {
  onNavigate: (page: string) => void;
}
export function BusinessPage({ onNavigate }: BusinessPageProps) {
  const solutions = [
  {
    icon: Briefcase,
    title: 'Business Checking',
    desc: 'Manage your day-to-day business finances with a dedicated checking account built for growth.',
    features: [
    'Unlimited transactions',
    'Multiple signatories',
    'ACH payments',
    'Payroll integration']

  },
  {
    icon: TrendingUp,
    title: 'Business Savings',
    desc: 'Put your business reserves to work with competitive rates and flexible access.',
    features: [
    'Competitive APY',
    'No lock-in period',
    'Automatic sweeps',
    'FDIC insured']

  },
  {
    icon: CreditCard,
    title: 'Business Credit Cards',
    desc: 'Empower your team with business credit cards that offer rewards and expense management.',
    features: [
    'Employee cards',
    'Expense tracking',
    'Cashback rewards',
    'Fraud alerts']

  },
  {
    icon: Users,
    title: 'Payroll Services',
    desc: 'Streamline payroll processing with direct deposit, tax filing, and compliance tools.',
    features: [
    'Direct deposit',
    'Tax compliance',
    'Benefits management',
    '24/7 support']

  },
  {
    icon: Globe,
    title: 'International Payments',
    desc: 'Send and receive payments globally with competitive FX rates and fast settlement.',
    features: [
    '150+ currencies',
    'Real-time rates',
    'SWIFT transfers',
    'Trade finance']

  },
  {
    icon: ShieldCheck,
    title: 'Business Loans',
    desc: 'Fuel your growth with flexible business loans, lines of credit, and SBA-backed financing.',
    features: [
    'Up to $5M',
    'Flexible terms',
    'Fast approval',
    'No prepayment fees']

  }];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/15 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300 mb-6">
              Business Banking
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Banking That <span className="text-gradient">Grows With You</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From startups to established enterprises, Bank Vercel provides the
              financial tools and expertise to help your business thrive in
              today's competitive landscape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => onNavigate('signup')}>
                Open Business Account
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('contact')}>

                Speak to a Specialist
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              Business Banking Solutions
            </h2>
            <p className="text-gray-400">
              Comprehensive financial services for businesses of all sizes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s, i) =>
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

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand"></div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Ready to take your business further?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of businesses that trust Bank Vercel for their
              financial operations. Get started in minutes.
            </p>
            <Button size="lg" onClick={() => onNavigate('signup')}>
              Open Business Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>);

}