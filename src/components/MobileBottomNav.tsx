import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  FileText,
  Users,
  Calendar,
  Building2,
  ShieldCheck,
  Calculator,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  openSimulator,
}) => {
  const { activeRole, lang } = useApp();

  const isWorkshop = activeRole === 'basic' || activeRole === 'premium';
  const isAdmin = activeRole === 'admin';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 pt-1 pb-[calc(0.35rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-xl">
      <button
        type="button"
        onClick={() => setCurrentTab('home')}
        className={`flex-1 min-w-0 max-w-[68px] flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-colors cursor-pointer ${
          currentTab === 'home' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Compass className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span className="text-[10px] mt-0.5 truncate w-full text-center">
          {lang === 'am' ? 'ዋና' : 'Home'}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setCurrentTab('tenders')}
        className={`flex-1 min-w-0 max-w-[68px] flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-colors cursor-pointer ${
          currentTab === 'tenders' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span className="text-[10px] mt-0.5 truncate w-full text-center">
          {lang === 'am' ? 'ጨረታ' : 'Tenders'}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setCurrentTab('consortiums')}
        className={`flex-1 min-w-0 max-w-[68px] flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-colors cursor-pointer ${
          currentTab === 'consortiums' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Users className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span className="text-[10px] mt-0.5 truncate w-full text-center">
          {lang === 'am' ? 'ማህበር' : 'Consortia'}
        </span>
      </button>

      {/* Floating Center Simulator Button */}
      <button
        type="button"
        onClick={openSimulator}
        className="flex flex-col items-center justify-center -mt-4 p-2.5 rounded-full bg-slate-900 text-teal-400 shadow-md hover:bg-slate-800 transition-colors cursor-pointer border-2 border-white shrink-0 active:scale-95"
        title="Joint Bidding & CPO Simulator"
      >
        <Calculator className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => setCurrentTab('calendar')}
        className={`flex-1 min-w-0 max-w-[68px] flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-colors cursor-pointer ${
          currentTab === 'calendar' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span className="text-[10px] mt-0.5 truncate w-full text-center">
          {lang === 'am' ? 'ቀን' : 'Calendar'}
        </span>
      </button>

      {isWorkshop && (
        <button
          type="button"
          onClick={() => setCurrentTab('dashboard')}
          className={`flex-1 min-w-0 max-w-[68px] flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-[10px] mt-0.5 truncate w-full text-center">
            {lang === 'am' ? 'ስራ ቦታ' : 'Workspace'}
          </span>
        </button>
      )}

      {isAdmin && (
        <button
          type="button"
          onClick={() => setCurrentTab('admin')}
          className={`flex-1 min-w-0 max-w-[68px] flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'admin' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-[10px] mt-0.5 truncate w-full text-center">
            {lang === 'am' ? 'አስተዳዳሪ' : 'Admin'}
          </span>
        </button>
      )}
    </nav>
  );
};
