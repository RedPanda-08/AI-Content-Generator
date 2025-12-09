'use client';

import { useState } from 'react';
import { Check, Zap, Shield, Crown, Loader2 } from 'lucide-react';
import { useSupabase } from '../../../components/SupabaseProvider'; 

interface SupabaseContextType {
  session?: {
    user?: {
      is_anonymous?: boolean;
    };
  };
}

export default function SubscriptionPage() {
  const { session } = (useSupabase() as unknown as SupabaseContextType) || {};
  const user = session?.user;
  const isGuest = user?.is_anonymous;
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleUpgrade = (tier: string) => {
    setLoadingTier(tier);
    setTimeout(() => {
      setLoadingTier(null);
      alert(`Redirecting to ${tier} checkout...`);
    }, 1500);
  };

  const tiers = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for trying out the AI.',
      features: [
        '3 Free Credits',
        'Basic Content Generation',
        'Standard Support',
        '1 Brand Voice Profile'
      ],
      current: isGuest,
      color: 'bg-zinc-900/80 border-zinc-800',
      btnColor: 'bg-zinc-800 hover:bg-zinc-700 text-white',
      icon: Zap
    },
    {
      name: 'Pro Creator',
      price: '$29',
      period: '/month',
      description: 'For serious content creators.',
      features: [
        '500 Credits / Month',
        'Advanced Analytics',
        'Platform-Specific Optimization',
        'Priority Support',
        'Unlimited Brand Voices'
      ],
      current: !isGuest && true,
      popular: true,
      color: 'bg-black border-orange-500 relative overflow-visible shadow-2xl shadow-orange-500/10',
      btnColor: 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg shadow-orange-500/25',
      icon: Crown
    },
    {
      name: 'Agency',
      price: '$99',
      period: '/month',
      description: 'For teams and high volume.',
      features: [
        '5,000 Credits / Month',
        'Team Collaboration',
        'API Access',
        'Dedicated Account Manager',
        'Custom AI Models'
      ],
      current: false,
      color: 'bg-zinc-900/80 border-zinc-800',
      btnColor: 'bg-zinc-800 hover:bg-zinc-700 text-white',
      icon: Shield
    }
  ];

  return (
    <div className="w-full min-h-[100svh] overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-22 pb-16 sm:pb-20 lg:pb-24 lg:py-10">
        <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">Choose Your Plan</h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto px-4">
            Unlock the full power of ContentAI. Upgrade anytime as your content needs grow.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 pt-9 sm:pt-10 px-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`
                rounded-2xl sm:rounded-3xl p-6 sm:p-8 border flex flex-col relative
                transition-all duration-300
                ${tier.color}
                ${
                  tier.popular
                    ? 'md:col-span-2 xl:col-span-1 xl:-translate-y-6 xl:scale-[1.05] z-20 md:order-first xl:order-none'
                    : 'hover:border-zinc-700'
                }
              `}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wider shadow-lg z-30">
                  Most Popular
                </div>
              )}

              {/* Icon + Title */}
              <div className="mb-6 sm:mb-8">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${
                    tier.popular ? 'bg-orange-500/10' : 'bg-zinc-800/50'
                  }`}
                >
                  <tier.icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      tier.popular ? 'text-orange-500' : 'text-zinc-400'
                    }`}
                  />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm min-h-[35px] sm:min-h-[40px]">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && <span className="text-sm sm:text-base text-zinc-500">{tier.period}</span>}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-300"
                  >
                    <Check
                      className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
                        tier.popular ? 'text-orange-500' : 'text-zinc-500'
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => handleUpgrade(tier.name)}
                disabled={tier.current || loadingTier === tier.name}
                className={`
                  w-full py-3 sm:py-4 rounded-xl font-semibold text-xs sm:text-sm transition-all
                  flex items-center justify-center gap-2 cursor-pointer
                  ${tier.btnColor}
                  ${tier.current ? 'opacity-50 cursor-default' : 'transform hover:scale-[1.02] active:scale-95'}
                `}
              >
                {loadingTier === tier.name ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : tier.current ? (
                  'Current Plan'
                ) : (
                  <>
                    <span className="hidden sm:inline">Upgrade to {tier.name}</span>
                    <span className="sm:hidden">Get {tier.name}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center border-t border-zinc-800 pt-8 sm:pt-12">
          <p className="text-zinc-500 text-xs sm:text-sm px-4">Secure payments powered by Stripe. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}