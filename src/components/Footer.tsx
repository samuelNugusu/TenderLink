import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform Vision */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-teal-500 text-slate-900 font-bold flex items-center justify-center text-sm">
                TL
              </div>
              <span className="font-bold text-white text-base">
                TenderLink <span className="text-teal-400 font-normal">Ethiopia</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering small, medium, and industrial furniture workshops across all regions of Ethiopia to discover institutional tenders, combine production capacity, and bid jointly with transparency.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Nationwide: Active Across All 12 Regions & Cities</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('tenders')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Published Tenders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('consortiums')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Joint Consortium Formations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('awards')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Historical Winning Bids
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('calendar')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Institutional Procurement Calendar
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Membership Plans (ETB)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Consortium Joint Bidding Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy & Data Protection Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Workshop Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Ethiopian Regulatory Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Compliance Notice
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/80 p-3 rounded border border-slate-700/60">
              <strong>Mandatory Disclosure:</strong> TenderLink Ethiopia is an operational collaboration tool and does not guarantee tender award, contract execution, or buyer disbursements. All financial tracking reflects declared milestone invoices. Regulated banking guarantees (CPO) remain between the issuing authority and registered commercial entities.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} TenderLink Ethiopia. Nationwide Platform for Ethiopian Craftsmen, Furniture Workshops & Manufacturers.
          </div>
          <div className="flex items-center gap-4">
            <span>Currency: Ethiopian Birr (ETB)</span>
            <span>·</span>
            <span>Local Time: Addis Ababa (EAT, UTC+3)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
