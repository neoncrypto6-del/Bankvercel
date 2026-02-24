import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  Briefcase,
  ShieldCheck,
  Users,
  FileText,
  TrendingUp,
  Globe,
  CheckCircle,
  ArrowRight } from
'lucide-react';
interface InheritancePageProps {
  onNavigate: (page: string) => void;
}
export function InheritancePage({ onNavigate }: InheritancePageProps) {
  const services = [
  {
    icon: Briefcase,
    title: 'Estate Planning',
    desc: 'Comprehensive estate planning services to ensure your assets are distributed according to your wishes.',
    features: [
    'Will preparation',
    'Trust creation',
    'Beneficiary designation',
    'Power of attorney']

  },
  {
    icon: ShieldCheck,
    title: 'Trust Management',
    desc: 'Professional trust administration with fiduciary oversight and transparent reporting.',
    features: [
    'Revocable trusts',
    'Irrevocable trusts',
    'Charitable trusts',
    'Special needs trusts']

  },
  {
    icon: TrendingUp,
    title: 'Wealth Preservation',
    desc: 'Strategies to protect and grow inherited wealth across generations with tax efficiency.',
    features: [
    'Tax minimization',
    'Asset protection',
    'Generational transfer',
    'Inflation hedging']

  },
  {
    icon: Users,
    title: 'Family Office Services',
    desc: 'Dedicated family office solutions for high-net-worth families managing complex financial affairs.',
    features: [
    'Consolidated reporting',
    'Family governance',
    'Philanthropy management',
    'Next-gen education']

  },
  {
    icon: FileText,
    title: 'Inheritance Administration',
    desc: 'Expert guidance through the probate process and inheritance administration to minimize delays.',
    features: [
    'Probate assistance',
    'Asset inventory',
    'Debt settlement',
    'Distribution management']

  },
  {
    icon: Globe,
    title: 'International Estate Planning',
    desc: 'Cross-border estate planning for families with assets and beneficiaries in multiple countries.',
    features: [
    'Multi-jurisdiction planning',
    'Treaty optimization',
    'Foreign asset reporting',
    'Repatriation strategies']

  }];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-orange/15 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300 mb-6">
              Inheritance & Estate Management
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Secure Your <span className="text-gradient">Legacy</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Bank Vercel's inheritance and estate management services help you
              plan, protect, and transfer wealth across generations with expert
              guidance, legal precision, and compassionate service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => onNavigate('signup')}>
                Get Started
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('contact')}>

                Speak to an Estate Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
            {
              value: '$2.4B+',
              label: 'Assets Under Management'
            },
            {
              value: '15,000+',
              label: 'Families Served'
            },
            {
              value: '98%',
              label: 'Client Satisfaction'
            },
            {
              value: '25+',
              label: 'Years of Experience'
            }].
            map((stat, i) =>
            <div key={i}>
                <p className="text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              Inheritance Management Services
            </h2>
            <p className="text-gray-400">
              Protecting and growing wealth for generations to come.
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
              Start planning your legacy today
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              It's never too early to plan. Our estate advisors are ready to
              help you create a comprehensive plan that reflects your values and
              protects your loved ones.
            </p>
            <Button size="lg" onClick={() => onNavigate('contact')}>
              Schedule a Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>);

}