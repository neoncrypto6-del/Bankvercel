import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Building2,
  Globe,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  BarChart2,
  CheckCircle,
  ArrowRight } from
'lucide-react';
interface CommercialPageProps {
  onNavigate: (page: string) => void;
}
export function CommercialPage({ onNavigate }: CommercialPageProps) {
  const services = [
  {
    icon: Building2,
    title: 'Commercial Real Estate',
    desc: 'Finance commercial properties with competitive rates and flexible structures for acquisition, development, and refinancing.',
    features: [
    'Up to $50M financing',
    'Construction loans',
    'Bridge financing',
    'Portfolio loans']

  },
  {
    icon: DollarSign,
    title: 'Commercial Lending',
    desc: 'Customized credit facilities including term loans, revolving credit, and asset-based lending.',
    features: [
    'Term loans',
    'Revolving credit',
    'Asset-based lending',
    'Equipment financing']

  },
  {
    icon: Globe,
    title: 'Trade Finance',
    desc: 'Comprehensive trade finance solutions including letters of credit, documentary collections, and supply chain finance.',
    features: [
    'Letters of credit',
    'Documentary collections',
    'Supply chain finance',
    'Export financing']

  },
  {
    icon: TrendingUp,
    title: 'Treasury Management',
    desc: 'Optimize your cash flow, manage liquidity, and maximize returns on your working capital.',
    features: [
    'Cash pooling',
    'Liquidity management',
    'FX hedging',
    'Interest rate management']

  },
  {
    icon: BarChart2,
    title: 'Commercial Deposits',
    desc: 'Tailored deposit solutions for large organizations with complex cash management needs.',
    features: [
    'Sweep accounts',
    'Money market funds',
    'Time deposits',
    'Escrow services']

  },
  {
    icon: ShieldCheck,
    title: 'Risk Management',
    desc: 'Protect your business from financial risks with our comprehensive suite of hedging and insurance products.',
    features: [
    'Interest rate hedging',
    'FX risk management',
    'Commodity hedging',
    'Credit insurance']

  }];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-red/15 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300 mb-6">
              Commercial Banking
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Powering <span className="text-gradient">Commercial Success</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Bank Vercel's commercial banking division delivers sophisticated
              financial solutions for mid-market and large corporations, with
              dedicated relationship managers and deep industry expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => onNavigate('signup')}>
                Get Started
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('contact')}>

                Contact a Relationship Manager
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              Commercial Banking Services
            </h2>
            <p className="text-gray-400">
              Sophisticated solutions for complex commercial needs.
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

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand"></div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Partner with Bank Vercel Commercial
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Our dedicated commercial banking team is ready to structure the
              right solutions for your organization's unique needs.
            </p>
            <Button size="lg" onClick={() => onNavigate('contact')}>
              Contact Our Team <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>);

}