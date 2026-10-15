import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Tender, Workshop } from '../types';
import {
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Layers,
  Calendar,
  Award,
  Sparkles,
  CheckCircle,
  Clock,
  Compass,
  Calculator,
  Sliders,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  Wrench,
  AlertCircle,
  Copy,
  FileText,
  CheckCircle2,
  Share2,
  MapPin,
  HelpCircle,
  Percent,
  Globe2,
  Flame,
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  openRegisterModal: () => void;
  openSimulatorModal?: () => void;
  onSelectTender?: (tender: Tender) => void;
  onOpenConsortiumBuilder?: (tender?: Tender) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  openRegisterModal,
  openSimulatorModal,
  onSelectTender,
  onOpenConsortiumBuilder,
}) => {
  const { tenders, workshops, consortiums, tenderAwards, t, lang, setLang } = useApp();

  const totalCapacitySum = workshops.reduce((acc, w) => acc + (w.monthlyCapacityUnits || 0), 0);
  const totalAwardVolume = tenderAwards.reduce((acc, a) => acc + (a.awardAmountETB || 0), 0);

  // Hero Interactive Tabs: 'simulator' | 'eligibility' | 'consortia'
  const [heroActiveTab, setHeroActiveTab] = useState<'simulator' | 'eligibility' | 'consortia'>('simulator');

  // Hero Quick Search State
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  // 1. Live Bidding Simulator State (Universal nationwide roles)
  const [heroTargetVolume, setHeroTargetVolume] = useState<number>(600);
  const [heroUnitPrice, setHeroUnitPrice] = useState<number>(8500);
  const [heroPreset, setHeroPreset] = useState<'moe' | 'cbe' | 'health' | 'admin' | 'custom'>('moe');
  const [showAdvancedSliders, setShowAdvancedSliders] = useState<boolean>(false);
  const [copyProposalSuccess, setCopyProposalSuccess] = useState<boolean>(false);

  // Universal 3-Partner Workshop Capacity Allocation
  const [partner1Share, setPartner1Share] = useState<number>(250); // Structural Metal & Frame Fabricator
  const [partner2Share, setPartner2Share] = useState<number>(200); // Precision Joinery & CNC Paneling
  const [partner3Share, setPartner3Share] = useState<number>(150); // Hardwood, Surface Finishing & Assembly

  const heroAllocatedTotal = partner1Share + partner2Share + partner3Share;
  const heroTotalValueETB = heroTargetVolume * heroUnitPrice;
  const heroCpoBondETB = Math.round((heroTotalValueETB * 1.5) / 100);
  const heroSharedCpoPerWorkshop = Math.round(heroCpoBondETB / 3);
  const heroCoveragePct = Math.min(Math.round((heroAllocatedTotal / heroTargetVolume) * 100), 100);

  // Bill of Materials Quick Estimate
  const estimatedSteelMeters = heroTargetVolume * 14;
  const estimatedTimberSheets = Math.ceil(heroTargetVolume * 0.45);
  const estimatedPowderLiters = Math.ceil(heroTargetVolume * 0.35);

  const handleApplyPreset = (preset: 'moe' | 'cbe' | 'health' | 'admin' | 'custom') => {
    setHeroPreset(preset);
    if (preset === 'moe') {
      setHeroTargetVolume(600);
      setHeroUnitPrice(8500);
      setPartner1Share(250);
      setPartner2Share(200);
      setPartner3Share(150);
    } else if (preset === 'cbe') {
      setHeroTargetVolume(120);
      setHeroUnitPrice(45000);
      setPartner1Share(40);
      setPartner2Share(60);
      setPartner3Share(20);
    } else if (preset === 'health') {
      setHeroTargetVolume(250);
      setHeroUnitPrice(14000);
      setPartner1Share(100);
      setPartner2Share(80);
      setPartner3Share(70);
    } else if (preset === 'admin') {
      setHeroTargetVolume(350);
      setHeroUnitPrice(12000);
      setPartner1Share(130);
      setPartner2Share(120);
      setPartner3Share(100);
    }
  };

  const handleCopyProposal = () => {
    const text = `TENDERLINK ETHIOPIA - NATIONWIDE JOINT BIDDING CONSORTIUM PROPOSAL
Target Contract: ${
      heroPreset === 'moe'
        ? 'Federal Ministry of Education Student Desks'
        : heroPreset === 'cbe'
        ? 'Commercial Bank of Ethiopia Teller Counters'
        : heroPreset === 'health'
        ? 'Regional Public Health Clinic Examination Beds'
        : heroPreset === 'admin'
        ? 'Institutional Office Workstations'
        : 'Custom Master Furniture Scope'
    }
Total Quantity: ${heroTargetVolume} units @ ${heroUnitPrice.toLocaleString()} ETB
Gross Bid Value: ${heroTotalValueETB.toLocaleString()} ETB
1.5% Commercial Bank CPO Bid Bond: ${heroCpoBondETB.toLocaleString()} ETB
Shared CPO Burden: ~${heroSharedCpoPerWorkshop.toLocaleString()} ETB per workshop (66% Risk Reduction)

POOLED PRODUCTION ALLOCATIONS:
1. Lead Structural Metal & Tubular Frame Workshop: ${partner1Share} units (${(partner1Share * heroUnitPrice).toLocaleString()} ETB)
2. Precision Joinery & CNC Paneling Partner: ${partner2Share} units (${(partner2Share * heroUnitPrice).toLocaleString()} ETB)
3. Solid Hardwood, Surface Finishing & Packing Partner: ${partner3Share} units (${(partner3Share * heroUnitPrice).toLocaleString()} ETB)
Total Capacity Covered: ${heroAllocatedTotal} / ${heroTargetVolume} units (${heroCoveragePct}%)

Platform: TenderLink Ethiopia (Nationwide Platform for All Regions)`;

    navigator.clipboard.writeText(text);
    setCopyProposalSuccess(true);
    setTimeout(() => setCopyProposalSuccess(false), 2500);
  };

  // 2. Instant Workshop Eligibility Matcher State (Nationwide)
  const [eligRegion, setEligRegion] = useState<string>('all_regions');
  const [eligSpecialty, setEligSpecialty] = useState<'metal' | 'wood' | 'finishing' | 'integrated'>('metal');
  const [eligMachines, setEligMachines] = useState<{ [key: string]: boolean }>({
    welding: true,
    cnc: false,
    planer: true,
    spray: false,
  });

  const toggleMachine = (key: string) => {
    setEligMachines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Matched Tender computation for eligibility tab
  const matchedTenderData = useMemo(() => {
    const defaultTender = tenders[0] || null;
    let score = 72;
    const reasons: string[] = [];

    reasons.push(
      lang === 'am'
        ? 'የኢትዮጵያ ንግድ ምዝገባና የታደሰ የሙያ ፈቃድ ማረጋገጫ'
        : 'Valid Ethiopian trade license & registered business profile'
    );

    if (eligMachines.welding) {
      reasons.push(
        lang === 'am'
          ? 'የብረት ቱቦ መበየጃ ማሽኖች ለትምህርት ቤት ዴስኮችና አልጋዎች ብቁ ናቸው'
          : 'Arc & MIG welding equipment satisfies master tubular frame criteria'
      );
      score += 10;
    }
    if (eligMachines.cnc) {
      reasons.push(
        lang === 'am'
          ? 'የሲኤንሲ ማሽን ለባንክ ካውንተሮች ጥራት ያለው የፓነል አጨራረስ ይሰጣል'
          : 'CNC edge-banding machine qualifies for precision banking fixtures'
      );
      score += 10;
    }
    if (eligMachines.planer) {
      reasons.push(
        lang === 'am'
          ? 'የእንጨት ማስተካከያ ማሽን ለጠንካራ እንጨትና ጠረጴዛ ስራዎች ብቁ ነው'
          : 'Industrial thickness planer qualifies for solid timber preparation'
      );
      score += 6;
    }
    if (eligMachines.spray) {
      reasons.push(
        lang === 'am'
          ? 'ቀለም መርጫ ካቢኔ ለተቋማዊ ጥራት ማረጋገጫ ተቀባይነት አለው'
          : 'Electrostatic spray booth meets institutional coating standards'
      );
      score += 6;
    }

    const cappedScore = Math.min(score, 98);
    return {
      tender: defaultTender,
      score: cappedScore,
      reasons,
    };
  }, [eligRegion, eligSpecialty, eligMachines, tenders, lang]);

  // Quick How It Works 30-sec explainer toggle
  const [showHowItWorksExplainer, setShowHowItWorksExplainer] = useState<boolean>(false);

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-6">
      {/* ============================================================
          HERO SECTION: NATIONWIDE, FULLY RESPONSIVE & HIGH IMPACT
         ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl mx-3 sm:mx-6 lg:mx-8 px-4 py-8 sm:px-6 sm:py-10 lg:p-12 border border-slate-800 shadow-2xl">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Top Pill Bar: Nationwide Platform Badge & Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-950/80 border border-teal-500/30 rounded-full text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>
                {lang === 'am'
                  ? 'አገር-አቀፍ መድረክ: በመላው ኢትዮጵያ የሚገኙ አውደ-ጥናቶች ትስስር'
                  : 'NATIONWIDE ETHIOPIAN PLATFORM · ALL REGIONS & CITIES'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">
                {lang === 'am' ? 'የቋንቋ ምርጫ:' : 'Language:'}
              </span>
              <button
                type="button"
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-slate-700 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{lang === 'en' ? 'አማርኛ' : 'English'}</span>
              </button>
            </div>
          </div>

          {/* Main Hero Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN: PITCH, HERO SEARCH, WORKFLOW, METRICS */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {lang === 'am' ? (
                    <>
                      የአውደ-ጥናቶችን አቅም በማቀናጀት <br />
                      <span className="text-teal-400">ተቋማዊ ጨረታዎችን</span> በጋራ ያሸንፉ
                    </>
                  ) : (
                    <>
                      Pool Workshop Capacity. <br />
                      Fulfill <span className="text-teal-400">Master Contracts</span> Nationwide.
                    </>
                  )}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {lang === 'am'
                    ? 'አነስተኛና መካከለኛ የእንጨትና የብረት አውደ-ጥናቶች ለብቻቸው ለትላልቅ የመንግስትና የባንክ ጨረታዎች በቂ የማምረት አቅም ወይም የባንክ ሲፒኦ ስለሌላቸው፣ ቴንደርሊንክ አቅማቸውን አጣምረው በጋራ እንዲወዳደሩና የባንክ ዋስትና ጫናን እንዲጋሩ ያስችላል።'
                    : 'A single workshop cannot supply 600 school desks, 120 bank counters, or 250 clinic beds alone. TenderLink Ethiopia unites vetted furniture workshops across all regions of Ethiopia to fulfill master institutional tenders and split commercial bank CPO bid bonds.'}
                </p>
              </div>

              {/* Responsive Hero Search Bar */}
              <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-xl border border-slate-700 shadow-md space-y-2">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-400 shrink-0 ml-1.5" />
                  <input
                    type="text"
                    value={heroSearchQuery}
                    onChange={e => setHeroSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') setCurrentTab('tenders');
                    }}
                    placeholder={
                      lang === 'am'
                        ? 'ጨረታ ፈልግ (ለምሳሌ: 600 ዴስኮች፣ የባንክ ካውንተር፣ ክሊኒክ አልጋ)...'
                        : 'Search 600 desks, teller counters, hospital beds, workstations...'
                    }
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-hidden py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => setCurrentTab('tenders')}
                    className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
                  >
                    {lang === 'am' ? 'ፈልግ' : 'Search'}
                  </button>
                </div>

                {/* Quick Sector Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    {lang === 'am' ? 'የጨረታ ዘርፎች:' : 'Sectors:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('tenders')}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs"
                  >
                    🏫 {lang === 'am' ? 'ትምህርት (MoE)' : 'Education'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('tenders')}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs"
                  >
                    🏦 {lang === 'am' ? 'ባንኮች (CBE)' : 'Banks'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('tenders')}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs"
                  >
                    🏥 {lang === 'am' ? 'ጤና ጥበቃ' : 'Healthcare'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('tenders')}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer text-xs"
                  >
                    🏛️ {lang === 'am' ? 'የመንግስት ቢሮዎች' : 'Ministries & Bureaus'}
                  </button>
                </div>
              </div>

              {/* Action Buttons with High Tactile Responsive Styling */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentTab('tenders')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 active:scale-95 hover:-translate-y-0.5"
                >
                  <span>{t.exploreTenders}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Wrench className="w-4 h-4 text-teal-400" />
                  <span>{t.registerWorkshop}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHowItWorksExplainer(!showHowItWorksExplainer)}
                  className="px-3 py-3 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'am' ? 'የ30 ሰከንድ አሰራር መመሪያ' : 'How It Works (30s)'}</span>
                  {showHowItWorksExplainer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expandable 30-Second Explainer Drawer */}
              {showHowItWorksExplainer && (
                <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
                    <span className="font-bold text-teal-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      {lang === 'am' ? 'የጋራ ጨረታ በ3 ቀላል ደረጃዎች' : 'Consortium Bidding in 3 Simple Steps:'}
                    </span>
                    <span className="text-[10px] text-slate-400">Compliant with Ethiopian PPA</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <strong className="text-white block text-xs">1. {lang === 'am' ? 'ጨረታ ማግኘት' : 'Discover'}</strong>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'am'
                          ? 'የመንግስትና የባንክ የቤትና ቢሮ እቃዎች ጨረታዎችን ይመልከቱ።'
                          : 'Find institutional tenders needing 100 to 1,000+ furniture units.'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <strong className="text-white block text-xs">2. {lang === 'am' ? 'አቅም ማጣመር' : 'Pool & Share CPO'}</strong>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'am'
                          ? 'ከሌሎች አውደ-ጥናቶች ጋር በመጣመር የባንክ ሲፒኦን (1.5%) በእኩል ይጋሩ።'
                          : 'Combine welding, CNC cutting, and assembly. Split the 1.5% CPO bond.'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <strong className="text-white block text-xs">3. {lang === 'am' ? 'ማምረትና መረከብ' : 'Fulfill & Get Paid'}</strong>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'am'
                          ? 'እያንዳንዱ አውደ-ጥናት የራሱን ድርሻ አምርቶ በኢትዮጵያ ብር ተገቢውን ክፍያ ይቀበላል።'
                          : 'Produce assigned parcels, clear quality audits, and receive verified payment in ETB.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Metrics Bar: 4 Responsive Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    {t.activeWorkshops}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-white font-mono block mt-0.5">
                    {workshops.length} {lang === 'am' ? 'አውደ-ጥናት' : 'Active'}
                  </strong>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    {t.monthlyCapacity}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-teal-400 font-mono block mt-0.5">
                    {totalCapacitySum.toLocaleString()} {t.units}
                  </strong>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    {t.openTenders}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-white font-mono block mt-0.5">
                    {tenders.length} {lang === 'am' ? 'ጨረታዎች' : 'Listings'}
                  </strong>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    {t.disclosedAwards}
                  </span>
                  <strong className="text-base sm:text-lg font-bold text-amber-300 font-mono block mt-0.5">
                    {(totalAwardVolume / 1000000).toFixed(1)}M {t.etb}
                  </strong>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AMAZING HERO FEATURE SUITE WITH 3 TABS */}
            <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-2xl space-y-4">
              {/* Responsive Segmented Tab Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setHeroActiveTab('simulator')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActiveTab === 'simulator'
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span className="truncate">{lang === 'am' ? 'የጋራ አስሊ' : 'CPO Splitter'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActiveTab('eligibility')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActiveTab === 'eligibility'
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span className="truncate">{lang === 'am' ? 'የብቃት መመዘኛ' : 'Instant Match'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroActiveTab('consortia')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    heroActiveTab === 'consortia'
                      ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="truncate">{lang === 'am' ? 'ክፍት ማህበራት' : 'Open Slots'}</span>
                </button>
              </div>

              {/* ============================================================
                  FEATURE 1: LIVE CAPACITY POOLING & CPO BOND SPLITTER
                 ============================================================ */}
              {heroActiveTab === 'simulator' && (
                <div className="space-y-3.5 text-xs">
                  {/* Preset Selector */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                      <span>{lang === 'am' ? 'የተቋም ጨረታ ምሳሌ ይምረጡ:' : 'Select Target Contract Scope:'}</span>
                      <span className="font-mono text-teal-400 font-bold">{heroTargetVolume} Units</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('moe')}
                        className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                          heroPreset === 'moe'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block font-bold text-xs truncate">MoE Desks</span>
                        <span className="text-[10px] text-teal-300 block font-mono">600 units</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyPreset('cbe')}
                        className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                          heroPreset === 'cbe'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block font-bold text-xs truncate">CBE Counters</span>
                        <span className="text-[10px] text-teal-300 block font-mono">120 units</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApplyPreset('health')}
                        className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                          heroPreset === 'health'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block font-bold text-xs truncate">Clinic Beds</span>
                        <span className="text-[10px] text-teal-300 block font-mono">250 units</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setHeroPreset('custom');
                          setShowAdvancedSliders(true);
                        }}
                        className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                          heroPreset === 'custom'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="block font-bold text-xs truncate">Custom</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Set Custom</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial Metrics Strip */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                        {lang === 'am' ? 'አጠቃላይ የውል ዋጋ' : 'Est. Contract Value'}
                      </span>
                      <strong className="text-sm sm:text-base font-bold font-mono text-teal-400">
                        {heroTotalValueETB.toLocaleString()} ETB
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                        {lang === 'am' ? '1.5% የባንክ ሲፒኦ ማስያዣ' : '1.5% Bank CPO Bond'}
                      </span>
                      <strong className="text-sm sm:text-base font-bold font-mono text-amber-300">
                        {heroCpoBondETB.toLocaleString()} ETB
                      </strong>
                    </div>
                  </div>

                  {/* The Shared CPO Benefit Callout */}
                  <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 text-xs text-amber-200">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <strong className="font-semibold block text-white text-xs">
                        {lang === 'am' ? 'የጋራ ሲፒኦ ማስያዣ ትሩፋት:' : 'Shared CPO Bond Advantage:'}
                      </strong>
                      <span className="text-[11px] text-slate-300">
                        {lang === 'am'
                          ? `አንድ አውደ-ጥናት ብቻውን ${heroCpoBondETB.toLocaleString()} ብር ከማስያዝ፣ በ3ቱ አውደ-ጥናቶች እያንዳንዳቸው ~${heroSharedCpoPerWorkshop.toLocaleString()} ብር ብቻ ያስይዛሉ!`
                          : `Instead of 1 workshop risking ${heroCpoBondETB.toLocaleString()} ETB alone, each workshop deposits only ~${heroSharedCpoPerWorkshop.toLocaleString()} ETB!`}
                      </span>
                    </div>
                  </div>

                  {/* Visual Capacity Pooling Meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-300">
                        {lang === 'am' ? 'የ3ቱ አውደ-ጥናቶች የጋራ የማምረት ድርሻ:' : 'Combined Production Allocation Across 3 Partners:'}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        {heroAllocatedTotal} / {heroTargetVolume} Units ({heroCoveragePct}%)
                      </span>
                    </div>

                    {/* Stacked Capacity Progress Bar */}
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-700">
                      <div
                        style={{ width: `${(partner1Share / heroTargetVolume) * 100}%` }}
                        className="bg-teal-500 h-full transition-all"
                        title={`Metal Fabrication: ${partner1Share} units`}
                      />
                      <div
                        style={{ width: `${(partner2Share / heroTargetVolume) * 100}%` }}
                        className="bg-blue-500 h-full transition-all"
                        title={`Precision Joinery: ${partner2Share} units`}
                      />
                      <div
                        style={{ width: `${(partner3Share / heroTargetVolume) * 100}%` }}
                        className="bg-emerald-500 h-full transition-all"
                        title={`Hardwood & Assembly: ${partner3Share} units`}
                      />
                    </div>

                    {/* Universal Workshop Partner Roles Breakdown */}
                    <div className="space-y-1.5 pt-1">
                      {/* Partner 1 */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-teal-500 shrink-0" />
                          <div>
                            <span className="font-bold text-white text-xs block">
                              1. {lang === 'am' ? 'የብረታብረትና መዋቅር አውደ-ጥናት (መሪ)' : 'Structural Metal & Frame Fabricator (Lead)'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {lang === 'am' ? 'የብረት ቱቦ መቁረጥ፣ መበየድና ቀለም' : 'Steel tubular cutting, welding & electro-powder coating'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-teal-300 font-bold text-xs">{partner1Share} units</span>
                          <span className="text-[10px] text-slate-400 block">{(partner1Share * heroUnitPrice).toLocaleString()} ETB</span>
                        </div>
                      </div>

                      {/* Partner 2 */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                          <div>
                            <span className="font-bold text-white text-xs block">
                              2. {lang === 'am' ? 'የትክክለኛ አናጺነትና ሲኤንሲ አውደ-ጥናት' : 'Precision Joinery & CNC Paneling Specialist'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {lang === 'am' ? 'ሲኤንሲ ጠርዝ መሸፈኛና ላሚኔት ሰሌዳ' : 'CNC edge-banded desktop panels, tops & beveled edging'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-blue-300 font-bold text-xs">{partner2Share} units</span>
                          <span className="text-[10px] text-slate-400 block">{(partner2Share * heroUnitPrice).toLocaleString()} ETB</span>
                        </div>
                      </div>

                      {/* Partner 3 */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                          <div>
                            <span className="font-bold text-white text-xs block">
                              3. {lang === 'am' ? 'የጠንካራ እንጨትና ማሸጊያ አውደ-ጥናት' : 'Hardwood, Surface Finishing & Assembly Partner'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {lang === 'am' ? 'የደረቀ እንጨት፣ ማገጣጠምና ማሸግ' : 'Seasoned timber slats, eco-varnish, hardware & packing'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-emerald-300 font-bold text-xs">{partner3Share} units</span>
                          <span className="text-[10px] text-slate-400 block">{(partner3Share * heroUnitPrice).toLocaleString()} ETB</span>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Sliders for Quotas */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedSliders(!showAdvancedSliders)}
                        className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>{showAdvancedSliders ? 'Hide Unit Adjustment Sliders' : 'Adjust Quota Sliders & Materials'}</span>
                        {showAdvancedSliders ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {showAdvancedSliders && (
                        <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                          {heroPreset === 'custom' && (
                            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
                              <div>
                                <label className="text-[10px] text-slate-400 block">Target Units:</label>
                                <input
                                  type="number"
                                  value={heroTargetVolume}
                                  onChange={e => setHeroTargetVolume(Math.max(1, Number(e.target.value)))}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block">Unit Bid Price (ETB):</label>
                                <input
                                  type="number"
                                  value={heroUnitPrice}
                                  onChange={e => setHeroUnitPrice(Math.max(1, Number(e.target.value)))}
                                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                                />
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-300">
                                <span>Partner 1 (Metal Fabrication):</span>
                                <span className="font-mono text-teal-400 font-bold">{partner1Share} units</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={heroTargetVolume}
                                step="10"
                                value={partner1Share}
                                onChange={e => setPartner1Share(Number(e.target.value))}
                                className="w-full accent-teal-500 cursor-pointer h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-300">
                                <span>Partner 2 (Precision Joinery):</span>
                                <span className="font-mono text-blue-400 font-bold">{partner2Share} units</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={heroTargetVolume}
                                step="10"
                                value={partner2Share}
                                onChange={e => setPartner2Share(Number(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer h-2"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-300">
                                <span>Partner 3 (Hardwood & Assembly):</span>
                                <span className="font-mono text-emerald-400 font-bold">{partner3Share} units</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={heroTargetVolume}
                                step="10"
                                value={partner3Share}
                                onChange={e => setPartner3Share(Number(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer h-2"
                              />
                            </div>
                          </div>

                          {/* Quick Bill of Materials Requisition */}
                          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                            <span className="font-semibold text-slate-300 block">Est. Bill of Materials (BOM):</span>
                            <div className="grid grid-cols-3 gap-1 text-slate-300 font-mono">
                              <div>• {estimatedSteelMeters.toLocaleString()}m Steel Tubing</div>
                              <div>• {estimatedTimberSheets} Wood Sheets</div>
                              <div>• {estimatedPowderLiters}L Powder Coating</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenConsortiumBuilder) {
                          onOpenConsortiumBuilder(tenders[0]);
                        } else {
                          setCurrentTab('consortiums');
                        }
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <span>{lang === 'am' ? 'የዚህን ጨረታ የጋራ ማህበር ጀምር' : 'Form / Join This Consortium'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyProposal}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1.5 shrink-0 active:scale-95"
                      title="Copy formatted Ethiopian joint bid summary"
                    >
                      {copyProposalSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">{lang === 'am' ? 'ተገልብጧል!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{lang === 'am' ? 'ሰነድ ገልብጥ' : 'Copy Bid Summary'}</span>
                        </>
                      )}
                    </button>

                    {openSimulatorModal && (
                      <button
                        type="button"
                        onClick={openSimulatorModal}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 rounded-xl transition-all cursor-pointer shrink-0 active:scale-95"
                        title="Open Detailed Material Estimator"
                      >
                        <Calculator className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================
                  FEATURE 2: INSTANT WORKSHOP MATCH & QUALIFICATION CHECKER
                 ============================================================ */}
              {heroActiveTab === 'eligibility' && (
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="font-bold text-white text-xs">
                      {lang === 'am' ? 'የአውደ-ጥናትህን የጨረታ ብቃት በ10 ሰከንድ መዝን' : 'Test If Your Workshop Qualifies in 10 Seconds'}
                    </span>
                    <span className="text-[10px] text-teal-400 font-mono font-bold">Nationwide Evaluation</span>
                  </div>

                  {/* Step 1: Select Region & Specialty */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300 block font-semibold">
                      1. {lang === 'am' ? 'የአውደ-ጥናትህ ክልል ወይም ዋና የስራ ዘርፍ:' : 'Select Your Region & Specialty:'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEligSpecialty('metal')}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          eligSpecialty === 'metal'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <strong className="block text-xs truncate">Metal & Frame</strong>
                        <span className="text-[10px] text-slate-400">Welding / Tubular</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEligSpecialty('wood')}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          eligSpecialty === 'wood'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <strong className="block text-xs truncate">Joinery & CNC</strong>
                        <span className="text-[10px] text-slate-400">Edge-banding / Tops</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEligSpecialty('finishing')}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          eligSpecialty === 'finishing'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <strong className="block text-xs truncate">Timber & Coating</strong>
                        <span className="text-[10px] text-slate-400">Hardwood / Spray</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEligSpecialty('integrated')}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          eligSpecialty === 'integrated'
                            ? 'bg-teal-950/90 border-teal-400 text-white shadow-xs'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <strong className="block text-xs truncate">Integrated Plant</strong>
                        <span className="text-[10px] text-slate-400">Multi-discipline</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Toggle Machines Owned */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-300 block font-semibold">
                      2. {lang === 'am' ? 'ያሉህን ማሽኖች ምረጥ (ጠቅ አድርግ):' : 'Select Equipment You Currently Operate:'}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleMachine('welding')}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          eligMachines.welding
                            ? 'bg-slate-800 border-teal-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-medium">⚡ Arc / MIG Welders</span>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${eligMachines.welding ? 'bg-teal-500 text-slate-900 font-bold' : 'border border-slate-600'}`}>
                          {eligMachines.welding ? '✓' : ''}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMachine('cnc')}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          eligMachines.cnc
                            ? 'bg-slate-800 border-teal-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-medium">📐 CNC Edge Bander</span>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${eligMachines.cnc ? 'bg-teal-500 text-slate-900 font-bold' : 'border border-slate-600'}`}>
                          {eligMachines.cnc ? '✓' : ''}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMachine('planer')}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          eligMachines.planer
                            ? 'bg-slate-800 border-teal-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-medium">🪵 Thickness Planer</span>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${eligMachines.planer ? 'bg-teal-500 text-slate-900 font-bold' : 'border border-slate-600'}`}>
                          {eligMachines.planer ? '✓' : ''}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMachine('spray')}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          eligMachines.spray
                            ? 'bg-slate-800 border-teal-400 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-medium">🎨 Powder Coating Booth</span>
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${eligMachines.spray ? 'bg-teal-500 text-slate-900 font-bold' : 'border border-slate-600'}`}>
                          {eligMachines.spray ? '✓' : ''}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Calculated Match Results Card */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Matched Master Tender:</span>
                        <strong className="text-sm font-bold text-white block">
                          {matchedTenderData.tender?.title || 'Ministry of Education 600 Student Desks'}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Eligibility Score:</span>
                        <strong className="text-base font-extrabold text-teal-400 font-mono block">
                          {matchedTenderData.score}% Match
                        </strong>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {lang === 'am' ? 'የተረጋገጡ የብቃት መስፈርቶች:' : 'Verified Qualifications:'}
                      </span>
                      {matchedTenderData.reasons.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (matchedTenderData.tender && onSelectTender) {
                          onSelectTender(matchedTenderData.tender);
                        } else {
                          setCurrentTab('tenders');
                        }
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <span>{lang === 'am' ? 'ይህንን ጨረታ ተጫረት' : 'View Tender & Express Interest'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={openRegisterModal}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors active:scale-95"
                    >
                      {lang === 'am' ? 'አውደ-ጥናት መዝግብ' : 'Register Profile'}
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================
                  FEATURE 3: LIVE OPEN CONSORTIA SEEKING REGIONAL PARTNERS
                 ============================================================ */}
              {heroActiveTab === 'consortia' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="font-bold text-white text-xs">
                      {lang === 'am' ? 'አሁን አጋር የሚፈልጉ ክፍት ማህበራት' : 'Active Consortia Seeking Regional Partners'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">● Active Openings</span>
                  </div>

                  {/* Open Consortia Cards */}
                  <div className="space-y-2.5">
                    {/* Item 1 */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-mono">
                            <span>MoE-ETH-2026-089</span>
                            <span>•</span>
                            <span>Ministry of Education</span>
                          </div>
                          <h4 className="font-bold text-white text-xs mt-0.5">
                            National Double School Desks Consortium
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30 shrink-0">
                          1 Partner Needed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Confirmed Partners:</span>
                          <span className="text-slate-200 font-medium">2 / 3 Joined (75% Filled)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Needed Specialty:</span>
                          <span className="text-teal-300 font-bold">Hardwood Slats & Assembly</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">
                          Open Allocation: <strong className="text-white font-mono">150 Desks (1.27M ETB)</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentTab('consortiums')}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                        >
                          <span>{lang === 'am' ? 'አባልነት ጠይቅ' : 'Claim Slot'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-mono">
                            <span>CBE-HQ-2026-014</span>
                            <span>•</span>
                            <span>Commercial Bank of Ethiopia</span>
                          </div>
                          <h4 className="font-bold text-white text-xs mt-0.5">
                            CBE Branch Modernization Counters
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30 shrink-0">
                          1 Partner Needed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Confirmed Partners:</span>
                          <span className="text-slate-200 font-medium">1 / 2 Joined (50% Filled)</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Needed Specialty:</span>
                          <span className="text-teal-300 font-bold">Heavy CNC Edge-Banding</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">
                          Open Allocation: <strong className="text-white font-mono">60 Counters (2.7M ETB)</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentTab('consortiums')}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                        >
                          <span>{lang === 'am' ? 'አባልነት ጠይቅ' : 'Claim Slot'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('consortiums')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-center font-semibold transition-all cursor-pointer block active:scale-95"
                    >
                      {lang === 'am' ? 'ሁሉንም የጋራ ማህበራት በዝርዝር ይመልከቱ →' : 'View All Active Consortia Workspace →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: NATIONWIDE CAPACITY POOLING FOR ALL ETHIOPIAN WORKSHOPS
         ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-1.5">
                <Globe2 className="w-3.5 h-3.5 text-teal-600" />
                <span>{lang === 'am' ? 'አገር አቀፍ የኢትዮጵያ አውደ-ጥናቶች ትስስር' : 'Nationwide Capacity Network'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'am'
                  ? 'ለመላው የኢትዮጵያ የእንጨትና የብረት አውደ-ጥናቶች የተገነባ መድረክ'
                  : 'Engineered for All Furniture Workshops & Manufacturers Across Ethiopia'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
                {lang === 'am'
                  ? 'አነስተኛና መካከለኛ አውደ-ጥናቶች አቅማቸው ብቻውን ለትላልቅ የትምህርት ቤት፣ የባንክና የሚኒስቴር መስሪያ ቤቶች ጨረታዎች ስለማይበቃ፣ ቴንደርሊንክ አቅማቸውን በማቀናጀት በጋራ እንዲጫረቱ፣ የባንክ ሲፒኦ ዋስትናን እንዲጋሩና ጥራቱን የጠበቀ ዕቃ እንዲያቀርቡ ያግዛል።'
                  : 'Small and medium workshops often miss lucrative public school, bank, and ministry tenders because individual capacity or financial bonding is too small. TenderLink enables coordinated multi-workshop groupings across any region so each craftsman focuses on their specialty while jointly satisfying master tender quotas.'}
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('consortiums')}
              className="self-start sm:self-auto px-5 py-3 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-sm"
            >
              <span>{lang === 'am' ? 'የጋራ ማህበራትን ይመልከቱ' : 'View Active Consortia'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:border-teal-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'am' ? 'ግልጽ የአቅም ማሰባሰብ' : 'Transparent Capacity Pooling'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'am'
                  ? 'የትላልቅ ጨረታዎች ብዛት እንደ ማሽነሪ ዓይነትና እንደ አውደ-ጥናቶች የሰው ኃይል በግልጽና በስምምነት ይከፋፈላል።'
                  : 'Large contracts (e.g. 600 desks, 120 counters) are split into verifiable, audited lots based on declared machinery, factory floor capacity, and active workforce.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:border-teal-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'am' ? 'ምክንያታዊና ግልጽ አጣማጅ' : 'Explainable Algorithmic Matching'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'am'
                  ? 'አውደ-ጥናቶች የሚጣመሩት በማሽነሪዎቻቸው፣ በአካባቢ ቅርበታቸውና በሙያ ዘርፋቸው ነው። ምንም ዓይነት የተደበቀ ስሌት የለም።'
                  : 'Workshops are matched by machinery, geographic proximity, and specialty. Eligibility always precedes subscription priority. No fake win probabilities or black-box scoring.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 hover:border-teal-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'am' ? 'የክፍያና የስራ ምዕራፎች' : 'Contract Milestones & Invoicing'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'am'
                  ? 'የማምረት ሂደትን፣ የጥራት ማረጋገጫን እና የክፍያ ምዕራፎችን በኢትዮጵያ ብር (ETB) በግልጽ ይከታተሉ።'
                  : 'Track deliverables, joint document checklists, and declared payment milestones in Ethiopian Birr (ETB) with clear separation between invoiced and confirmed disbursements.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: FEATURED INSTITUTIONAL TENDERS PREVIEW
         ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'am' ? 'ተለይተው የቀረቡ ተቋማዊ ጨረታዎች' : 'Featured Institutional Tenders'}
            </h2>
            <p className="text-xs text-slate-600">
              {lang === 'am' ? 'በቅርቡ የታተሙና ለጋራ ጥምረት ክፍት የሆኑ የጨረታ ዕድሎች' : 'Recently verified public procurement opportunities open for joint bidding across Ethiopia'}
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('tenders')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{lang === 'am' ? 'ሁሉንም ይመልከቱ' : 'View All'} ({tenders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tenders.slice(0, 2).map(t => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{t.referenceNumber}</span>
                  <span className="text-teal-700 font-sans font-semibold capitalize bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50">
                    {t.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {t.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t.itemDescription}
                </p>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Buyer</span>
                    <span className="font-semibold text-slate-800 truncate block">{t.issuingOrganization}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Required</span>
                    <span className="font-semibold text-slate-800">{t.requiredQuantity} units</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Deadline</span>
                    <span className="font-semibold text-red-600">{t.submissionDeadline}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-500">Budget: </span>
                  <strong className="text-teal-800 font-mono font-bold">
                    {t.estimatedBudgetETB ? `${t.estimatedBudgetETB.toLocaleString()} ETB` : 'Public Gazette'}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    if (onSelectTender) {
                      onSelectTender(t);
                    } else {
                      setCurrentTab('tenders');
                    }
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
                >
                  {lang === 'am' ? 'ዝርዝርና የጋራ ጨረታ' : 'View Details & Joint Bid'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 4: 5-STEP COLLABORATIVE LIFECYCLE
         ============================================================ */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'am' ? 'የቴንደርሊንክ ኢትዮጵያ አሰራር' : 'How TenderLink Ethiopia Operates'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {lang === 'am'
              ? 'ከጨረታ ግኝት ጀምሮ እስከ ስምምነትና ማምረት ድረስ የሚከናወኑ 5 ደረጃዎች'
              : 'A step-by-step collaborative lifecycle from tender discovery to verified joint contract delivery.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold mx-auto flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'am' ? '1. የጨረታ ግኝት' : 'Tender Discovery'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Browse gazetted Ethiopian tenders across education, health, and commercial sectors with explicit specifications.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold mx-auto flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'am' ? '2. አቅም ማጣመር' : 'Capacity Matching'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Platform matches compatible workshops based on declared machinery, available workers, and geographic proximity.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold mx-auto flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'am' ? '3. ማህበር ምስረታ' : 'Consortium Formation'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Lead organizer issues formal invitations. Members review terms, quantities, and explicitly provide affirmative consent.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold mx-auto flex items-center justify-center text-xs">
              4
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'am' ? '4. የጋራ ጨረታ ማቅረብ' : 'Joint Submission'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Consortium compiles renewed business licenses, tax clearances, and bank guarantees into an official joint bid package.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs hover:border-teal-300 transition-colors">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold mx-auto flex items-center justify-center text-xs">
              5
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {lang === 'am' ? '5. ማምረትና ማስረከብ' : 'Execution & Milestones'}
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Upon award, track assigned production parcels, quality inspections, and documented invoice disbursements.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: TRUST, INTEGRITY & ETHIOPIAN PPA COMPLIANCE BANNER
         ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-2xl p-6 sm:p-7 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-9 h-9 text-teal-700 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {lang === 'am' ? 'የኢትዮጵያ የመንግስት ግዢ መመሪያዎች ተገዢነት ማስታወቂያ' : 'Institutional Integrity & Ethiopian Public Procurement Notice'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                {lang === 'am'
                  ? 'ቴንደርሊንክ ኢትዮጵያ የፌዴራል የመንግስት ግዢ መመሪያዎችን በጥብቅ ይከተላል። መድረኩ ጨረታ ማሸነፍን ወይም ውል ማግኘትን በጭራሽ ዋስትና አይሰጥም።'
                  : 'TenderLink Ethiopia complies with Ethiopian Federal Public Procurement Agency (PPA) guidelines. We never guarantee contract awards, payment receipts, or bypass mandatory tender qualifications.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('terms')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            {lang === 'am' ? 'የአሰራር ደንቦችን ይመልከቱ' : 'Review Governance Rules'}
          </button>
        </div>
      </section>
    </div>
  );
};
