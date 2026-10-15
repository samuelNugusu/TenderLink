import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Consortium, ConsortiumMember, ContractSegment } from '../types';
import { ConsortiumChatRoom } from '../components/ConsortiumChatRoom';
import {
  Users,
  CheckCircle,
  Clock,
  Layers,
  FileText,
  AlertCircle,
  Plus,
  ShieldCheck,
  ChevronRight,
  Send,
  Building,
  Check,
  X as CloseIcon,
} from 'lucide-react';

interface ConsortiumsPageProps {
  onSelectTender: (tenderId: string) => void;
  openConsortiumBuilder: () => void;
}

export const ConsortiumsPage: React.FC<ConsortiumsPageProps> = ({
  onSelectTender,
  openConsortiumBuilder,
}) => {
  const {
    consortiums,
    consortiumMembers,
    contractSegments,
    tasks,
    currentUser,
    currentWorkshop,
    activeRole,
    respondToConsortiumInvite,
    updateConsortiumStatus,
  } = useApp();

  const [selectedConsortiumId, setSelectedConsortiumId] = useState<string>(
    consortiums[0]?.id || ''
  );

  const activeConsortium = consortiums.find(c => c.id === selectedConsortiumId) || consortiums[0];
  const members = consortiumMembers.filter(m => m.consortiumId === activeConsortium?.id);
  const segments = contractSegments.filter(s => s.consortiumId === activeConsortium?.id);
  const consortiumTasks = tasks.filter(t => t.consortiumId === activeConsortium?.id);

  // Check if current workshop has an invite needing response
  const myInvite = members.find(
    m => m.workshopId === currentWorkshop?.id && m.status === 'invited'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recruiting':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800">Recruiting Members</span>;
      case 'awaiting_acceptance':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800">Awaiting Partner Consents</span>;
      case 'ready_for_review':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800">Ready for Submission</span>;
      case 'submitted':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-800">Bid Submitted to Buyer</span>;
      case 'awarded':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800">Contract Awarded</span>;
      case 'in_execution':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800">In Production Execution</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 capitalize">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold tracking-wide">
            <span>CORE COLLABORATIVE WORKSPACE</span>
            <span>·</span>
            <span>JOINT BIDDING PROTOCOL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Consortium Management & Production Groups
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Review active multi-workshop consortia, track member capacity pledges, affirmative consents, and delivery parcels.
          </p>
        </div>

        <button
          onClick={openConsortiumBuilder}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white text-xs sm:text-sm font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-900/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Form New Consortium</span>
        </button>
      </div>

      {/* Invite Action Alert if current workshop is invited */}
      {myInvite && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 font-bold block text-sm">
                Consortium Invitation Pending for {currentWorkshop?.businessName}!
              </strong>
              <p className="text-amber-800 mt-0.5">
                You have been allocated <strong>{myInvite.allocatedQuantity} units</strong> ({myInvite.assignedSegment}) with an estimated allocation of <strong>{myInvite.allocatedAmountETB.toLocaleString()} ETB</strong>. Your explicit affirmative consent is required to participate.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => respondToConsortiumInvite(myInvite.id, false)}
              className="px-3 py-1.5 border border-amber-300 hover:bg-amber-100 text-amber-900 font-medium rounded cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={() => respondToConsortiumInvite(myInvite.id, true)}
              className="px-4 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept & Sign Consent</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Consortia Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {consortiums.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedConsortiumId(c.id)}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium shrink-0 cursor-pointer transition-colors text-left border ${c.id === activeConsortium?.id ? 'border-teal-600 bg-white shadow-xs text-slate-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'}`}
          >
            <span className="block truncate max-w-[240px]">{c.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">{c.reference}</span>
          </button>
        ))}
      </div>

      {activeConsortium ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-Col: Consortium Overview, Member Allocations, Segments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Consortium Summary Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span>{activeConsortium.reference}</span>
                    <span>·</span>
                    <span>Tender Ref: {activeConsortium.tenderId}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {activeConsortium.name}
                  </h2>
                </div>
                <div>{getStatusBadge(activeConsortium.status)}</div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                {activeConsortium.notes}
              </p>

              {/* Progress & Financials */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block">Committed Capacity</span>
                  <strong className="text-slate-900 text-base font-mono">
                    {activeConsortium.committedTotalCapacity} / {activeConsortium.requiredTotalCapacity} units
                  </strong>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-teal-600 h-full"
                      style={{
                        width: `${Math.min(
                          (activeConsortium.committedTotalCapacity / (activeConsortium.requiredTotalCapacity || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Total Joint Value</span>
                  <strong className="text-teal-800 text-base font-mono">
                    {activeConsortium.totalContractValueETB
                      ? `${activeConsortium.totalContractValueETB.toLocaleString()} ETB`
                      : 'Pending award calculation'}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 block">Lead Organizer</span>
                  <span className="text-slate-800 font-semibold block truncate">
                    {activeConsortium.organizerName || 'Lead Consortium Organizer'}
                  </span>
                </div>
              </div>

              {/* Status advancement buttons for testing workflow */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Advance Lifecycle:</span>
                <button
                  onClick={() => updateConsortiumStatus(activeConsortium.id, 'ready_for_review')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                >
                  Set Ready for Submission
                </button>
                <button
                  onClick={() => updateConsortiumStatus(activeConsortium.id, 'submitted')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                >
                  Mark as Submitted
                </button>
                <button
                  onClick={() => updateConsortiumStatus(activeConsortium.id, 'in_execution')}
                  className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded font-semibold cursor-pointer"
                >
                  Mark Awarded & In Execution
                </button>
              </div>
            </div>

            {/* Member Workshop List */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Participating Workshop Partners ({members.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Allocated production quotas, declared capacity, and signed consents
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {members.map(member => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {member.workshopName}
                        </span>
                        {member.roleInConsortium === 'lead' && (
                          <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[10px] rounded font-semibold">
                            Lead Partner
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Assigned Scope:</strong> {member.assignedSegment || 'Component manufacturing'}
                      </p>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                        <span>Monthly Capacity: {member.declaredCapacity} units</span>
                        <span>·</span>
                        <span>Allocated Share: {member.allocatedQuantity} units</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="font-bold text-slate-900 font-mono text-sm">
                        {member.allocatedAmountETB.toLocaleString()} ETB
                      </div>
                      <div className="mt-1">
                        {member.consentGiven ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Consent Signed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            Awaiting Consent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract Segments & Allocation Parcels */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>Contract Segment Breakdown (Production Lots)</span>
              </h3>

              <div className="space-y-3">
                {segments.map(seg => (
                  <div
                    key={seg.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{seg.title}</span>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        {seg.quantity} units · Unit Price: {seg.unitPriceETB.toLocaleString()} ETB · Delivery: {seg.deliveryDeadline}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1">
                        Assigned To: <strong className="text-slate-800">{seg.allocatedWorkshopName || 'Unallocated'}</strong>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-bold font-mono text-teal-800 text-sm">
                        {seg.totalValueETB.toLocaleString()} ETB
                      </span>
                      <span className="block text-[10px] text-slate-500 capitalize">{seg.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Shared Tasks & Compliance Checklist */}
          <div className="space-y-6">
            {/* Tasks Board */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-teal-700" />
                  Consortium Task Checklist
                </h3>
              </div>

              <div className="space-y-2.5">
                {consortiumTasks.map(t => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-slate-900 leading-snug">{t.title}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] rounded uppercase font-semibold shrink-0 ${t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Owner: {t.assignedWorkshopName?.split(' ')[0]}</span>
                      <span>Due: {t.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance & Document Repository Reminder */}
            <div className="bg-slate-900 text-slate-300 rounded-xl p-5 border border-slate-800 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Joint Bid Security & Compliance
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Before final sealed submission, the lead partner verifies all renewed business licenses, valid Ethiopian tax clearances, and the joint bid security bond (CPO) issued by an authorized bank.
              </p>
              <div className="p-2.5 rounded bg-slate-800 border border-slate-700 text-[11px] space-y-1">
                <div className="text-teal-300 font-semibold">Document Status:</div>
                <div className="flex items-center justify-between">
                  <span>Lead Partner License:</span>
                  <span className="text-emerald-400">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Joint Venture Deed:</span>
                  <span className="text-emerald-400">Drafted</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CPO Bid Bond:</span>
                  <span className="text-amber-300">Under Process</span>
                </div>
              </div>
            </div>

            {/* Live Consortium Collaboration Room */}
            <ConsortiumChatRoom
              consortiumId={activeConsortium.id}
              consortiumName={activeConsortium.name}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
