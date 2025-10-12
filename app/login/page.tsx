'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createPagesBrowserClient();

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

  // Redirect to dashboard on login
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black p-4">
      {/* Glowing Background Blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute top-60 -left-40 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>
      <div
        className="absolute bottom-20 right-1/3 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* Auth Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl mb-2 shadow-lg shadow-orange-500/50">
              {view === 'sign_in' ? (
                <svg
                  className="w-8 h-8 text-white"
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
                  className="w-8 h-8 text-white"
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              {view === 'sign_in' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-400 text-sm">
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
                    space: {
                      inputPadding: '14px 16px',
                      buttonPadding: '14px 16px',
                    },
                    fontSizes: {
                      baseBodySize: '14px',
                      baseInputSize: '15px',
                      baseLabelSize: '14px',
                      baseButtonSize: '15px',
                    },
                    fonts: {
                      bodyFontFamily: 'inherit',
                      buttonFontFamily: 'inherit',
                      inputFontFamily: 'inherit',
                      labelFontFamily: 'inherit',
                    },
                    radii: {
                      borderRadiusButton: '12px',
                      buttonBorderRadius: '12px',
                      inputBorderRadius: '12px',
                    },
                    borderWidths: {
                      buttonBorderWidth: '0px',
                      inputBorderWidth: '2px',
                    },
                  },
                },
                className: {
                  container: 'space-y-5',
                  label: 'font-semibold !ml-1',
                  button: 'font-semibold !transition-all !duration-200',
                  input: '!transition-all !duration-200',
                  anchor: '!font-semibold !text-sm',
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    link_text: '', 
                    email_label: 'Email Address',
                    password_label: 'Password',
                  },
                  sign_up: {
                    link_text: '', 
                    email_label: 'Email Address',
                    password_label: 'Password',
                  },
                  magic_link: { link_text: '' },
                  forgotten_password: { link_text: '' }, 
                },
              }}
            />
          </div>

          <div className="text-center pt-4 border-t border-white/10">
            {view === 'sign_in' ? (
              <p className="text-gray-400 text-sm">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setView('sign_up')}
                  className="text-orange-400 hover:text-pink-500 font-semibold transition-colors cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
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
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
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
        }
        
        .supabase-auth-custom button[type='submit']:hover {
          background: linear-gradient(to right, rgb(234 88 12), rgb(219 39 119)) !important;
          box-shadow: 0 20px 25px -5px rgba(249, 115, 22, 0.7) !important;
          transform: translateY(-2px);
        }
        
        .supabase-auth-custom button[type='submit']:focus {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.5), 0 10px 15px -3px rgba(249, 115, 22, 0.5) !important;
        }
        
        /* Input fields */
        .supabase-auth-custom input:focus {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1) !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Label styling */
        .supabase-auth-custom label {
          margin-left: 4px !important;
          color: rgb(209 213 219) !important;
        }
        
        /* Hide auth links */
        .supabase-auth-custom a {
          display: none !important;
        }
        
        /* Error messages */
        .supabase-auth-custom [role='alert'] {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.5) !important;
          border-radius: 12px !important;
          padding: 12px !important;
          color: rgb(252 165 165) !important;
        }
        
        /* Success messages */
        .supabase-auth-custom [role='status'] {
          background: rgba(34, 197, 94, 0.1) !important;
          border: 1px solid rgba(34, 197, 94, 0.5) !important;
          border-radius: 12px !important;
          padding: 12px !important;
          color: rgb(134 239 172) !important;
        }
      `}</style>
    </div>
  );
}