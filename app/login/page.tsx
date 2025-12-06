'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        window.location.href = '/dashboard';
      }
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return (
    <div className="min-h-screen h-screen overflow-hidden flex items-center justify-center relative overflow-hidden bg-black p-4 sm:p-6 md:p-8">
      {/* Background gradients */}
      <div className="absolute -top-40 -right-40 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute top-60 -left-40 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className="absolute bottom-20 right-1/3 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 space-y-5 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl sm:rounded-2xl mb-2 shadow-lg shadow-orange-500/50">
              {view === 'sign_in' ? (
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              {view === 'sign_in' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm px-2">
              {view === 'sign_in'
                ? 'Sign in to continue creating amazing content'
                : 'Join thousands of creators using AI-powered content'}
            </p>
          </div>

          {/* Supabase Auth UI */}
          <div className="supabase-auth-custom">
            <Auth
              supabaseClient={supabase}
              view={view}
              providers={[]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(249 115 22)',
                      brandAccent: 'rgb(236 72 153)',
                      brandButtonText: 'white',
                      defaultButtonBackground: 'transparent',
                      defaultButtonBackgroundHover: 'rgba(255, 255, 255, 0.05)',
                      defaultButtonBorder: 'rgba(255, 255, 255, 0.1)',
                      defaultButtonText: 'rgb(156 163 175)',
                      dividerBackground: 'rgba(255, 255, 255, 0.1)',
                      inputBackground: 'rgba(255, 255, 255, 0.05)',
                      inputBorder: 'rgba(255, 255, 255, 0.1)',
                      inputBorderHover: 'rgba(249, 115, 22, 0.5)',
                      inputBorderFocus: 'rgba(249, 115, 22, 0.5)',
                      inputText: 'white',
                      inputLabelText: 'rgb(209 213 219)',
                      inputPlaceholder: 'rgb(107 114 128)',
                      messageText: 'rgb(156 163 175)',
                      messageTextDanger: 'rgb(252 165 165)',
                      anchorTextColor: 'rgb(251 146 60)',
                      anchorTextHoverColor: 'rgb(236 72 153)',
                    },
                    radii: {
                      borderRadiusButton: '12px',
                      buttonBorderRadius: '12px',
                      inputBorderRadius: '12px',
                    },
                    space: {
                      inputPadding: '14px 20px',
                      buttonPadding: '14px 20px', 
                    }
                  },
                },
                className: {
                  container: 'space-y-4',
                  label: 'font-semibold !ml-1 !text-sm sm:!text-base',
                  button: 'font-semibold !transition-all !duration-200 !text-sm sm:!text-base',
                  input: '!transition-all !duration-200 !text-sm sm:!text-base',
                  anchor: '!font-semibold !text-xs sm:!text-sm',
                },
              }}
              localization={{
                variables: {
                  sign_in: { link_text: '' },
                  sign_up: { link_text: '' },
                  magic_link: { link_text: '' },
                  forgotten_password: { link_text: '' },
                },
              }}
            />
          </div>

          {/* Custom Toggle Links */}
          <div className="text-center pt-3 sm:pt-4 border-t border-white/10">
            {view === 'sign_in' ? (
              <p className="text-gray-400 text-xs sm:text-sm">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setView('sign_up')}
                  className="text-orange-400 hover:text-pink-500 font-semibold transition-colors cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-400 text-xs sm:text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setView('sign_in')}
                  className="text-orange-400 hover:text-pink-500 font-semibold transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Back to home */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Primary button styling - gradient */
        .supabase-auth-custom button[type='submit'] {
          background: linear-gradient(to right, rgb(249 115 22), rgb(236 72 153)) !important;
          box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.5) !important;
          border: none !important;
          font-weight: 600 !important;
          min-height: 44px !important;
        }

        .supabase-auth-custom button[type='submit']:hover {
          background: linear-gradient(to right, rgb(234 88 12), rgb(219 39 119)) !important;
          box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.7) !important;
          transform: translateY(-2px);
        }

        /* Input fields */
        .supabase-auth-custom input {
          min-height: 44px !important;
        }

        .supabase-auth-custom input:focus {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1) !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        /* Hide the default auth links so we can use our custom ones */
        .supabase-auth-custom a {
          display: none !important;
        }

        /* Responsive font sizes for mobile */
        @media (max-width: 640px) {
          .supabase-auth-custom input {
            font-size: 14px !important;
          }
          
          .supabase-auth-custom button {
            font-size: 14px !important;
          }
          
          .supabase-auth-custom label {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
}