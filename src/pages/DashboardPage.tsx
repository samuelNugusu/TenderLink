import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Workshop, Tender, ConsortiumMember } from '../types';
import {
  Building2,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Wrench,
  CreditCard,
  Edit,
  Save,
  Send,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  X as CloseIcon,
} from 'lucide-react';

interface DashboardPageProps {
  onSelectTender: (tender: Tender) => void;
  openConsortiumBuilder: (tender?: Tender) => void;
  openUpgradeModal: (planCode: 'basic' | 'premium') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectTender,
  openConsortiumBuilder,
  openUpgradeModal,
}) => {
  const {
    currentWorkshop,
    currentUser,
    activeRole,
    tenders,
    consortiums,
    consortiumMembers,
    tenderApplications,
    contractSegments,
    tasks,
    updateWorkshop,
    respondToConsortiumInvite,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'applications' | 'invitations' | 'billing'
  >('overview');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [monthlyCapacityUnits, setMonthlyCapacityUnits] = useState(
    currentWorkshop?.monthlyCapacityUnits || 150
  );
  const [workerCount, setWorkerCount] = useState(currentWorkshop?.workerCount || 15);
  const [availabilityStatus, setAvailabilityStatus] = useState(
    currentWorkshop?.availabilityStatus || 'available'
  );

  const myInvitations = consortiumMembers.filter(
    m => m.workshopId === currentWorkshop?.id && m.status === 'invited'
  );

  const myActiveConsortiaMemberships = consortiumMembers.filter(
    m => m.workshopId === currentWorkshop?.id && (m.status === 'accepted' || m.status === 'approved')
  );

  const myApplicationsList = tenderApplications.filter(
    a => a.workshopId === currentWorkshop?.id
  );

  const handleSaveProfile = async () => {
    if (!currentWorkshop) return;
    await updateWorkshop(currentWorkshop.id, {
      monthlyCapacityUnits,
      workerCount,
      availabilityStatus: availabilityStatus as any,
    });
    setIsEditingProfile(false);
  };

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Verified Workshop
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Verification Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-red-50 text-red-800 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Verification Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
            Unverified
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Summary Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xl shrink-0">
            {currentWorkshop?.businessName?.charAt(0) || 'W'}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {currentWorkshop?.businessName || 'Ethiopian Craftsmen Cluster'}
              </h1>
              {getVerificationBadge(currentWorkshop?.verificationStatus)}
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-800 capitalize">
                {activeRole} Tier
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Location: <strong>{currentWorkshop?.city || 'Nationwide Hub'}</strong> ({currentWorkshop?.area || 'Industrial Fabrication Zone'}) · Contact: {currentWorkshop?.ownerName || currentUser?.displayName} ({currentWorkshop?.phone})
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
              <span>Monthly Capacity: <strong>{currentWorkshop?.monthlyCapacityUnits || 150} Units</strong></span>
              <span>·</span>
              <span>Workforce: <strong>{currentWorkshop?.workerCount || 16} Craftsmen</strong></span>
              <span>·</span>
              <span>Status: <strong className="text-emerald-700 capitalize">{currentWorkshop?.availabilityStatus || 'Available'}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {activeRole !== 'premium' && (
            <button
              onClick={() => openUpgradeModal('premium')}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Upgrade to Premium</span>
            </button>
          )}
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${activeTab === 'overview' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Workspace Overview
        </button>
        <button
          onClick={() => setActiveTab('invitations')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'invitations' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          <span>Consortium Invitations</span>
          {myInvitations.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
              {myInvitations.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${activeTab === 'applications' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          My Tender Expressions (EOI)
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${activeTab === 'profile' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Workshop Capacity & Machinery
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${activeTab === 'billing' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Subscription & Billing
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Actionable Prompt Card: Answers "What should the user do next?" */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <strong className="text-teal-950 font-bold text-sm block">
                Next Operational Action for {currentWorkshop?.businessName || 'Your Workshop'}:
              </strong>
              <p className="text-teal-900 leading-relaxed">
                {myInvitations.length > 0
                  ? `You have ${myInvitations.length} pending consortium invitation(s). Review the proposed capacity quotas and sign mutual consent.`
                  : 'Browse currently open MoE school furniture and CBE teller desk tenders to express interest or form a new collaborative cluster.'}
              </p>
            </div>
            {myInvitations.length > 0 ? (
              <button
                onClick={() => setActiveTab('invitations')}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded cursor-pointer shrink-0"
              >
                Review Invitations Now
              </button>
            ) : (
              <button
                onClick={() => onSelectTender(tenders[0])}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded cursor-pointer shrink-0"
              >
                View Top Matching Tender
              </button>
            )}
          </div>

          {/* Quick Metrics 4-grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Declared Monthly Cap</span>
              <strong className="text-xl font-bold text-slate-900 font-mono">
                {currentWorkshop?.monthlyCapacityUnits || 150} Units
              </strong>
              <span className="text-[11px] text-slate-500 block mt-1">Available for allocation</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Active Consortiums</span>
              <strong className="text-xl font-bold text-teal-700 font-mono">
                {myActiveConsortiaMemberships.length} Groups
              </strong>
              <span className="text-[11px] text-slate-500 block mt-1">Participating lots</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Pending Invitations</span>
              <strong className="text-xl font-bold text-amber-600 font-mono">
                {myInvitations.length}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-1">Requires your consent</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Submitted EOIs</span>
              <strong className="text-xl font-bold text-slate-900 font-mono">
                {myApplicationsList.length}
              </strong>
              <span className="text-[11px] text-slate-500 block mt-1">In review by organizers</span>
            </div>
          </div>

          {/* Active Consortium Assignments */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Your Current Consortium Memberships & Responsibilities
                </h3>
                <p className="text-[11px] text-slate-500">
                  Active contracts where your workshop has agreed to produce assigned parcels
                </p>
              </div>
            </div>

            {myActiveConsortiaMemberships.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No active consortium production lots assigned yet. Explore open tenders to express interest.
              </div>
            ) : (
              <div className="space-y-3">
                {myActiveConsortiaMemberships.map(membership => {
                  const c = consortiums.find(item => item.id === membership.consortiumId);
                  return (
                    <div
                      key={membership.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {c?.name || 'Institutional Joint Consortium'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            ({membership.roleInConsortium.toUpperCase()})
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          <strong>Assigned Work:</strong> {membership.assignedSegment || 'General Wood & Steel Fabrication'}
                        </p>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span>Committed: <strong>{membership.allocatedQuantity} Units</strong></span>
                          <span>·</span>
                          <span>Allocated Value: <strong className="text-teal-800 font-mono">{membership.allocatedAmountETB.toLocaleString()} ETB</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Affirmative Consent Confirmed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Invitations */}
      {activeTab === 'invitations' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Consortium Invitations Awaiting Your Consent
            </h3>
            <p className="text-xs text-slate-500">
              Under platform rules, you cannot be assigned to a consortium without affirmative consent to the terms, quantity, and payment share.
            </p>
          </div>

          {myInvitations.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 space-y-1">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-semibold text-slate-800">You are all caught up!</p>
              <p>No pending consortium invitations at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myInvitations.map(inv => {
                const c = consortiums.find(item => item.id === inv.consortiumId);
                return (
                  <div
                    key={inv.id}
                    className="p-5 rounded-lg border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {c?.name || 'Joint Consortium Invitation'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-semibold uppercase">
                          Action Required
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs">
                        Proposed Scope: <strong>{inv.assignedSegment}</strong>
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-slate-600 pt-1">
                        <div>Allocated Share: <strong className="text-slate-900">{inv.allocatedQuantity} Units</strong></div>
                        <div>Estimated Value: <strong className="text-teal-800 font-mono font-bold">{inv.allocatedAmountETB.toLocaleString()} ETB</strong></div>
                        <div>Role: <strong className="capitalize">{inv.roleInConsortium}</strong></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => respondToConsortiumInvite(inv.id, false)}
                        className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-semibold cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => respondToConsortiumInvite(inv.id, true)}
                        className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept & Sign Terms</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Expressions of Interest (EOI) Submitted by Your Workshop
            </h3>
            <p className="text-slate-500">
              Track your expressions of interest across published institutional tenders
            </p>
          </div>

          {myApplicationsList.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
              No expressions of interest submitted yet. Visit the Tenders catalog to express interest in eligible bids.
            </div>
          ) : (
            <div className="space-y-3">
              {myApplicationsList.map(app => (
                <div
                  key={app.id}
                  className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm">{app.tenderTitle}</span>
                    <p className="text-slate-600">
                      Offered Monthly Capacity: <strong>{app.availableCapacity} Units</strong> · Notes: {app.notes}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      Submitted on: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 uppercase">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Workshop Operational Profile</h3>
              <p className="text-slate-500">
                Audited machinery, craftsman workforce, and monthly manufacturing capacity
              </p>
            </div>
            {!isEditingProfile ? (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold cursor-pointer flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Capacity</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5 text-teal-400" />
                  <span>Save Updates</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Declared Monthly Capacity</span>
                {isEditingProfile ? (
                  <input
                    type="number"
                    value={monthlyCapacityUnits}
                    onChange={e => setMonthlyCapacityUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold bg-white"
                  />
                ) : (
                  <span className="font-mono font-bold text-slate-900 text-base">
                    {currentWorkshop?.monthlyCapacityUnits || 150} Units / Month
                  </span>
                )}
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Workforce Size</span>
                {isEditingProfile ? (
                  <input
                    type="number"
                    value={workerCount}
                    onChange={e => setWorkerCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold bg-white"
                  />
                ) : (
                  <span className="font-mono font-bold text-slate-900 text-base">
                    {currentWorkshop?.workerCount || 16} Active Craftsmen
                  </span>
                )}
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Contract Availability</span>
                {isEditingProfile ? (
                  <select
                    value={availabilityStatus}
                    onChange={e => setAvailabilityStatus(e.target.value as 'available' | 'partially_available' | 'busy')}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="partially_available">Partially Available</option>
                    <option value="busy">Busy (Full)</option>
                  </select>
                ) : (
                  <span className="font-semibold text-emerald-800 capitalize">
                    {currentWorkshop?.availabilityStatus || 'Available'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-semibold text-slate-700 block mb-1.5">Specialized Machinery</span>
                <div className="flex flex-wrap gap-1.5">
                  {(currentWorkshop?.machinery || ['Table Saw', 'Thickness Planer', 'Arc Welding Rig', 'Spray Booth']).map(m => (
                    <span key={m} className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 text-[11px] font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1.5">Product Specialties</span>
                <div className="flex flex-wrap gap-1.5">
                  {(currentWorkshop?.specialties || ['School Desks', 'Office Desks', 'Metal-Frame Chairs']).map(s => (
                    <span key={s} className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded text-[11px] font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Billing */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subscription & Monitored Entitlements</h3>
              <p className="text-slate-500">
                Manage your platform membership tier and billing records in ETB
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  {activeRole} Membership Tier
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold uppercase">
                  Active
                </span>
              </div>
              <p className="text-slate-600 mt-1">
                {activeRole === 'premium'
                  ? 'Includes priority consortium matching, first right of refusal on eligible segments, and direct organizer rights.'
                  : 'Includes small-to-medium consortium bidding, expression of interest submissions, and shared workspace.'}
              </p>
            </div>

            {activeRole !== 'premium' && (
              <button
                onClick={() => openUpgradeModal('premium')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded cursor-pointer shrink-0"
              >
                Upgrade to Premium (3,500 ETB/mo)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
