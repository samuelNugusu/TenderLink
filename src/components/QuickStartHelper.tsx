import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  X,
  Search,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface QuickStartHelperProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  openRegisterModal: () => void;
}

export const QuickStartHelper: React.FC<QuickStartHelperProps> = ({
  setCurrentTab,
  openSimulator,
  openRegisterModal,
}) => {
  const { lang, activeRole, switchDemoPersona } = useApp();
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer shadow-2xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
          <span>{lang === 'am' ? 'የመድረኩ አጠቃቀም መመሪያ (3 ደረጃዎች)' : 'New to TenderLink? Quick 3-Step Guide'}</span>
          <ChevronDown className="w-3 h-3 text-teal-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="bg-white rounded-xl border border-teal-200 shadow-sm overflow-hidden text-xs">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="font-bold text-xs">
              {lang === 'am'
                ? 'እንኳን ወደ ቴንደርሊንክ ኢትዮጵያ በደህና መጡ! በ3 ቀላል ደረጃዎች ይጀምሩ:'
                : 'How TenderLink Ethiopia Works — 3 Simple Steps for Furniture Workshops'}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-300 hover:text-white p-1 rounded cursor-pointer"
            title="Minimize guide"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Step Cards */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-teal-50/30">
          {/* Step 1 */}
          <div
            onClick={() => setCurrentTab('tenders')}
            className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-bold flex items-center justify-center text-xs">
                1
              </span>
              <span className="text-[11px] font-semibold text-teal-700 group-hover:underline flex items-center gap-1">
                Browse Tenders <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              {lang === 'am' ? '1. ክፍት ጨረታዎችን ያግኙ' : '1. Discover Big Tenders'}
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {lang === 'am'
                ? 'የትምህርት ሚኒስቴር፣ የኢትዮጵያ ንግድ ባንክ እና የጤና ቢሮ ያወጧቸውን የዕቃዎች ጨረታዎች በቀላሉ ይመልከቱ።'
                : 'Find high-volume institutional contracts (e.g. 600 MoE school desks, 120 CBE teller cubicles) that individual small workshops cannot fulfill alone.'}
            </p>
          </div>

          {/* Step 2 */}
          <div
            onClick={openSimulator}
            className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-bold flex items-center justify-center text-xs">
                2
              </span>
              <span className="text-[11px] font-semibold text-teal-700 group-hover:underline flex items-center gap-1">
                Try Simulator <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              {lang === 'am' ? '2. አቅምዎን ከሌሎች ጋር ያጣምሩ' : '2. Pool Capacity in a Consortium'}
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {lang === 'am'
                ? 'የተለያዩ አውደ-ጥናቶች አቅማቸውን በማዋሃድ 100% የጨረታውን ብዛት ያሟላሉ (ለምሳሌ የብረት መዋቅር፣ የሲኤንሲ አጨራረስ እና የእንጨት ማገጣጠም)።'
                : 'Team up with vetted workshops across Ethiopia. Steel fabricators build tubular frames, joinery specialists finish desktops, and timber partners assemble.'}
            </p>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setCurrentTab('consortiums')}
            className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-2xs space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-bold flex items-center justify-center text-xs">
                3
              </span>
              <span className="text-[11px] font-semibold text-teal-700 group-hover:underline flex items-center gap-1">
                View Workspace <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              {lang === 'am' ? '3. በጋራ ያሸንፉ እና ያካፍሉ' : '3. Submit Joint Bid & Share Revenue'}
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {lang === 'am'
                ? 'ህጋዊ የጋራ ሰነድ በማዘጋጀት ይጫረቱ፤ ውሉ ሲሸነፍ ክፍያና ስራውን በፍትሃዊነት በኢትዮጵያ ብር ይከፋፈሉ።'
                : 'Share bank CPO bonds, compile joint licenses, sign mutual consent, and track transparent payments in Ethiopian Birr.'}
            </p>
          </div>
        </div>

        {/* Quick Demo Switcher Bar */}
        <div className="px-3 sm:px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-slate-600">
            <span className="font-semibold text-slate-800">Quick Test Persona:</span>
            <button
              onClick={() => switchDemoPersona('basic')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${activeRole === 'basic' ? 'bg-teal-700 text-white font-bold' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
              Regional Workshop
            </button>
            <button
              onClick={() => switchDemoPersona('premium')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${activeRole === 'premium' ? 'bg-teal-700 text-white font-bold' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
              Precision Manufacturer
            </button>
            <button
              onClick={() => switchDemoPersona('admin')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${activeRole === 'admin' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
              Administrator
            </button>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            Dismiss Guide
          </button>
        </div>
      </div>
    </div>
  );
};
