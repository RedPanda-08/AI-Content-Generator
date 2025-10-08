'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthConfirmed() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 p-4">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-br from-amber-300 to-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-150"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-100/50 p-12 space-y-6 transform transition-all duration-300">
          {/* Success Icon with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-in zoom-in duration-500">
                <svg className="w-12 h-12 text-white animate-in zoom-in duration-700 delay-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Ripple effect */}
              <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Email Confirmed!
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Thank you for confirming your email address. Your account is now fully activated and ready to use.
            </p>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-center space-y-3 pt-4 animate-in fade-in duration-500 delay-500">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">Redirecting to login in</span>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl shadow-lg shadow-orange-500/30">
              <span className="text-3xl font-bold text-white">{countdown}</span>
            </div>
          </div>

          {/* Manual navigation */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 focus:ring-4 focus:ring-orange-500/50 transform hover:-translate-y-0.5 transition-all duration-200 outline-none"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}