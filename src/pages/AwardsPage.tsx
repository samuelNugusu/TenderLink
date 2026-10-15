import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TenderAward } from '../types';
import {
  Award,
  Search,
  CheckCircle,
  AlertCircle,
  Building,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const AwardsPage: React.FC = () => {
  const { tenderAwards } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAwards = tenderAwards.filter(a => {
    const matchQuery =
      a.tenderTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tenderReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.buyerOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.awardedSupplier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'all' || a.productCategory === selectedCategory;

    return matchQuery && matchCategory;
  });

  const totalDisclosedAwardValue = tenderAwards.reduce((acc, a) => acc + (a.awardAmountETB || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold tracking-wide">
            <span>PUBLIC PROCUREMENT TRANSPARENCY ARCHIVE</span>
            <span>·</span>
            <span>VERIFIED BID RESULTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Historical Winning Bids & Contract Awards
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Searchable record of past institutional furniture contracts awarded in Ethiopia. Grounded in public gazettes, agency bulletins, and verified bid openings.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Total Disclosed Volume</span>
            <strong className="text-teal-800 text-sm font-bold font-mono">
              {(totalDisclosedAwardValue / 1000000).toFixed(2)} Million ETB
            </strong>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by buyer, tender title, reference, or awarded supplier..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="School Furniture">School Furniture</option>
            <option value="Industrial & Postal Utility Furniture">Industrial & Utility</option>
            <option value="Dormitory Furniture">Dormitory Furniture</option>
          </select>
        </div>
      </div>

      {/* Awards Table / Cards */}
      <div className="space-y-4">
        {filteredAwards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-2">
            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No award records found</h3>
            <p className="text-xs text-slate-500">Try modifying your query or category filter.</p>
          </div>
        ) : (
          filteredAwards.map(award => (
            <div
              key={award.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-teal-500 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>{award.tenderReference}</span>
                  <span>·</span>
                  <span className="font-sans text-slate-700 font-medium">{award.productCategory}</span>
                  <span>·</span>
                  <span className="font-sans text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Official Record
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {award.tenderTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Buyer: <strong>{award.buyerOrganization}</strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Awarded: {award.awardDate}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                  <div>
                    <span className="text-slate-500">Awarded Supplier / Joint Venture: </span>
                    <strong className="text-slate-900">{award.awardedSupplier}</strong>
                  </div>
                  {award.notes && <p className="text-[11px] text-slate-600">{award.notes}</p>}
                </div>
              </div>

              <div className="text-left md:text-right shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-400 block">Total Contract Award</span>
                <span className="font-bold text-teal-800 text-lg font-mono">
                  {award.awardAmountETB.toLocaleString()} ETB
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Delivered: {award.quantityAwarded} units
                </span>
                <div className="text-[10px] text-slate-400 pt-1">
                  Source: {award.officialSource}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Disclaimer on Public Records */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
        <strong className="text-slate-800 font-semibold block flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          Transparency & Privacy Guard:
        </strong>
        <p>
          Historical awards are sourced strictly from official procurement gazettes and published public bid opening protocols. TenderLink Ethiopia protects workshop proprietary bid unit margins and never discloses confidential commercial pricing without prior authorization.
        </p>
      </div>
    </div>
  );
};
