import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  Smartphone,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface SubscriptionUpgradeModalProps {
  planCode: 'basic' | 'premium';
  onClose: () => void;
}

export const SubscriptionUpgradeModal: React.FC<SubscriptionUpgradeModalProps> = ({
  planCode,
  onClose,
}) => {
  const { requestSubscriptionUpgrade, subscriptionPlans } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Awash Bank Transfer'>('Telebirr');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const plan = subscriptionPlans.find(p => p.planCode === planCode) || subscriptionPlans[1];
  const price = plan.priceETB;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await requestSubscriptionUpgrade(planCode, paymentMethod, transactionRef || `TX-${Date.now()}`);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-white">Upgrade Membership Plan</h2>
              <span className="text-xs text-slate-400">
                {plan.name} · {price.toLocaleString()} ETB / Month
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-800">
          {/* Plan Highlights */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900 text-sm">{plan.name}</span>
              <span className="font-mono font-bold text-teal-800 text-base">{price.toLocaleString()} ETB</span>
            </div>
            <p className="text-teal-800 text-[11px] leading-relaxed">{plan.tagline}</p>
            <ul className="space-y-1 pt-1 text-[11px] text-teal-900">
              {plan.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Method Selector (Ethiopian Rail) */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">
              Select Payment Channel (Ethiopia)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Telebirr')}
                className={`p-2.5 rounded border text-center transition-all cursor-pointer ${paymentMethod === 'Telebirr' ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                <span>Telebirr</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CBE Birr')}
                className={`p-2.5 rounded border text-center transition-all cursor-pointer ${paymentMethod === 'CBE Birr' ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                <Building className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                <span>CBE Birr</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Awash Bank Transfer')}
                className={`p-2.5 rounded border text-center transition-all cursor-pointer ${paymentMethod === 'Awash Bank Transfer' ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                <Building className="w-4 h-4 mx-auto mb-1 text-teal-600" />
                <span>Awash Bank</span>
              </button>
            </div>
          </div>

          {/* Account Details for Payment */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800 block">Transfer Instructions:</span>
            {paymentMethod === 'Telebirr' && (
              <p>Send <strong>{price.toLocaleString()} ETB</strong> to Telebirr Merchant Till: <strong>882910 (TenderLink Ethiopia)</strong></p>
            )}
            {paymentMethod === 'CBE Birr' && (
              <p>Transfer <strong>{price.toLocaleString()} ETB</strong> to CBE Account: <strong>1000234892819</strong> (TenderLink Enterprise)</p>
            )}
            {paymentMethod === 'Awash Bank Transfer' && (
              <p>Transfer <strong>{price.toLocaleString()} ETB</strong> to Awash Bank: <strong>01320489920100</strong> (TenderLink Enterprise)</p>
            )}
            <p className="text-slate-500">Enter the transaction reference code or SMS confirmation number below.</p>
          </div>

          {/* Transaction Reference Input */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Transaction Reference / Receipt Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TLB-93821948 or CBE-TRX-2026-881"
              value={transactionRef}
              onChange={e => setTransactionRef(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 font-mono text-xs bg-white"
            />
          </div>

          {/* Verification Protocol Notice */}
          <div className="p-2.5 bg-slate-100 rounded text-[11px] text-slate-600 border border-slate-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Backend Verification Protocol:</strong> In compliance with security standards, subscriptions are activated after administrator transaction audit. A pending status will appear in your billing dashboard immediately.
            </span>
          </div>

          {isSubmitted ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Payment reference submitted! Verification underway by finance team.</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !transactionRef}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer disabled:opacity-40 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>
                {isSubmitting ? 'Submitting Verification...' : `Submit Payment for ${price.toLocaleString()} ETB`}
              </span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
