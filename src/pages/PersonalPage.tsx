import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Landmark,
  CreditCard,
  Home,
  Car,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  CheckCircle } from
'lucide-react';
interface PersonalPageProps {
  onNavigate: (page: string) => void;
}
export function PersonalPage({ onNavigate }: PersonalPageProps) {
  const products = [
  {
    icon: Landmark,
    title: 'Checking Account',
    desc: 'Everyday banking with zero monthly fees, unlimited transactions, and instant access to your funds.',
    features: [
    'No monthly fees',
    'Free debit card',
    'Instant transfers',
    'Mobile check deposit']

  },
  {
    icon: Landmark,
    title: 'Savings Account',
    desc: 'Grow your money with competitive interest rates and FDIC-insured deposits up to $250,000.',
    features: [
    'High-yield APY',
    'FDIC insured',
    'Auto-save rules',
    'No minimum balance']

  },
  {
    icon: CreditCard,
    title: 'Credit Cards',
    desc: 'Premium rewards cards with exclusive benefits, travel perks, and cashback on every purchase.',
    features: [
    'Up to 5% cashback',
    'No foreign fees',
    'Travel insurance',
    'Fraud protection']

  },
  {
    icon: Home,
    title: 'Home Loans',
    desc: 'Competitive mortgage rates for first-time buyers and refinancing with flexible terms.',
    features: [
    'Rates from 3.5%',
    '15 & 30-year terms',
    'Fast approval',
    'No prepayment penalty']

  },
  {
    icon: Car,
    title: 'Auto Loans',
    desc: 'Finance your next vehicle with low rates and flexible repayment options.',
    features: [
    'Rates from 4.9%',
    'Up to 84 months',
    'New & used vehicles',
    'Pre-approval available']

  },
  {
    icon: GraduationCap,
    title: 'Personal Loans',
    desc: 'Flexible personal loans for any purpose — debt consolidation, home improvement, or emergencies.',
    features: [
    'Up to $100,000',
    'Fixed rates',
    'No collateral needed',
    'Same-day funding']

  }];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-magenta/15 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300 mb-6">
              Personal Banking
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Banking Built <span className="text-gradient">For You</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From everyday checking to home loans, Bank Vercel offers a
              complete suite of personal banking products designed to help you
              achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => onNavigate('signup')}>
                Open an Account
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('contact')}>

                Talk to an Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              Personal Banking Products
            </h2>
            <p className="text-gray-400">
              Everything you need for your personal financial life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) =>
            <Card key={i} className="flex flex-col">
                <div className="h-11 w-11 rounded-lg bg-gradient-brand flex items-center justify-center mb-5">
                  <product.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {product.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 flex-1">
                  {product.desc}
                </p>
                <ul className="space-y-2">
                  {product.features.map((f, fi) =>
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

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand"></div>
            <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-brand-orange" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Your money is safe with us
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              All deposits are FDIC insured up to $250,000. We use 256-bit
              encryption and multi-factor authentication to keep your account
              secure.
            </p>
            <Button size="lg" onClick={() => onNavigate('signup')}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>);

}