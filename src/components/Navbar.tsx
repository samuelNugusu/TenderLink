import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Building2,
  FileText,
  Calendar,
  Award,
  CreditCard,
  ShieldCheck,
  Briefcase,
  Users,
  ChevronDown,
  LogIn,
  LogOut,
  Database,
  Menu,
  X,
  CheckCircle,
  Bell,
  Calculator,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openRegisterModal: () => void;
  openSimulator: () => void;
  openNotificationDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openRegisterModal,
  openSimulator,
  openNotificationDrawer,
}) => {
  const {
    currentUser,
    activeRole,
    switchDemoPersona,
    logout,
    loginWithGoogle,
    seedDatabase,
    isLoading,
    notifications,
    lang,
    setLang,
    t,
  } = useApp();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [seedSuccessNotice, setSeedSuccessNotice] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSeed = async () => {
    await seedDatabase();
    setSeedSuccessNotice(true);
    setTimeout(() => setSeedSuccessNotice(false), 4000);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'premium':
        return 'Premium Workshop';
      case 'basic':
        return 'Basic Member';
      default:
        return 'Visitor';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice: Nationwide Platform */}
      <div className="bg-slate-900 text-slate-300 text-xs px-2.5 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0 max-w-full">
          <span className="inline-flex items-center gap-1 text-teal-400 font-semibold tracking-wide text-[11px] sm:text-xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            {lang === 'am' ? 'አገር-አቀፍ:' : 'NATIONWIDE:'}
          </span>
          <span className="truncate text-slate-300 text-[11px] sm:text-xs">
            {lang === 'am' ? 'በሁሉም የኢትዮጵያ ክልሎች የሚገኙ አውደ-ጥናቶች ትስስር' : 'Uniting Furniture Workshops Across All Regions of Ethiopia'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-slate-800 text-teal-300 hover:text-white border border-slate-700 transition-colors cursor-pointer active:scale-95"
            title="Toggle English / Amharic"
          >
            <Globe className="w-3 h-3 text-teal-400" />
            <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Seed demo data */}
          <button
            onClick={handleSeed}
            disabled={isLoading}
            className="text-xs text-teal-300 hover:text-white hidden sm:flex items-center gap-1 font-medium cursor-pointer transition-colors"
            title="Populate or reload Firestore with realistic Ethiopian tender & workshop records"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{seedSuccessNotice ? 'Data Seeded!' : 'Seed Demo Data'}</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Quick Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-1 text-slate-300 hover:text-white text-xs font-medium cursor-pointer active:scale-95"
            >
              <span>Role: <strong className="text-white">{getRoleLabel(activeRole)}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800">
                <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                <button
                  onClick={() => { switchDemoPersona('visitor'); setIsPersonaOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 cursor-pointer ${activeRole === 'visitor' ? 'bg-teal-50 text-teal-900 font-semibold' : ''}`}
                >
                  <span className="font-semibold">1. Visitor / General Public</span>
                  <span className="text-[11px] text-slate-500">Public tender search, awards, calendar</span>
                </button>
                <button
                  onClick={() => { switchDemoPersona('basic'); setIsPersonaOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 cursor-pointer ${activeRole === 'basic' ? 'bg-teal-50 text-teal-900 font-semibold' : ''}`}
                >
                  <span className="font-semibold">2. Regional Workshop (Wood & Metal)</span>
                  <span className="text-[11px] text-slate-500">Fabrication, capacity declaration, join bids</span>
                </button>
                <button
                  onClick={() => { switchDemoPersona('premium'); setIsPersonaOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 cursor-pointer ${activeRole === 'premium' ? 'bg-teal-50 text-teal-900 font-semibold' : ''}`}
                >
                  <span className="font-semibold">3. Precision Industrial Manufacturer</span>
                  <span className="text-[11px] text-slate-500">Priority matching, automated consortium builder</span>
                </button>
                <button
                  onClick={() => { switchDemoPersona('admin'); setIsPersonaOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-50 cursor-pointer ${activeRole === 'admin' ? 'bg-teal-50 text-teal-900 font-semibold' : ''}`}
                >
                  <span className="font-semibold">4. Administrator (Public Procurement)</span>
                  <span className="text-[11px] text-slate-500">Tender management, workshop verification, audit & reports</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400 font-bold text-lg shadow-sm group-hover:bg-teal-900 transition-colors shrink-0">
                TL
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  {lang === 'am' ? 'ቴንደርሊንክ' : 'TenderLink'} <span className="text-teal-600 font-normal">{lang === 'am' ? 'ኢትዮጵያ' : 'Ethiopia'}</span>
                </span>
                <span className="block text-[11px] text-slate-500 tracking-wide truncate max-w-[180px] sm:max-w-none">
                  {lang === 'am' ? 'የአውደ-ጥናት የጋራ ማህበር መድረክ' : 'Workshop Consortium Platform'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => setCurrentTab('tenders')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${currentTab === 'tenders' ? 'text-teal-700 font-semibold bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {t.navTenders}
            </button>
            <button
              onClick={() => setCurrentTab('consortiums')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${currentTab === 'consortiums' ? 'text-teal-700 font-semibold bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {t.navConsortiums}
            </button>
            <button
              onClick={() => setCurrentTab('awards')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${currentTab === 'awards' ? 'text-teal-700 font-semibold bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {t.navAwards}
            </button>
            <button
              onClick={() => setCurrentTab('calendar')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${currentTab === 'calendar' ? 'text-teal-700 font-semibold bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {t.navCalendar}
            </button>
            <button
              onClick={() => setCurrentTab('pricing')}
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${currentTab === 'pricing' ? 'text-teal-700 font-semibold bg-slate-100' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {t.navPricing}
            </button>

            {/* Joint Bidding Simulator Button */}
            <button
              onClick={openSimulator}
              className="ml-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Interactive Joint Bidding & CPO Calculator"
            >
              <Calculator className="w-3.5 h-3.5 text-teal-700" />
              <span>{t.simulatorButton}</span>
            </button>

            {/* Role-Specific Nav Portals */}
            {(activeRole === 'basic' || activeRole === 'premium') && (
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`ml-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${currentTab === 'dashboard' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'}`}
              >
                {t.navDashboard}
              </button>
            )}

            {activeRole === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`ml-2 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${currentTab === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
              >
                {t.navAdmin}
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell with Badge */}
            <button
              onClick={openNotificationDrawer}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              title="View Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                    {currentUser.displayName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {getRoleLabel(activeRole)}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={loginWithGoogle}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                >
                  {t.signIn}
                </button>
                <button
                  onClick={openRegisterModal}
                  className="px-3.5 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-md cursor-pointer shadow-sm transition-colors shrink-0"
                >
                  {t.registerWorkshop}
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => { setCurrentTab('tenders'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.navTenders}
          </button>
          <button
            onClick={() => { setCurrentTab('consortiums'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.navConsortiums}
          </button>
          <button
            onClick={() => { setCurrentTab('awards'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.navAwards}
          </button>
          <button
            onClick={() => { setCurrentTab('calendar'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.navCalendar}
          </button>
          <button
            onClick={() => { setCurrentTab('pricing'); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.navPricing}
          </button>

          <button
            onClick={() => { openSimulator(); setIsMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-teal-800 bg-teal-50 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-teal-700" />
            <span>{t.simulatorTitle}</span>
          </button>

          {(activeRole === 'basic' || activeRole === 'premium') && (
            <button
              onClick={() => { setCurrentTab('dashboard'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-teal-50 text-teal-800"
            >
              {t.navDashboard}
            </button>
          )}

          {activeRole === 'admin' && (
            <button
              onClick={() => { setCurrentTab('admin'); setIsMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-slate-900 text-white"
            >
              {t.navAdmin}
            </button>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!currentUser ? (
              <>
                <button
                  onClick={() => { openRegisterModal(); setIsMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-md text-center"
                >
                  {t.registerWorkshop}
                </button>
                <button
                  onClick={() => { loginWithGoogle(); setIsMobileMenuOpen(false); }}
                  className="w-full py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-md text-center"
                >
                  {t.signIn}
                </button>
              </>
            ) : (
              <button
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="w-full py-2 text-left text-sm text-red-600 font-medium"
              >
                {t.signOut} ({currentUser.displayName})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
