import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface LegalPageProps {
  initialSection?: 'terms' | 'privacy' | 'contact';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialSection = 'terms' }) => {
  const [section, setSection] = useState<'terms' | 'privacy' | 'contact'>(initialSection);
  const [contactSent, setContactSent] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Tab Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setSection('terms')}
          className={`px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors ${section === 'terms' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Terms of Service & Joint Bidding
        </button>
        <button
          onClick={() => setSection('privacy')}
          className={`px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors ${section === 'privacy' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setSection('contact')}
          className={`px-4 py-2 font-medium rounded-lg cursor-pointer transition-colors ${section === 'contact' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          Contact & Workshop Support
        </button>
      </div>

      {section === 'terms' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">
              Platform Terms of Service & Consortium Governance Constitution
            </h1>
            <p className="text-slate-500">
              Governing use of TenderLink Ethiopia for Ethiopian furniture manufacturing enterprises and craftsmen clusters.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Mandatory Operational & Commercial Disclaimer</span>
            </div>
            <p>
              TenderLink Ethiopia facilitates consortium matching, capacity verification, and joint proposal coordination. <strong>TenderLink Ethiopia never guarantees that any consortium or individual workshop will win a tender, that a public or commercial contract will be awarded, or that buyer payments will be received.</strong>
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">1. Affirmative Consent for Joint Bidding</h2>
            <p>
              No workshop may be committed to a joint bidding consortium or allocated a contract parcel without explicit, recorded affirmative consent. Workshops reserve the right to review proposed unit pricing, delivery schedules, and assigned quotas before committing.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">2. Legal Independence & Bank Guarantees (CPO)</h2>
            <p>
              Participating workshops remain distinct legal entities. Where procurement directives mandate a bid security bond (Cash Payment Order - CPO) or performance bank guarantee, such financial instruments must be secured through authorized Ethiopian commercial banks in accordance with procurement law. TenderLink Ethiopia is not a banking guarantor.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">3. Verification & Compliance Standards</h2>
            <p>
              All declared workshop capabilities, including worker counts, machinery rosters, and monthly unit outputs, are subject to physical administrative inspection across regional workshops and manufacturing facilities throughout Ethiopia. False declarations will result in profile suspension.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">4. Transparent Subscription Entitlements</h2>
            <p>
              Subscription fees for Basic (1,200 ETB) and Premium (3,500 ETB) tiers fund operational verification and priority matching queues. Subscription tier never overrides mandatory tender qualifications, technical specifications, or buyer requirements.
            </p>
          </div>
        </div>
      )}

      {section === 'privacy' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Privacy & Workshop Data Protection Policy</h1>
            <p className="text-slate-500">
              How business information, capacity records, and bidding documentation are safeguarded.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">1. Separation of Public and Confidential Records</h2>
            <p>
              Public tender listings and verified historical awards are openly visible. In contrast, workshop tax clearances, internal cost margin sheets, and private consortium draft proposals are encrypted and restricted solely to verified consortium members and authorized administrators.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">2. No Commercial Scraping or Unauthorized Disclosures</h2>
            <p>
              Workshop phone numbers, owner contact records, and tax identifiers are protected against third-party marketing brokers. Data is used exclusively for legitimate institutional tender verification and consortium coordination within Ethiopia.
            </p>
          </div>
        </div>
      )}

      {section === 'contact' && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-700">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Contact & Workshop Support Center</h1>
            <p className="text-slate-500">
              Reach the TenderLink Ethiopia administrative desk for workshop verification, cluster coordination, or tender inquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <Phone className="w-4 h-4 text-teal-700" />
              <strong className="block text-slate-900">Telephone Hotline</strong>
              <p className="text-slate-600">+251 911 234 567</p>
              <p className="text-[11px] text-slate-400">Mon - Sat, 8:30 AM - 5:30 PM (EAT)</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <Mail className="w-4 h-4 text-teal-700" />
              <strong className="block text-slate-900">Official Email</strong>
              <p className="text-slate-600">support@tenderlinkethiopia.com</p>
              <p className="text-[11px] text-slate-400">Prompt responses within 24 hours</p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <MapPin className="w-4 h-4 text-teal-700" />
              <strong className="block text-slate-900">National Field Desk</strong>
              <p className="text-slate-600">National Coordination Center</p>
              <p className="text-[11px] text-slate-400">Addis Ababa & Regional Centers, Ethiopia</p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Send a Direct Operational Inquiry</h3>
            {contactSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your message has been routed to the national workshop coordination team.</span>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setContactSent(true);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name / Workshop Name"
                    className="px-3 py-2 border border-slate-300 rounded bg-white text-xs"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (+251 ...)"
                    className="px-3 py-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="How can we assist your workshop with tender verification or consortium formation?"
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs cursor-pointer shadow-sm"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
