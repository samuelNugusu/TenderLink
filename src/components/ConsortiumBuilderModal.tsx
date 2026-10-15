import React, { useState } from 'react';
import { Tender, Workshop } from '../types';
import { useApp } from '../context/AppContext';
import { generateConsortiumProposal } from '../services/matchingEngine';
import {
  X,
  Users,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface ConsortiumBuilderModalProps {
  tender: Tender;
  onClose: () => void;
  onConsortiumCreated: (consortiumId: string) => void;
}

export const ConsortiumBuilderModal: React.FC<ConsortiumBuilderModalProps> = ({
  tender,
  onClose,
  onConsortiumCreated,
}) => {
  const { workshops, createConsortium, inviteMemberToConsortium, currentWorkshop } = useApp();

  const [consortiumName, setConsortiumName] = useState(
    `${tender.productCategory} Joint Consortium - ${tender.referenceNumber}`
  );
  const [consortiumNotes, setConsortiumNotes] = useState(
    `Collaborative fulfillment for ${tender.requiredQuantity} units of ${tender.unitType}. Segmented by metal framing, precision joinery, and final finishing.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);

  // Generate automated explainable capacity matching proposal
  const candidateWorkshops = workshops.filter(w => w.verificationStatus !== 'rejected');
  const userRolesMap: Record<string, 'basic' | 'premium' | 'admin'> = {
    user_kality: 'premium',
    user_masalemiya: 'basic',
    user_merkato: 'basic',
  };

  const proposal = generateConsortiumProposal(tender, candidateWorkshops, userRolesMap);

  // Track checked workshops for invitation
  const [selectedWorkshopAllocations, setSelectedWorkshopAllocations] = useState<
    { workshopId: string; quantity: number; segment: string }[]
  >(
    proposal.suggestedMembers.map(m => ({
      workshopId: m.workshop.id,
      quantity: m.proposedAllocationQuantity,
      segment: m.role === 'lead' ? 'Primary structural frames & assembly' : 'Precision components & finishing',
    }))
  );

  const totalAllocated = selectedWorkshopAllocations.reduce((sum, item) => sum + item.quantity, 0);
  const capacityCoveragePct = Math.round((totalAllocated / tender.requiredQuantity) * 100);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await createConsortium({
        tenderId: tender.id,
        name: consortiumName,
        notes: consortiumNotes,
      });

      // Send invitations to selected members
      for (const item of selectedWorkshopAllocations) {
        if (item.workshopId !== (currentWorkshop?.id || 'ws_masalemiya_01')) {
          const ws = workshops.find(w => w.id === item.workshopId);
          await inviteMemberToConsortium(
            created.id,
            item.workshopId,
            ws?.monthlyCapacityUnits || 50,
            item.quantity,
            item.segment
          );
        }
      }

      setIsCreatedSuccess(true);
      setTimeout(() => {
        onConsortiumCreated(created.id);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to create consortium:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-teal-500 text-slate-900 font-bold flex items-center justify-center text-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Form Joint Bidding Consortium
              </h2>
              <span className="text-xs text-slate-400">
                Tender Ref: {tender.referenceNumber} · Target: {tender.requiredQuantity} {tender.unitType}
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

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800">
          {/* Capacity Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Combined Capacity Fulfillment:</span>
              <span className="font-mono text-slate-900 font-bold">
                {totalAllocated} / {tender.requiredQuantity} units ({capacityCoveragePct}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${capacityCoveragePct >= 100 ? 'bg-emerald-600' : 'bg-teal-600'}`}
                style={{ width: `${Math.min(capacityCoveragePct, 100)}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{proposal.explanation}</span>
            </div>
          </div>

          {/* Consortium Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consortium Working Name
              </label>
              <input
                type="text"
                value={consortiumName}
                onChange={e => setConsortiumName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Consortium Scope & Joint Production Strategy
              </label>
              <textarea
                rows={2}
                value={consortiumNotes}
                onChange={e => setConsortiumNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
              />
            </div>
          </div>

          {/* Algorithmic Capacity Allocation Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-700" />
                Proposed Workshop Member Allocations
              </h3>
              <span className="text-[11px] text-slate-500">Explainable Allocation Rules</span>
            </div>

            <div className="space-y-2.5">
              {proposal.suggestedMembers.map((item, idx) => {
                const currentAlloc = selectedWorkshopAllocations.find(a => a.workshopId === item.workshop.id);
                const isSelected = !!currentAlloc;

                return (
                  <div
                    key={item.workshop.id}
                    className={`p-3.5 rounded-lg border text-xs transition-colors ${isSelected ? 'border-teal-300 bg-teal-50/40' : 'border-slate-200 bg-slate-50 opacity-60'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedWorkshopAllocations(prev => [
                                ...prev,
                                {
                                  workshopId: item.workshop.id,
                                  quantity: item.proposedAllocationQuantity,
                                  segment: 'Modular production parcel',
                                },
                              ]);
                            } else {
                              setSelectedWorkshopAllocations(prev =>
                                prev.filter(a => a.workshopId !== item.workshop.id)
                              );
                            }
                          }}
                          className="mt-1 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{item.workshop.businessName}</span>
                            <span className="text-[10px] text-slate-500">({item.workshop.area})</span>
                            {item.role === 'lead' && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-slate-900 text-white rounded">
                                Lead Partner
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{item.rationale}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span>Monthly Cap: {item.workshop.monthlyCapacityUnits} units</span>
                            <span>·</span>
                            <span>Workers: {item.workshop.workerCount}</span>
                            <span>·</span>
                            <span>Specialties: {item.workshop.specialties.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="text-right shrink-0">
                          <label className="text-[10px] text-slate-500 block">Allocated Qty</label>
                          <input
                            type="number"
                            min="5"
                            max={tender.requiredQuantity}
                            value={currentAlloc?.quantity || item.proposedAllocationQuantity}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setSelectedWorkshopAllocations(prev =>
                                prev.map(a => (a.workshopId === item.workshop.id ? { ...a, quantity: val } : a))
                              );
                            }}
                            className="w-20 px-2 py-1 text-xs border border-slate-300 rounded text-right font-bold font-mono bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal and Mutual Consent Reminder */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
            <strong className="block font-semibold">Important Consortium Governance Rule:</strong>
            <p>
              In accordance with platform governance, all candidate workshops receive formal invitations and must provide explicit affirmative consent to the assigned quantity, unit price, and delivery schedule before the consortium package can be certified for tender submission.
            </p>
          </div>

          {isCreatedSuccess ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Consortium created successfully! Member invitations have been dispatched.</span>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || totalAllocated === 0}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-teal-400" />
                <span>
                  {isSubmitting ? 'Creating Consortium...' : `Confirm & Form Consortium (${totalAllocated} Units Allocated)`}
                </span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
