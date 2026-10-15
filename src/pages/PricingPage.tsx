import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import {
  CheckCircle,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface PricingPageProps {
  onSelectPlanUpgrade: (planCode: 'basic' | 'premium') => void;
  openRegisterModal: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onSelectPlanUpgrade,
  openRegisterModal,
}) => {
  const { subscriptionPlans, activeRole } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-md text-teal-800 text-xs font-semibold">
          <span>ETHIOPIAN BIRR (ETB) TIERS</span>
          <span>·</span>
          <span>TRANSPARENT PILOT PRICING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Empowering Every Workshop to Bid and Scale
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          From free public discovery to priority matching for high-capacity clusters. All plans are transparent and designed for Ethiopian craftsmen and manufacturers.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {subscriptionPlans.map(plan => {
          const isPremium = plan.planCode === 'premium';
          const isBasic = plan.planCode === 'basic';
          const isFree = plan.planCode === 'free';
          const isCurrentActive = activeRole === plan.planCode;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all ${isPremium ? 'border-teal-500 bg-white shadow-xl relative ring-2 ring-teal-500/20' : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'}`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-teal-300 text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1.5 pt-2 border-t border-slate-100">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                    {plan.priceETB === 0 ? 'Free' : `${plan.priceETB.toLocaleString()}`}
                  </span>
                  {plan.priceETB > 0 && (
                    <span className="text-xs text-slate-500 font-medium">ETB / month</span>
                  )}
                </div>

                <ul className="space-y-3 pt-2 text-xs text-slate-700">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                {isCurrentActive ? (
                  <div className="w-full py-2.5 bg-teal-50 text-teal-800 text-center text-xs font-bold rounded-lg border border-teal-200">
                    Current Active Tier
                  </div>
                ) : isFree ? (
                  <button
                    onClick={openRegisterModal}
                    className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Start Free
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectPlanUpgrade(plan.planCode as 'basic' | 'premium')}
                    className={`w-full py-2.5 text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5 ${isPremium ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-teal-700 hover:bg-teal-800 text-white'}`}
                  >
                    <span>Upgrade to {plan.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparent Governance Rules */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4 max-w-4xl mx-auto text-xs text-slate-700">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Transparent Membership & Allocation Constitution</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 leading-relaxed">
          <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">1. Eligibility Precedes Priority</strong>
            <p>
              Premium status never overrides mandatory technical qualifications, buyer licensing requirements, or conflict of interest regulations. A workshop must meet all technical specs first.
            </p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">2. No Fabricated Win Probabilities</strong>
            <p>
              The platform never displays arbitrary or fabricated "win probability" percentages. Matches reflect tangible machinery availability, workforce capacity, and delivery logistics.
            </p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">3. First Right of Refusal Protocol</strong>
            <p>
              When a tender lot matches a premium workshop's audited capacity, they receive a time-bound window to accept or decline before the lot is offered to the broader pool.
            </p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">4. Local Payment Channels</strong>
            <p>
              Subscriptions are settled via Telebirr, CBE Birr, or commercial bank transfer with administrator audit verification. No hidden international card processing fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
