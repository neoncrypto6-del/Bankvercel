import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
interface LoginPageProps {
  onNavigate: (page: string) => void;
}
export function LoginPage({ onNavigate }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (authError) throw authError;
      // Auth state change will be caught by App.tsx listener
      // We can manually navigate or wait for the listener
      onNavigate('dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/vbank.png"
            alt="Bank Vercel"
            className="h-12 w-auto mx-auto mb-4" />

          <h2 className="text-3xl font-serif font-bold text-white">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-2">Securely access your portfolio</p>
        </div>

        {error &&
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        }

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={handleChange} />


          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange} />


          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}>

            Log In
          </Button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-brand-orange hover:text-brand-red transition-colors font-medium">

              Sign up
            </button>
          </p>
        </form>
      </Card>
    </div>);

}