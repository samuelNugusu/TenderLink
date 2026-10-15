import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Tender } from '../types';
import {
  Search,
  Filter,
  Building,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
  ChevronRight,
  Info,
} from 'lucide-react';

interface TendersPageProps {
  onSelectTender: (tender: Tender) => void;
  onOpenConsortiumBuilder: (tender: Tender) => void;
}

export const TendersPage: React.FC<TendersPageProps> = ({
  onSelectTender,
  onOpenConsortiumBuilder,
}) => {
  const { tenders, activeRole, currentWorkshop, lang } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'budget' | 'quantity'>('deadline');

  const categories = useMemo(() => {
    const set = new Set<string>();
    tenders.forEach(t => {
      if (t.productCategory) set.add(t.productCategory);
    });
    return Array.from(set);
  }, [tenders]);

  const filteredTenders = useMemo(() => {
    return tenders.filter(t => {
      const matchQuery =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'all' || t.productCategory === selectedCategory;
      const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const matchLocation = selectedLocation === 'all' || t.destinationCity === selectedLocation;

      return matchQuery && matchCategory && matchStatus && matchLocation;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime();
      }
      if (sortBy === 'budget') {
        return (b.estimatedBudgetETB || 0) - (a.estimatedBudgetETB || 0);
      }
      if (sortBy === 'quantity') {
        return b.requiredQuantity - a.requiredQuantity;
      }
      return 0;
    });
  }, [tenders, searchQuery, selectedCategory, selectedStatus, selectedLocation, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold tracking-wide">
            <span>OFFICIAL PROCUREMENT DOSSIERS</span>
            <span>·</span>
            <span>NATIONWIDE PROCUREMENTS · ALL REGIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {lang === 'am' ? 'የተቋማት የእንጨትና ብረት ጨረታዎች' : 'Institutional Furniture Tender Opportunities'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'am'
              ? 'የተረጋገጡ የትምህርት ቤት፣ የባንክና የጤና ተቋማት ጨረታዎች። ብቻዎን ወይም በጋራ ማህበር ሆነው ይጫረቱ።'
              : 'Browse verified public and commercial opportunities across Ethiopia. Bid solo or combine capacity with peer workshops.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-100 p-2.5 rounded-xl border border-slate-200">
          <span className="text-slate-500 font-medium">Active Listings:</span>
          <strong className="text-slate-900 font-bold">{filteredTenders.length}</strong>
        </div>
      </div>

      {/* Helpful Quick Tip Banner for Non-Technical Users */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-teal-900 gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            <strong>{lang === 'am' ? 'ጠቃሚ ምክር:' : 'How to Bid:'}</strong> {lang === 'am'
              ? 'የአውደ-ጥናትዎ አቅም ብቻውን የማይበቃ ከሆነ "የጋራ ማህበር መስርት" የሚለውን ጠቅ በማድረግ ከሌሎች የኢትዮጵያ አውደ-ጥናቶች ጋር በጋራ ይጫረቱ።'
              : 'If a tender requires more units than your shop produces per month, click "Form Consortium" to group with qualified partner workshops across Ethiopia and bid together!'}
          </span>
        </div>
      </div>

      {/* 1-Touch Quick Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => { setSelectedCategory('all'); setSelectedStatus('all'); }}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-colors ${selectedCategory === 'all' && selectedStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          All Tenders ({tenders.length})
        </button>
        <button
          onClick={() => { setSelectedCategory('School Furniture'); setSelectedStatus('all'); }}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-colors ${selectedCategory === 'School Furniture' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          🏫 School Desks
        </button>
        <button
          onClick={() => { setSelectedCategory('Bank & Commercial Counter Interiors'); setSelectedStatus('all'); }}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-colors ${selectedCategory === 'Bank & Commercial Counter Interiors' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          🏦 Bank Counters
        </button>
        <button
          onClick={() => { setSelectedCategory('Healthcare Furniture'); setSelectedStatus('all'); }}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-colors ${selectedCategory === 'Healthcare Furniture' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          🏥 Clinic Couches & Beds
        </button>
        <button
          onClick={() => { setSelectedCategory('Executive Office Furniture'); setSelectedStatus('all'); }}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-colors ${selectedCategory === 'Executive Office Furniture' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          🪑 Executive Office
        </button>
        <button
          onClick={() => { setSelectedCategory('all'); setSelectedStatus('closing_soon'); }}
          className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer transition-colors ${selectedStatus === 'closing_soon' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'}`}
        >
          ⏰ Closing Soon
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by tender title, reference, buyer, or items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
            >
              <option value="all">All Product Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published / Open</option>
              <option value="closing_soon">Closing Soon</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Sort & Secondary Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort Tenders:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSortBy('deadline')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${sortBy === 'deadline' ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Deadline (Soonest)
              </button>
              <button
                onClick={() => setSortBy('budget')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${sortBy === 'budget' ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Budget (Highest)
              </button>
              <button
                onClick={() => setSortBy('quantity')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${sortBy === 'quantity' ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Volume (Quantity)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Official Ethiopian Gazette Sources</span>
            <span>·</span>
            <span>All values in ETB</span>
          </div>
        </div>
      </div>

      {/* Tender List Grid */}
      <div className="space-y-4">
        {filteredTenders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No matching tenders found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your keyword query, category filter, or reset filters to display all opportunities.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedStatus('all'); }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredTenders.map(tender => {
            const isClosingSoon = tender.status === 'closing_soon';

            return (
              <div
                key={tender.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left Info Column */}
                <div className="space-y-2.5 max-w-2xl">
                  {/* Meta strip */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="font-semibold text-slate-800">{tender.referenceNumber}</span>
                    <span>·</span>
                    <span className="font-sans text-slate-600">{tender.productCategory}</span>
                    <span>·</span>
                    <span className={`font-sans text-[11px] px-2 py-0.5 rounded font-medium ${isClosingSoon ? 'bg-red-50 text-red-700 font-semibold' : 'bg-slate-100 text-slate-700'}`}>
                      {tender.status.replace('_', ' ')}
                    </span>
                    {tender.isJointBiddingPermitted && (
                      <span className="font-sans text-[11px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-teal-600" />
                        Joint Bidding Permitted
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onSelectTender(tender)}
                    className="text-base font-bold text-slate-900 hover:text-teal-700 cursor-pointer transition-colors leading-snug"
                  >
                    {tender.title}
                  </h3>

                  {/* Issuing buyer & destination */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {tender.issuingOrganization}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {tender.destinationCity} ({tender.destinationRegion})
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {tender.itemDescription}
                  </p>
                </div>

                {/* Right Metrics & Action Column */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 block">Required Quantity</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {tender.requiredQuantity} {tender.unitType || 'units'}
                    </span>
                    <div className="text-xs text-teal-800 font-semibold mt-0.5">
                      {tender.estimatedBudgetETB ? `${tender.estimatedBudgetETB.toLocaleString()} ETB` : 'Budget on Request'}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-red-600 font-medium mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Deadline: {tender.submissionDeadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenConsortiumBuilder(tender)}
                      className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded cursor-pointer transition-colors flex items-center gap-1.5"
                      title="Form joint consortium with peer workshops"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      <span>Form Consortium</span>
                    </button>
                    <button
                      onClick={() => onSelectTender(tender)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer transition-colors shadow-sm flex items-center gap-1"
                    >
                      <span>View Details & Bid</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
