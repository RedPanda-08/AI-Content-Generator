'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setSuccess('Success! Please check your email to confirm your account.');
      
    } catch (error) {
        const err = error as {message: string};
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black p-4">
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-60 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl mb-2 shadow-lg shadow-orange-500/50">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm">Join thousands of creators using AI-powered content</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-orange-500/50 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-orange-500/50 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/10 transition-all duration-200 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">Must be at least 6 characters</p>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/70 focus:ring-4 focus:ring-orange-500/50 transform hover:-translate-y-0.5 transition-all duration-200 outline-none cursor-pointer"
            >
              Create Account
            </button>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-xl backdrop-blur-sm">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-xl backdrop-blur-sm">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-300 font-medium">{success}</p>
              </div>
            )}
          </form>

          <div className="pt-4 text-center border-t border-white/10">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-orange-400 hover:text-pink-400 transition-colors">
                Sign in
              </a>
            </p>
          </div>
          {/* Back to home */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
        </div>
      </div>
  );
}