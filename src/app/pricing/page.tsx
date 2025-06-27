"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useUser } from '@/hooks/useUser';
import CheckoutForm from '@/components/modals/CheckoutForm';
import LoginRequiredModal from '@/components/common/modals/LoginRequiredModal';
import { useToast } from '@/components/common/Toast';
import { Button } from '@/components/ui/button';
import type { User } from '@supabase/supabase-js';

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const supabase = createClient();
  const { loading } = useUser();
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    async function checkLogin() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkLogin();
  }, [supabase]);

  // Handle login redirect
  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    window.location.href = `/login?next=${encodeURIComponent('/pricing')}`;
  };

  // Handle modal close
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  // 处理一次性积分包支付（使用 Stripe 嵌入式表单）
  const handleCreditPackPayment = async (priceId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);

    } catch (error) {
      console.error('Checkout Error:', error);
      showToast('Failed to create payment session. Please try again later.', 'error');
    }
  };

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);

    } catch (error) {
      console.error('Checkout Error:', error);
      showToast('Failed to create payment session. Please try again later.', 'error');
    }
  };

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '$19.9',
      priceSuffix: '/month',
      description: 'Perfect for individual creators getting started',
      features: [
        '200 credits/month',
        'No watermark output',
        'Standard avatar templates',
        'Email support',
        'Credits never expire',
      ],
      stripePriceId: 'price_1RZn4rFNBa78cTTjEJyy5TwC', // PRODUCTION - Starter Plan
      highlight: false,
      cta: 'Get Starter Plan',
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '$49.9',
      priceSuffix: '/month',
      description: 'For content creators who need more videos',
      features: [
        '550 credits/month',
        '+50 bonus credits (10% extra)',
        'Priority processing queue',
        'Advanced avatar customization',
        'Online customer support',
      ],
      stripePriceId: 'price_1RZn4rFNBa78cTTjahUceCMh', // PRODUCTION - Pro Plan
      highlight: true,
      cta: 'Get Pro Plan',
    },
    {
      id: 'creator',
      name: 'Creator Plan',
      price: '$99.9',
      priceSuffix: '/month',
      description: 'For professional creators and small studios',
      features: [
        '1200 credits/month',
        '+200 bonus credits (20% extra)',
        'Commercial use license',
        'Premium avatar collection',
        'Custom requirements support',
      ],
      stripePriceId: 'price_1RZn4rFNBa78cTTj1XGO6Dz4', // PRODUCTION - Creator Plan
      highlight: false,
      cta: 'Get Creator Plan',
    },
  ];

  const creditPacks = [
    {
      name: 'Small Pack',
      credits: 50,
      price: '5.9',
      stripePriceId: 'price_1RZn69FNBa78cTTjYHoJ5uxB', // PRODUCTION - Small Pack
      description: 'Perfect for testing or occasional use',
      cta: 'Get Small Pack'
    },
    {
      name: 'Medium Pack',
      credits: 150,
      price: '16.9',
      stripePriceId: 'price_1RZn69FNBa78cTTjHYbouqh5', // PRODUCTION - Medium Pack
      description: 'Great for regular content creation',
      cta: 'Get Medium Pack',
      highlight: true
    },
    {
      name: 'Large Pack',
      credits: 400,
      price: '39.9',
      stripePriceId: 'price_1RZn69FNBa78cTTjhMOa9UIR', // PRODUCTION - Large Pack
      description: 'Best value for high-volume creators',
      cta: 'Get Large Pack'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              VOGUE AI Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Create personalized AI images&videos with our credit-based system.
              <br />
              Choose your plan or buy credits as needed.
            </p>
          </div>

          {/* Subscription Plans - NEW UI */}
          <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mb-20">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl p-6 flex flex-col border transition-all duration-300 relative bg-gray-800 ${
                  plan.highlight
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-700'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-center mb-2 text-white">{plan.name}</h3>
                  <p className="text-gray-400 text-center mb-6 text-sm leading-relaxed">{plan.description}</p>
                  
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-lg">{plan.priceSuffix}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-green-400 mr-3 mt-0.5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <Button
                    onClick={() => handleCheckout(plan.stripePriceId)}
                    disabled={!!processingPayment}
                    className={`w-full text-sm font-medium py-3 px-4 rounded-lg transition-colors ${
                      plan.highlight
                        ? 'bg-blue-600 hover:bg-blue-700 text-white border-0'
                        : 'bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {processingPayment === plan.id ? 'Processing...' : plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Credit Packs Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Buy Credits On-Demand
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Need extra credits? Purchase additional credits. Credits never expire.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mb-20">
            {creditPacks.map((pack, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-xl border p-8 text-center flex flex-col justify-between transition-all duration-300 min-h-[320px] ${
                  pack.highlight ? 'border-blue-500 shadow-lg' : 'border-gray-700'
                }`}
              >
                <div>
                  {pack.highlight && (
                    <div className="mb-4">
                      <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Best Value
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-semibold text-white mb-4">{pack.name}</h3>
                  <p className="text-gray-400 mb-6 text-base leading-relaxed">{pack.description}</p>

                  <div className="mb-8">
                    <div className="text-4xl font-bold text-white mb-2">${pack.price}</div>
                    <div className="text-lg text-gray-300">{pack.credits} credits</div>
                  </div>
                </div>

                <Button
                  onClick={() => handleCreditPackPayment(pack.stripePriceId)}
                  disabled={!!processingPayment}
                  className={`w-full text-base font-medium py-4 px-6 rounded-lg transition-colors ${
                    pack.highlight
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-0'
                      : 'bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {pack.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* How Credits Work Section */}
          <div className="mt-20 w-full max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-600/50 shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">How Credits Work</h3>
              <div className="grid md:grid-cols-3 gap-16">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎬</span>
                  </div>
                  <h4 className="font-semibold text-white mb-4 text-xl">Model-Based Pricing</h4>
                  <p className="text-gray-300 text-base leading-relaxed">Credits consumed vary by different model</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">♾️</span>
                  </div>
                  <h4 className="font-semibold text-white mb-4 text-xl">Never Expire</h4>
                  <p className="text-gray-300 text-base leading-relaxed">Your credits roll over month to month</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎁</span>
                  </div>
                  <h4 className="font-semibold text-white mb-4 text-xl">Bonus Credits</h4>
                  <p className="text-gray-300 text-base leading-relaxed">Higher plans get extra credits as a bonus</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />

      {clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-2xl relative w-full max-w-2xl mx-4">
            <button
              onClick={() => setClientSecret(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-4">
              <CheckoutForm clientSecret={clientSecret} />
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginRequiredModal
          isOpen={showLoginModal}
          onClose={handleCloseLoginModal}
          onLogin={handleLoginRedirect}
        />
      )}

      <ToastContainer />
    </div>
  );
}