import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Workshop, Tender, TenderAward, VerificationStatus } from '../types';
import {
  ShieldCheck,
  Building2,
  FileText,
  Award,
  Users,
  CreditCard,
  Download,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Clock,
  Database,
  History,
  Sparkles,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    workshops,
    tenders,
    consortiums,
    tenderAwards,
    paymentRecords,
    auditLogs,
    verifyWorkshop,
    createTender,
    updateTender,
    createTenderAward,
    verifySubscriptionPayment,
    exportOperationalReportCSV,
    seedDatabase,
    isLoading,
  } = useApp();

  const [adminTab, setAdminTab] = useState<
    'overview' | 'workshops' | 'tenders' | 'awards' | 'payments' | 'audit'
  >('overview');

  // Tender Creation Form State
  const [isCreatingTender, setIsCreatingTender] = useState(false);
  const [tenderForm, setTenderForm] = useState({
    referenceNumber: '',
    title: '',
    issuingOrganization: '',
    productCategory: 'School Furniture',
    destinationCity: 'Addis Ababa',
    destinationRegion: 'Addis Ababa',
    submissionDeadline: '2026-05-15',
    estimatedBudgetETB: 4500000,
    requiredQuantity: 300,
    unitType: 'desk sets',
    itemDescription: '',
    technicalSpecs: '',
    qualificationsRequired: 'Renewed business license in furniture manufacturing, TIN/VAT clearance',
    deliveryScheduleWeeks: 6,
    submissionMethod: 'Sealed physical envelope & electronic portal',
    status: 'published' as Tender['status'],
    isVerified: true,
    isJointBiddingPermitted: true,
  });

  // Award Creation Form State
  const [isCreatingAward, setIsCreatingAward] = useState(false);
  const [awardForm, setAwardForm] = useState({
    tenderReference: '',
    tenderTitle: '',
    buyerOrganization: '',
    awardedSupplier: '',
    awardDate: '2025-12-10',
    awardAmountETB: 3500000,
    productCategory: 'School Furniture',
    quantityAwarded: 400,
    officialSource: 'Public Procurement Gazette Notice',
    verificationStatus: 'verified' as TenderAward['verificationStatus'],
    notes: 'Joint consortium delivery verified.',
  });

  const handleCreateTenderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTender({
      ...tenderForm,
      publishedDate: new Date().toISOString().split('T')[0],
    });
    setIsCreatingTender(false);
  };

  const handleCreateAwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTenderAward(awardForm);
    setIsCreatingAward(false);
  };

  const pendingWorkshops = workshops.filter(w => w.verificationStatus === 'pending_review');
  const verifiedWorkshops = workshops.filter(w => w.verificationStatus === 'verified');
  const pendingPayments = paymentRecords.filter(p => p.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
            <ShieldCheck className="w-4 h-4" />
            <span>ADMINISTRATIVE GOVERNANCE CONSOLE</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Platform Administration & Compliance</h1>
          <p className="text-xs text-slate-400">
            Audit workshop declarations, publish verified tenders, authorize subscription payments, and export compliance reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportOperationalReportCSV}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={seedDatabase}
            disabled={isLoading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Database className="w-4 h-4 text-teal-400" />
            <span>Reseed Firestore</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs overflow-x-auto pb-1">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${adminTab === 'overview' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Overview & KPIs
        </button>
        <button
          onClick={() => setAdminTab('workshops')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${adminTab === 'workshops' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          <span>Workshop Verifications</span>
          {pendingWorkshops.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingWorkshops.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setAdminTab('tenders')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${adminTab === 'tenders' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Tenders & Listings
        </button>
        <button
          onClick={() => setAdminTab('awards')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${adminTab === 'awards' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Historical Awards
        </button>
        <button
          onClick={() => setAdminTab('payments')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${adminTab === 'payments' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          <span>Subscription Payments</span>
          {pendingPayments.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingPayments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setAdminTab('audit')}
          className={`px-4 py-2 font-medium rounded-t-lg transition-colors cursor-pointer ${adminTab === 'audit' ? 'border-b-2 border-teal-600 text-teal-800 font-bold bg-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          Compliance Audit Log
        </button>
      </div>

      {/* Tab: Overview */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Total Workshops</span>
              <strong className="text-2xl font-bold text-slate-900 font-mono">
                {workshops.length}
              </strong>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                {verifiedWorkshops.length} Verified
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Published Tenders</span>
              <strong className="text-2xl font-bold text-teal-700 font-mono">
                {tenders.length}
              </strong>
              <div className="text-[11px] text-slate-500 mt-1">Open for bidding</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Active Consortia</span>
              <strong className="text-2xl font-bold text-slate-900 font-mono">
                {consortiums.length}
              </strong>
              <div className="text-[11px] text-slate-500 mt-1">Collaborative groups</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block">Pending Verifications</span>
              <strong className="text-2xl font-bold text-amber-600 font-mono">
                {pendingWorkshops.length}
              </strong>
              <div className="text-[11px] text-slate-500 mt-1">Awaiting admin review</div>
            </div>
          </div>

          {/* Quick Action Queue */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Priority Verification Queue</h3>
            {pendingWorkshops.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No pending workshop profiles requiring review.</p>
            ) : (
              <div className="space-y-3">
                {pendingWorkshops.map(ws => (
                  <div
                    key={ws.id}
                    className="p-4 rounded-lg border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{ws.businessName}</span>
                      <p className="text-slate-600 mt-0.5">
                        Owner: {ws.ownerName} · Location: {ws.city} ({ws.area}) · Monthly Cap: {ws.monthlyCapacityUnits} Units
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>Machinery: {ws.machinery.slice(0, 3).join(', ')}</span>
                        <span>·</span>
                        <span>Workers: {ws.workerCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => verifyWorkshop(ws.id, 'rejected')}
                        className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-red-600 rounded font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => verifyWorkshop(ws.id, 'verified')}
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded cursor-pointer shadow-sm"
                      >
                        Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Workshops */}
      {adminTab === 'workshops' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">All Registered Workshops</h3>
            <span className="text-slate-500">Total: {workshops.length}</span>
          </div>

          <div className="space-y-3">
            {workshops.map(ws => (
              <div
                key={ws.id}
                className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{ws.businessName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {ws.verificationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Owner: {ws.ownerName} · {ws.phone} · {ws.email} · {ws.area}, {ws.city}
                  </p>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span>Monthly: <strong>{ws.monthlyCapacityUnits} Units</strong></span>
                    <span>·</span>
                    <span>Craftsmen: <strong>{ws.workerCount}</strong></span>
                    <span>·</span>
                    <span>Machinery: {ws.machinery.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {ws.verificationStatus !== 'verified' && (
                    <button
                      onClick={() => verifyWorkshop(ws.id, 'verified')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold cursor-pointer"
                    >
                      Verify
                    </button>
                  )}
                  {ws.verificationStatus !== 'suspended' && (
                    <button
                      onClick={() => verifyWorkshop(ws.id, 'suspended')}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded cursor-pointer"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Tenders */}
      {adminTab === 'tenders' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manage Tenders</h3>
              <p className="text-slate-500">Create, publish, edit deadlines, or close procurement opportunities</p>
            </div>
            <button
              onClick={() => setIsCreatingTender(!isCreatingTender)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>{isCreatingTender ? 'Cancel' : 'Create New Tender'}</span>
            </button>
          </div>

          {/* Create Form */}
          {isCreatingTender && (
            <form onSubmit={handleCreateTenderSubmit} className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Enter Official Tender Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Unique Reference Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ET-MOE-NCB-2026-050"
                    value={tenderForm.referenceNumber}
                    onChange={e => setTenderForm({ ...tenderForm, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tender Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Supply of 500 Double School Desks"
                    value={tenderForm.title}
                    onChange={e => setTenderForm({ ...tenderForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Issuing Buyer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ministry of Education"
                    value={tenderForm.issuingOrganization}
                    onChange={e => setTenderForm({ ...tenderForm, issuingOrganization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Required Quantity (Units) *</label>
                  <input
                    type="number"
                    required
                    value={tenderForm.requiredQuantity}
                    onChange={e => setTenderForm({ ...tenderForm, requiredQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Estimated Budget (ETB)</label>
                  <input
                    type="number"
                    value={tenderForm.estimatedBudgetETB}
                    onChange={e => setTenderForm({ ...tenderForm, estimatedBudgetETB: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={tenderForm.submissionDeadline}
                    onChange={e => setTenderForm({ ...tenderForm, submissionDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Product Category</label>
                  <input
                    type="text"
                    value={tenderForm.productCategory}
                    onChange={e => setTenderForm({ ...tenderForm, productCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Scope & Technical Specifications</label>
                <textarea
                  rows={2}
                  value={tenderForm.itemDescription}
                  onChange={e => setTenderForm({ ...tenderForm, itemDescription: e.target.value })}
                  placeholder="Describe material dimensions, frame gauge, finish..."
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="jointBidTender"
                  checked={tenderForm.isJointBiddingPermitted}
                  onChange={e => setTenderForm({ ...tenderForm, isJointBiddingPermitted: e.target.checked })}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="jointBidTender" className="font-semibold text-slate-800 cursor-pointer">
                  Joint Consortium Bidding Permitted by Buyer
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded font-semibold cursor-pointer shadow-sm"
              >
                Publish Tender Listing
              </button>
            </form>
          )}

          {/* Tender List */}
          <div className="space-y-3">
            {tenders.map(t => (
              <div
                key={t.id}
                className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{t.referenceNumber}</span>
                    <span className="text-slate-500">·</span>
                    <span className="font-bold text-slate-900">{t.title}</span>
                  </div>
                  <p className="text-slate-600">
                    Buyer: {t.issuingOrganization} · Target: {t.requiredQuantity} units · Deadline: {t.submissionDeadline}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateTender(t.id, { status: t.status === 'closed' ? 'published' : 'closed' })}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-medium cursor-pointer"
                  >
                    {t.status === 'closed' ? 'Reopen' : 'Close'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Awards */}
      {adminTab === 'awards' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6 text-xs text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manage Historical Award Records</h3>
              <p className="text-slate-500">Record officially disclosed bids and winning consortia</p>
            </div>
            <button
              onClick={() => setIsCreatingAward(!isCreatingAward)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>{isCreatingAward ? 'Cancel' : 'Enter Award Record'}</span>
            </button>
          </div>

          {isCreatingAward && (
            <form onSubmit={handleCreateAwardSubmit} className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Historical Tender Award Entry
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Tender Reference *</label>
                  <input
                    type="text"
                    required
                    value={awardForm.tenderReference}
                    onChange={e => setAwardForm({ ...awardForm, tenderReference: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tender Title *</label>
                  <input
                    type="text"
                    required
                    value={awardForm.tenderTitle}
                    onChange={e => setAwardForm({ ...awardForm, tenderTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Buyer Organization *</label>
                  <input
                    type="text"
                    required
                    value={awardForm.buyerOrganization}
                    onChange={e => setAwardForm({ ...awardForm, buyerOrganization: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Awarded Supplier / Consortium *</label>
                  <input
                    type="text"
                    required
                    value={awardForm.awardedSupplier}
                    onChange={e => setAwardForm({ ...awardForm, awardedSupplier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Award Amount (ETB) *</label>
                  <input
                    type="number"
                    required
                    value={awardForm.awardAmountETB}
                    onChange={e => setAwardForm({ ...awardForm, awardAmountETB: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Official Gazette Citation / Reference</label>
                <input
                  type="text"
                  value={awardForm.officialSource}
                  onChange={e => setAwardForm({ ...awardForm, officialSource: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded font-semibold cursor-pointer shadow-sm"
              >
                Save Award Record
              </button>
            </form>
          )}

          <div className="space-y-3">
            {tenderAwards.map(a => (
              <div
                key={a.id}
                className="p-4 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{a.tenderReference}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-900">{a.tenderTitle}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Supplier: <strong>{a.awardedSupplier}</strong> · Buyer: {a.buyerOrganization} ({a.awardDate})
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono font-bold text-teal-800">
                  {a.awardAmountETB.toLocaleString()} ETB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Payments */}
      {adminTab === 'payments' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs text-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Subscription Payment Verifications</h3>
            <p className="text-slate-500">
              Audit reported Telebirr and CBE Birr transaction references and grant plan entitlements
            </p>
          </div>

          {paymentRecords.length === 0 ? (
            <p className="text-slate-500 py-6 text-center">No payment records to verify.</p>
          ) : (
            <div className="space-y-3">
              {paymentRecords.map(pay => (
                <div
                  key={pay.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{pay.workshopName || pay.userEmail}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${pay.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {pay.status}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      Channel: <strong>{pay.paymentMethod}</strong> · Ref: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">{pay.transactionReference}</code>
                    </p>
                    <span className="text-[11px] text-slate-400">Date: {new Date(pay.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-teal-800 text-base">
                      {pay.amountETB.toLocaleString()} ETB
                    </span>
                    {pay.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => verifySubscriptionPayment(pay.id, 'failed')}
                          className="px-2.5 py-1.5 border border-slate-300 text-red-600 rounded cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => verifySubscriptionPayment(pay.id, 'confirmed')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold cursor-pointer shadow-sm"
                        >
                          Confirm & Grant
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Audit */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs text-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Platform Compliance Audit Trail</h3>
              <p className="text-slate-500">Immutable ledger of administrative actions, verifications, and consortium milestones</p>
            </div>
            <button
              onClick={exportOperationalReportCSV}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Trail</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {auditLogs.length === 0 ? (
              <p className="text-slate-500 py-6 text-center">No audit logs recorded yet.</p>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-white hover:bg-slate-50 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="text-slate-500 text-[11px]">Actor: {log.actorEmail}</span>
                    </div>
                    <p className="text-slate-700 text-xs">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
