import React, { useState } from 'react';
import { Tender, Workshop } from '../types';
import { useApp } from '../context/AppContext';
import { evaluateWorkshopForTender } from '../services/matchingEngine';
import {
  X,
  Calendar,
  Building,
  MapPin,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Users,
  Send,
  HelpCircle,
} from 'lucide-react';

interface TenderDetailModalProps {
  tender: Tender;
  onClose: () => void;
  onOpenConsortiumBuilder: (tender: Tender) => void;
}

export const TenderDetailModal: React.FC<TenderDetailModalProps> = ({
  tender,
  onClose,
  onOpenConsortiumBuilder,
}) => {
  const { currentWorkshop, activeRole, submitExpressionOfInterest } = useApp();
  const [isApplying, setIsApplying] = useState(false);
  const [availableCapacity, setAvailableCapacity] = useState<number>(
    currentWorkshop?.monthlyCapacityUnits || 50
  );
  const [willingToLead, setWillingToLead] = useState(false);
  const [eoiNotes, setEoiNotes] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Evaluate matching with explainability
  const activeWs: Workshop = currentWorkshop || {
    id: 'sample_ws',
    ownerId: 'sample_user',
    ownerName: 'Craftsman Sample',
    businessName: 'National Wood & Steel Workshop',
    phone: '+251 911 000 000',
    email: 'info@ethiopiaworkshop.et',
    city: 'Regional Industrial Hub',
    area: 'Fabrication Quarter',
    address: 'Manufacturing Cluster Plot 12',
    workshopType: 'Solid Wood & Metal Hybrid',
    specialties: ['School Desks', 'Office Furniture'],
    machinery: ['Table Saw', 'Planer', 'Welding Unit'],
    monthlyCapacityUnits: 100,
    workerCount: 10,
    yearsOfExperience: 6,
    pastProjectsSummary: 'Standard public furniture delivery',
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    preferredContractSize: '2,000,000 ETB',
    createdAt: '',
    updatedAt: '',
  };

  const matchEval = evaluateWorkshopForTender(activeWs, tender, activeRole);

  const handleSubmitEOI = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitExpressionOfInterest(tender.id, {
      availableCapacity,
      notes: eoiNotes || `Committed ${availableCapacity} units for joint fulfillment.`,
      willingToLead,
    });
    setAppliedSuccess(true);
    setTimeout(() => {
      setIsApplying(false);
      setAppliedSuccess(false);
    }, 2500);
  };

  const formatETB = (val?: number) => {
    if (!val) return 'Subject to procurement schedule';
    return `${val.toLocaleString()} ETB`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-mono tracking-wider">
              <span>{tender.referenceNumber}</span>
              <span>·</span>
              <span className="text-slate-300 capitalize">{tender.status.replace('_', ' ')}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 leading-snug">
              {tender.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-teal-400" />
                {tender.issuingOrganization}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {tender.destinationCity} ({tender.destinationRegion})
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
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Required Quantity</span>
              <span className="font-bold text-slate-900 text-base">
                {tender.requiredQuantity} {tender.unitType || 'units'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Estimated Budget</span>
              <span className="font-bold text-teal-700 text-base">
                {formatETB(tender.estimatedBudgetETB)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Submission Deadline</span>
              <span className="font-bold text-red-600 text-base">
                {tender.submissionDeadline}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Delivery Window</span>
              <span className="font-bold text-slate-900 text-base">
                {tender.deliveryScheduleWeeks} Weeks
              </span>
            </div>
          </div>

          {/* Joint Bidding Notice */}
          <div className="flex items-start gap-3 p-3.5 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900">
            <CheckCircle className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">Joint Consortium Bidding Permitted</strong>
              <span>
                Small and medium workshops can group together to combine monthly production capacity, satisfy bonding thresholds, and execute this contract in coordinated lots.
              </span>
            </div>
          </div>

          {/* Explainable Matching Engine Section */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-slate-900 text-sm">
                  Workshop Compatibility & Eligibility Fit
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Compatibility Score: </span>
                <strong className="text-sm font-bold text-teal-700">{matchEval.score}/100</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluating capacity for: <strong>{activeWs.businessName}</strong> ({activeWs.area}, {activeWs.monthlyCapacityUnits} units/mo).
            </p>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-700 block">Transparent Match Rationale:</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {matchEval.matchReasons.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeRole === 'premium' && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  <strong>Premium Priority Active:</strong> Your workshop holds priority queue allocation and first-right-of-refusal eligibility for designated lots.
                </span>
              </div>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Technical Specifications & Scope of Work
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
              {tender.itemDescription}
            </p>
            {tender.technicalSpecs && (
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                <strong className="text-slate-800 block mb-1">Standard & Materials Required:</strong>
                {tender.technicalSpecs}
              </div>
            )}
          </div>

          {/* Qualification Requirements */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 text-sm">
              Buyer Mandatory Qualifications
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
              {tender.qualificationsRequired}
            </p>
          </div>

          {/* Submission Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 block">Submission Method</span>
              <span className="font-medium text-slate-800">{tender.submissionMethod}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Official Source URL</span>
              {tender.sourceUrl ? (
                <a
                  href={tender.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:underline break-all"
                >
                  {tender.sourceUrl}
                </a>
              ) : (
                <span className="text-slate-400">Public Gazetted Procurement Dossier</span>
              )}
            </div>
          </div>

          {/* Expression of Interest Form (When user wants to collaborate) */}
          {isApplying ? (
            <form onSubmit={handleSubmitEOI} className="border-t border-slate-200 pt-4 space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Submit Expression of Interest (EOI)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Monthly Unit Capacity You Can Commit (Max {activeWs.monthlyCapacityUnits || 150} units)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={tender.requiredQuantity}
                    value={availableCapacity}
                    onChange={e => setAvailableCapacity(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Workshop Notes & Specialty Contribution
                  </label>
                  <textarea
                    rows={2}
                    value={eoiNotes}
                    onChange={e => setEoiNotes(e.target.value)}
                    placeholder="e.g. Can handle metal tubing welding and electrostatic powder coating locally with certified capacity..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="willingToLead"
                    checked={willingToLead}
                    onChange={e => setWillingToLead(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="willingToLead" className="text-xs text-slate-700 cursor-pointer">
                    Willing to serve as Lead Consortium Coordinator (liaise with buyer & hold CPO bond)
                  </label>
                </div>

                {appliedSuccess ? (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Expression of Interest registered! Organizer will review capacity.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                  >
                    Confirm Expression of Interest
                  </button>
                )}
              </div>
            </form>
          ) : null}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Tender Status: <strong className="text-slate-800">{tender.status}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenConsortiumBuilder(tender)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Form / View Consortium</span>
            </button>

            {!isApplying && (
              <button
                onClick={() => setIsApplying(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-teal-400" />
                <span>Express Interest to Bid</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
