import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calculator,
  ShieldCheck,
  Building,
  Users,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface JointBiddingSimulatorModalProps {
  onClose: () => void;
  onOpenConsortiumFromSim?: (preset: any) => void;
}

export const JointBiddingSimulatorModal: React.FC<JointBiddingSimulatorModalProps> = ({
  onClose,
  onOpenConsortiumFromSim,
}) => {
  const { workshops, lang, t } = useApp();

  // Interactive Configuration
  const [targetUnits, setTargetUnits] = useState<number>(500);
  const [productType, setProductType] = useState<
    'student_desks' | 'teller_counters' | 'medical_couches' | 'office_workstations'
  >('student_desks');
  const [unitBidPriceETB, setUnitBidPriceETB] = useState<number>(8500);
  const [cpoRatePercent, setCpoRatePercent] = useState<number>(1.5); // standard 1.5% in Ethiopia
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Participating workshop capacity shares
  const [masalemiyaShare, setMasalemiyaShare] = useState<number>(200);
  const [kalityShare, setKalityShare] = useState<number>(180);
  const [merkatoShare, setMerkatoShare] = useState<number>(120);

  const totalAllocated = masalemiyaShare + kalityShare + merkatoShare;
  const totalContractETB = targetUnits * unitBidPriceETB;
  const totalCpoBondETB = Math.round((totalContractETB * cpoRatePercent) / 100);

  // Estimated Bill of Materials (BOM) based on unit count
  const steelMeters = targetUnits * 14; // approx 14 meters of tubular section per desk set
  const timberSheets = Math.ceil(targetUnits * 0.45); // approx 0.45 sheet of plywood/MDF
  const coatingLiters = Math.ceil(targetUnits * 0.35); // primer/paint

  // Member allocations
  const masalemiyaRevenue = masalemiyaShare * unitBidPriceETB;
  const kalityRevenue = kalityShare * unitBidPriceETB;
  const merkatoRevenue = merkatoShare * unitBidPriceETB;

  const handleCopySummary = () => {
    const text = `TENDERLINK ETHIOPIA - NATIONWIDE JOINT BIDDING CONSORTIUM ESTIMATE
Target Scope: ${targetUnits} units of ${productType.replace('_', ' ').toUpperCase()}
Total Estimated Bid Value: ${totalContractETB.toLocaleString()} ETB
Required Commercial Bank CPO Bond (${cpoRatePercent}%): ${totalCpoBondETB.toLocaleString()} ETB (Shared: ~${Math.round(totalCpoBondETB / 3).toLocaleString()} ETB per workshop)

ALLOCATED SHARES & REGIONAL CAPACITY:
1. Lead Structural Metal & Frame Workshop: ${masalemiyaShare} units (${masalemiyaRevenue.toLocaleString()} ETB)
2. Precision CNC & Joinery Workshop: ${kalityShare} units (${kalityRevenue.toLocaleString()} ETB)
3. Hardwood, Finishing & Assembly Partner: ${merkatoShare} units (${merkatoRevenue.toLocaleString()} ETB)
Total Capacity Covered: ${totalAllocated} / ${targetUnits} units

ESTIMATED RAW MATERIAL REQUISITION:
- Steel Hollow Sections: ~${steelMeters.toLocaleString()} meters
- Engineered Timber/Plywood: ~${timberSheets.toLocaleString()} sheets
- Electrostatic Powder Coating: ~${coatingLiters.toLocaleString()} liters
Generated on TenderLink Ethiopia - Nationwide Platform.`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-teal-500 text-slate-900 font-bold flex items-center justify-center text-sm">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'am' ? 'የጋራ ጨረታ እና የሲፒኦ ማስያዣ አስሊ' : 'Joint Bidding & Capacity Simulator'}
              </h2>
              <span className="text-xs text-slate-400">
                {lang === 'am' ? 'የአቅም ማሰባሰብ፣ የባንክ ሲፒኦ እና የጥሬ ዕቃ ግምት' : 'Multi-Workshop Capacity Pooling, Bank CPO Bond & Material Estimator'}
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-800">
          {/* Target Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'am' ? 'የዕቃው ዓይነት' : 'Target Product Specification'}
              </label>
              <select
                value={productType}
                onChange={e => {
                  const val = e.target.value as any;
                  setProductType(val);
                  if (val === 'student_desks') setUnitBidPriceETB(8500);
                  if (val === 'teller_counters') setUnitBidPriceETB(45000);
                  if (val === 'medical_couches') setUnitBidPriceETB(14000);
                  if (val === 'office_workstations') setUnitBidPriceETB(28000);
                }}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium"
              >
                <option value="student_desks">Combined Student Desks (ትምህርት ቤት)</option>
                <option value="teller_counters">Bank Teller Counters (የባንክ ካውንተር)</option>
                <option value="medical_couches">Medical Examination Couches (የህክምና አልጋ)</option>
                <option value="office_workstations">Modular Office Desks (የቢሮ ጠረጴዛ)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'am' ? 'የተጠየቀው ብዛት (ፍሬ)' : 'Tender Volume (Units)'}: <strong className="font-mono text-teal-800">{targetUnits}</strong>
              </label>
              <input
                type="range"
                min="50"
                max="1500"
                step="25"
                value={targetUnits}
                onChange={e => setTargetUnits(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>50</span>
                <span>500</span>
                <span>1500 units</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {lang === 'am' ? 'የአንድ ዕቃ ዋጋ (ብር)' : 'Unit Bid Price (ETB)'}
              </label>
              <input
                type="number"
                value={unitBidPriceETB}
                onChange={e => setUnitBidPriceETB(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-bold text-xs"
              />
            </div>
          </div>

          {/* Key Calculated Financial Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-teal-900 text-white p-4 rounded-xl shadow-xs">
            <div>
              <span className="text-teal-300 text-[10px] uppercase tracking-wider block">
                {lang === 'am' ? 'አጠቃላይ የጨረታ ዋጋ' : 'Total Bid Value'}
              </span>
              <strong className="text-base sm:text-lg font-bold font-mono text-white">
                {(totalContractETB / 1000000).toFixed(2)}M ETB
              </strong>
            </div>

            <div>
              <span className="text-teal-300 text-[10px] uppercase tracking-wider block">
                {lang === 'am' ? 'የባንክ ሲፒኦ (CPO) ማስያዣ' : 'Bank CPO Bond (1.5%)'}
              </span>
              <strong className="text-base sm:text-lg font-bold font-mono text-amber-300">
                {totalCpoBondETB.toLocaleString()} ETB
              </strong>
            </div>

            <div>
              <span className="text-teal-300 text-[10px] uppercase tracking-wider block">
                {lang === 'am' ? 'የብረት ርዝመት ግምት' : 'Est. Steel Tubing'}
              </span>
              <strong className="text-base sm:text-lg font-bold font-mono text-white">
                {steelMeters.toLocaleString()} m
              </strong>
            </div>

            <div>
              <span className="text-teal-300 text-[10px] uppercase tracking-wider block">
                {lang === 'am' ? 'የእንጨት/ፕላይዉድ ሰሌዳ' : 'Plywood / MDF'}
              </span>
              <strong className="text-base sm:text-lg font-bold font-mono text-white">
                {timberSheets.toLocaleString()} Sheets
              </strong>
            </div>
          </div>

          {/* Capacity Pooling Sliders across 3 Ethiopian Cluster Workshops */}
          <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>
                  {lang === 'am' ? 'የአውደ-ጥናቶች አቅም ድርሻ ማስተካከያ' : 'Simulate Workshop Capacity Quotas'}
                </span>
              </h3>
              <div className="text-right">
                <span className="text-slate-500">
                  {lang === 'am' ? 'የተሸፈነ: ' : 'Allocated: '}
                </span>
                <strong className={`font-mono text-xs ${totalAllocated === targetUnits ? 'text-emerald-700 font-bold' : totalAllocated < targetUnits ? 'text-amber-700 font-bold' : 'text-blue-700 font-bold'}`}>
                  {totalAllocated} / {targetUnits} {lang === 'am' ? 'ፍሬ' : 'units'} ({Math.round((totalAllocated / targetUnits) * 100)}%)
                </strong>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {/* Workshop 1: Lead Fabricator */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">1. Structural Metal & Frame Fabricator (Lead Partner)</span>
                  <span className="font-mono font-bold text-teal-800">{masalemiyaShare} units ({masalemiyaRevenue.toLocaleString()} ETB)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={targetUnits}
                  step="10"
                  value={masalemiyaShare}
                  onChange={e => setMasalemiyaShare(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">Focus: Frame welding, tubular profile cutting & primary assembly</span>
              </div>

              {/* Workshop 2: Precision CNC & Joinery */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">2. Precision Joinery & CNC Specialist (Consortium Member)</span>
                  <span className="font-mono font-bold text-teal-800">{kalityShare} units ({kalityRevenue.toLocaleString()} ETB)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={targetUnits}
                  step="10"
                  value={kalityShare}
                  onChange={e => setKalityShare(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">Focus: CNC edge-banding, laminated tops, beveled edging & panels</span>
              </div>

              {/* Workshop 3: Hardwood, Finishing & Packing */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">3. Hardwood Slats, Surface Coating & Packaging Partner</span>
                  <span className="font-mono font-bold text-teal-800">{merkatoShare} units ({merkatoRevenue.toLocaleString()} ETB)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={targetUnits}
                  step="10"
                  value={merkatoShare}
                  onChange={e => setMerkatoShare(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">Focus: Solid seasoned timber slats, protective coating, fasteners & packaging</span>
              </div>
            </div>
          </div>

          {/* CPO & Commercial Bank Protocol Notice */}
          <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 space-y-1">
            <strong className="font-semibold text-slate-900 block flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Commercial Bank CPO Guarantee & Legal Joint Venture Note:</span>
            </strong>
            <p className="text-[11px] text-slate-600">
              The required bid bond CPO ({totalCpoBondETB.toLocaleString()} ETB) is typically provided by the designated lead partner or funded proportionally by members into a joint commercial escrow before bid submission.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{isCopied ? 'Summary Copied to Clipboard!' : 'Copy Consortium Proposal Summary'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenConsortiumFromSim) onOpenConsortiumFromSim({ targetUnits, productType, totalContractETB });
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Proceed to Consortium Formation</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
