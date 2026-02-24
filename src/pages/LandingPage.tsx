import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  CreditCard,
  Landmark,
  Briefcase,
  GraduationCap,
  Bitcoin,
  Home,
  Car,
  TrendingUp,
  ShieldCheck,
  Globe,
  Zap,
  Building2,
  Users,
  DollarSign } from
'lucide-react';
interface LandingPageProps {
  onNavigate: (page: string) => void;
}
export function LandingPage({ onNavigate }: LandingPageProps) {
  const services = [
  {
    icon: Landmark,
    title: 'Checking & Savings',
    desc: 'High-yield accounts with no hidden fees.'
  },
  {
    icon: CreditCard,
    title: 'Credit Cards',
    desc: 'Premium rewards and exclusive benefits.'
  },
  {
    icon: Briefcase,
    title: 'Inheritance Management',
    desc: 'Secure your legacy for generations.'
  },
  {
    icon: Bitcoin,
    title: 'Crypto Management',
    desc: 'Buy, sell, and hold digital assets securely.'
  },
  {
    icon: Home,
    title: 'Home Loans',
    desc: 'Competitive rates for your dream home.'
  },
  {
    icon: Car,
    title: 'Auto Loans',
    desc: 'Fast approval for your next vehicle.'
  },
  {
    icon: GraduationCap,
    title: 'Education & Tools',
    desc: 'Financial literacy for a better future.'
  },
  {
    icon: TrendingUp,
    title: 'Wealth Management',
    desc: 'Expert guidance for your portfolio.'
  },
  {
    icon: Building2,
    title: 'Corporate & Investment Banking',
    desc: 'Solutions for large-scale enterprises.'
  }];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-magenta/20 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Banking Reimagined for the{' '}
              <span className="text-gradient">Modern World</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the fusion of classic banking security and futuristic
              technology. Manage checking, savings, crypto, credit cards, and
              investments in one seamless banking system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => onNavigate('signup')}>
                Open an Account
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('contact')}>

                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Comprehensive Financial Solutions
            </h2>
            <p className="text-gray-400">
              Everything you need to manage your wealth in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) =>
            <Card
              key={index}
              className="hover:bg-white/10 transition-colors duration-300 group cursor-default">

                <div className="h-12 w-12 rounded-lg bg-gradient-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm">{service.desc}</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-orange/10 via-transparent to-transparent opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="mx-auto h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-brand-magenta" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Bank-Grade Security
              </h3>
              <p className="text-gray-400">
                Your assets are protected by state-of-the-art encryption and
                security protocols.
              </p>
            </div>
            <div>
              <div className="mx-auto h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-400">
                Instant transfers, real-time updates, and zero latency in your
                financial moves.
              </p>
            </div>
            <div>
              <div className="mx-auto h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-brand-orange" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Global Access
              </h3>
              <p className="text-gray-400">
                Access your funds and manage your portfolio from anywhere in the
                world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand"></div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              Ready to upgrade your banking experience?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have switched to Bank Vercel for a
              smarter, faster, and more secure financial future.
            </p>
            <Button size="lg" onClick={() => onNavigate('signup')}>
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>);

}