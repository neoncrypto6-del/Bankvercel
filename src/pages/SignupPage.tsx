import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
interface SignupPageProps {
  onNavigate: (page: string) => void;
}
export function SignupPage({ onNavigate }: SignupPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    address: '',
    ssn: '',
    accountType: 'Checking'
  });
  const accountTypes = [
  {
    value: 'Checking',
    label: 'Checking Account'
  },
  {
    value: 'Savings',
    label: 'Savings Account'
  },
  {
    value: 'Credit Card',
    label: 'Credit Card'
  },
  {
    value: 'Inheritance',
    label: 'Inheritance Management'
  },
  {
    value: 'Loan',
    label: 'Loan Account'
  },
  {
    value: 'Investment',
    label: 'Investment Account'
  },
  {
    value: 'Corporate',
    label: 'Corporate Banking'
  },
  {
    value: 'Crypto',
    label: 'Crypto Management'
  }];

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');
      // 2. Generate Account Details
      const accountNumber = Math.floor(
        1000000000 + Math.random() * 9000000000
      ).toString();
      const routingNumber = '021000021';
      // 3. Create Profile Record
      const { error: profileError } = await supabase.from('profiles').insert([
      {
        user_id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        dob: formData.dob,
        address: formData.address,
        ssn: formData.ssn,
        account_type: formData.accountType,
        account_number: accountNumber,
        routing_number: routingNumber,
        balance: 0,
        is_verified: false,
        next_of_kin_verified: false,
        password: formData.password,
        notifications: [] // Initialize empty notifications array
      }]
      );
      if (profileError) {
        // Cleanup auth user if profile creation fails (optional but good practice)
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile. Please try again.');
      }
      // Success
      onNavigate('dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img
            src="/vbank.png"
            alt="Bank Vercel"
            className="h-12 w-auto mx-auto mb-4" />

          <h2 className="text-3xl font-serif font-bold text-white">
            Create your account
          </h2>
          <p className="text-gray-400 mt-2">Join Bank Vercel today</p>
        </div>

        {error &&
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        }

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={handleChange} />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={handleChange} />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              value={formData.phone}
              onChange={handleChange} />

            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              required
              value={formData.dob}
              onChange={handleChange} />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange} />

            <Input
              label="SSN"
              name="ssn"
              placeholder="XXX-XX-XXXX"
              required
              value={formData.ssn}
              onChange={handleChange} />

          </div>

          <Input
            label="Address"
            name="address"
            placeholder="123 Wall St, New York, NY 10005"
            required
            value={formData.address}
            onChange={handleChange} />


          <Select
            label="Account Type"
            name="accountType"
            options={accountTypes}
            value={formData.accountType}
            onChange={handleChange} />


          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}>

            Create Account
          </Button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-brand-orange hover:text-brand-red transition-colors font-medium">

              Log in
            </button>
          </p>
        </form>
      </Card>
    </div>);

}