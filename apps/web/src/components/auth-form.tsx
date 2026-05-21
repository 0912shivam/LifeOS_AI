"use client";

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { login, signup } from '../lib/api';
import { Card } from './ui/card';

type Mode = 'login' | 'signup';

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Check if already logged in and redirect
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('lifeos-token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    try {
      // Call the actual auth API
      const result = mode === 'login' ? await login(email, password) : await signup(name, email, password);

      // Validate response has required fields
      if (!result || !result.token || !result.user) {
        throw new Error('Invalid auth response from server');
      }

      // Store token and user data
      localStorage.setItem('lifeos-token', result.token);
      localStorage.setItem('lifeos-user', JSON.stringify(result.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (submitError) {
      const errorMessage = submitError instanceof Error ? submitError.message : 'Authentication failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-xl">
      <Card className="space-y-6 p-8 md:p-10">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-300">LifeOS AI</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-slate-400">Manage goals, habits, money, and study plans from one system.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input name="name" placeholder="Full name" required className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-brand-400" />
          )}
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-brand-400" />
          <input name="password" type="password" placeholder="Password" minLength={8} required className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-brand-400" />

          {error ? <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-slate-400">
          {mode === 'login' ? 'Having trouble? Check that the API URL is set in Vercel.' : 'Already have an account? Go to login.'}
        </p>
      </Card>
    </motion.div>
  );
}