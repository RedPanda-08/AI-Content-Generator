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
    // Simulate Stripe Checkout
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
    // FIX: Added 'w-full', 'overflow-x-hidden', and Global Styles to hide scrollbar
    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-10 pb-24 overflow-x-hidden">
      
      {/* Global Style to Hide Scrollbar */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Choose Your Plan</h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Unlock the full power of ContentAI. Upgrade anytime as your content needs grow.
        </p>
      </div>

      {/* Pricing Grid */}
      {/* Added padding-top (pt-10) to ensure the 'Most Popular' badge doesn't get clipped */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pt-10 px-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`
              rounded-3xl p-8 border flex flex-col relative
              transition-all duration-300
              ${tier.color}
              ${
                tier.popular
                  ? 'xl:-translate-y-6 xl:scale-[1.05] z-20 order-first xl:order-none'
                  : 'hover:border-zinc-700'
              }
            `}
          >
            {/* Popular Badge */}
            {tier.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg z-30">
                Most Popular
              </div>
            )}

            {/* Icon + Title */}
            <div className="mb-8">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  tier.popular ? 'bg-orange-500/10' : 'bg-zinc-800/50'
                }`}
              >
                <tier.icon
                  className={`w-6 h-6 ${
                    tier.popular ? 'text-orange-500' : 'text-zinc-400'
                  }`}
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-zinc-400 text-sm min-h-[40px]">{tier.description}</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-zinc-500">{tier.period}</span>}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-zinc-300"
                >
                  <Check
                    className={`w-5 h-5 flex-shrink-0 ${
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
                w-full py-4 rounded-xl font-semibold text-sm transition-all
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
                `Upgrade to ${tier.name}`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="mt-20 text-center border-t border-zinc-800 pt-12">
        <p className="text-zinc-500 text-sm">Secure payments powered by Stripe. Cancel anytime.</p>
      </div>
    </div>
  );
}